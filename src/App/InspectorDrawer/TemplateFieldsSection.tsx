import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { insertTextAtActiveElement, insertTextAtCursor, insertTextInTextarea } from '../../documents/blocks/helpers/insertTextAtCursor';

export interface TemplateField {
  name: string;
  label?: string;
  description?: string;
}

interface TemplateFieldsSectionProps {
  fields: (string | TemplateField)[];
}

/**
 * Normalizes template fields to TemplateField objects
 */
function normalizeFields(fields: (string | TemplateField)[]): TemplateField[] {
  return fields.map((field) => {
    if (typeof field === 'string') {
      return { name: field };
    }
    return field;
  });
}

/**
 * TemplateFieldsSection Component
 * 
 * Displays available template fields in the Inspector panel.
 * Allows users to insert Handlebars syntax while keeping focus on the selected element.
 */
export default function TemplateFieldsSection({ fields }: TemplateFieldsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const focusedElementRef = useRef<HTMLElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const normalizedFields = normalizeFields(fields);

  // Filter fields based on search query
  const filteredFields = normalizedFields.filter((field) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      field.name.toLowerCase().includes(searchLower) ||
      (field.label && field.label.toLowerCase().includes(searchLower)) ||
      (field.description && field.description.toLowerCase().includes(searchLower))
    );
  });

  /**
   * Stores the currently focused editable element and selection before clicking
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const activeElement = document.activeElement as HTMLElement;
    console.log('[TemplateFields] handleMouseDown - activeElement:', activeElement, 'contentEditable:', activeElement?.contentEditable);

    // Store the focused element if it's editable
    if (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement) {
      focusedElementRef.current = activeElement;
      savedRangeRef.current = null;
      console.log('[TemplateFields] Stored textarea/input element');
    } else if (activeElement?.contentEditable === 'true') {
      focusedElementRef.current = activeElement;

      // Save the current selection/range for contentEditable elements
      const selection = window.getSelection();
      console.log('[TemplateFields] Selection:', selection, 'rangeCount:', selection?.rangeCount);
      if (selection && selection.rangeCount > 0) {
        savedRangeRef.current = selection.getRangeAt(0).cloneRange();
        console.log('[TemplateFields] Saved range:', savedRangeRef.current);
      }
    } else {
      console.log('[TemplateFields] Element is not editable');
    }
  };

  /**
   * Handles field insertion using the stored focused element
   */
  const handleInsertField = (fieldName: string) => {
    const handlebarsText = `{{${fieldName}}}`;
    const focusedElement = focusedElementRef.current;

    console.log('[TemplateFields] handleInsertField - fieldName:', fieldName);
    console.log('[TemplateFields] focusedElement:', focusedElement);
    console.log('[TemplateFields] savedRange:', savedRangeRef.current);

    if (!focusedElement) {
      console.log('[TemplateFields] No focused element stored');
      return;
    }

    // Insert into the stored focused element
    if (focusedElement instanceof HTMLTextAreaElement || focusedElement instanceof HTMLInputElement) {
      console.log('[TemplateFields] Inserting into textarea/input');
      insertTextInTextarea(focusedElement, handlebarsText);
    } else if (focusedElement.contentEditable === 'true') {
      console.log('[TemplateFields] Inserting into contentEditable');
      // Restore focus to the contentEditable element
      focusedElement.focus();

      // Restore the saved selection/range
      const selection = window.getSelection();
      console.log('[TemplateFields] Current selection after focus:', selection, 'rangeCount:', selection?.rangeCount);
      if (selection && savedRangeRef.current) {
        console.log('[TemplateFields] Restoring saved range');
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
      }

      const result = insertTextAtCursor(handlebarsText, focusedElement);
      console.log('[TemplateFields] insertTextAtCursor result:', result);
    }
  };

  if (fields.length === 0) {
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Search Field */}
      <TextField
        placeholder="Search fields..."
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />,
        }}
        sx={{ mb: 1.5 }}
      />

      {/* Fields List */}
      {filteredFields.length === 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', p: 1, textAlign: 'center' }}>
          {searchQuery ? 'No fields found' : 'No fields available'}
        </Typography>
      ) : (
        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
          {filteredFields.map((field) => (
            <ListItem key={field.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onMouseDown={(e) => {
                  handleMouseDown(e as any);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInsertField(field.name);
                }}
                sx={{
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#0079cc',
                  },
                  py: 1,
                  px: 1.5,
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: '#0079cc',
                          fontSize: '0.75rem',
                        }}
                      >
                        {`{{${field.name}}}`}
                      </Typography>
                      {field.label && (
                        <Chip
                          label={field.label}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    field.description ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}
                      >
                        {field.description}
                      </Typography>
                    ) : undefined
                  }
                  sx={{ my: 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Footer Info */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Click a field to insert it at your cursor
      </Typography>
    </Box>
  );
}

