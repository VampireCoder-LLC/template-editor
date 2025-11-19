import React from 'react';
import { Menu, MenuItem, ListItemText, Typography, Divider } from '@mui/material';
import { TemplateField } from '../../../documents/editor/TemplateFieldsContext';

interface TemplateFieldContextMenuProps {
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onSelectField: (fieldName: string) => void;
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
 * TemplateFieldContextMenu Component
 * 
 * A context menu that displays available template fields and allows users to insert them
 * at the current cursor position using Handlebars syntax.
 */
export default function TemplateFieldContextMenu({
  anchorPosition,
  onClose,
  onSelectField,
  fields,
}: TemplateFieldContextMenuProps) {
  const normalizedFields = normalizeFields(fields);

  const handleFieldClick = (fieldName: string) => {
    onSelectField(fieldName);
    // Note: onClose is called by the parent component after field insertion
  };

  // Don't render if no anchor position (menu is closed)
  if (!anchorPosition) {
    return null;
  }

  // Don't render if no fields available
  if (normalizedFields.length === 0) {
    return (
      <Menu
        open={Boolean(anchorPosition)}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            minWidth: 200,
            maxWidth: 300,
          },
        }}
      >
        <MenuItem disabled>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary">
                No template fields available
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
    );
  }

  return (
    <Menu
      open={Boolean(anchorPosition)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      PaperProps={{
        sx: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          minWidth: 200,
          maxWidth: 300,
          maxHeight: 400,
        },
      }}
    >
      <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
        <ListItemText
          primary={
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              INSERT TEMPLATE FIELD
            </Typography>
          }
        />
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      {normalizedFields.map((field, index) => (
        <MenuItem
          key={index}
          onClick={() => handleFieldClick(field.name)}
          sx={{
            py: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight="medium">
                {field.label || field.name}
              </Typography>
            }
            secondary={
              field.description ? (
                <Typography variant="caption" color="text.secondary">
                  {field.description}
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                  {`{{${field.name}}}`}
                </Typography>
              )
            }
          />
        </MenuItem>
      ))}
    </Menu>
  );
}

