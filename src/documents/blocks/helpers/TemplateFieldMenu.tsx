import React from 'react';
import { MenuList, MenuItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import { TemplateField } from '../../editor/TemplateFieldsContext';

interface TemplateFieldMenuProps {
  fields: (string | TemplateField)[];
  onSelectField: (fieldName: string) => void;
  onClose: () => void;
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
 * TemplateFieldMenu Component
 * 
 * A reusable menu component that displays available template fields.
 * Can be used inside Popover, Menu, or Dialog components.
 */
export default function TemplateFieldMenu({
  fields,
  onSelectField,
  onClose,
}: TemplateFieldMenuProps) {
  const normalizedFields = normalizeFields(fields);

  const handleFieldClick = (fieldName: string) => {
    onSelectField(fieldName);
    onClose();
  };

  // Show message if no fields available
  if (normalizedFields.length === 0) {
    return (
      <Box sx={{ minWidth: 200, maxWidth: 300 }}>
        <MenuList>
          <MenuItem disabled>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  No template fields available
                </Typography>
              }
            />
          </MenuItem>
        </MenuList>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 200, maxWidth: 300, maxHeight: 400 }}>
      <MenuList>
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
      </MenuList>
    </Box>
  );
}
