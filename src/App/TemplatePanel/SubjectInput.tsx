import React, { useState, useRef } from 'react';

import { MailOutlineOutlined } from '@mui/icons-material';
import { Stack, TextField, Tooltip, Typography } from '@mui/material';

import { useDocument, setDocument } from '../../documents/editor/EditorContext';
import { useTemplateFields } from '../../documents/editor/TemplateFieldsContext';
import TemplateFieldContextMenu from '../../documents/blocks/helpers/TemplateFieldContextMenu';

export default function SubjectInput() {
  const document = useDocument();
  const subject = (document.subject as string) || '';
  const templateFields = useTemplateFields();
  const inputRef = useRef<HTMLInputElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = event.target.value;
    setDocument({ subject: newSubject });
  };

  // Handle context menu (right-click)
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Save the current selection/cursor position
    const target = e.currentTarget.querySelector('input') as HTMLInputElement;
    if (target) {
      savedSelectionRef.current = {
        start: target.selectionStart || 0,
        end: target.selectionEnd || 0,
      };
    }

    setContextMenuPosition({
      top: e.clientY,
      left: e.clientX,
    });
  };

  // Handle template field insertion
  const handleInsertField = (fieldName: string) => {
    const handlebarsText = `{{${fieldName}}}`;

    if (savedSelectionRef.current && inputRef.current) {
      const { start, end } = savedSelectionRef.current;
      const newSubject = subject.substring(0, start) + handlebarsText + subject.substring(end);

      setDocument({ subject: newSubject });

      // Restore focus and set cursor position after the inserted text
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = start + handlebarsText.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }

    // Close the context menu
    setContextMenuPosition(null);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ whiteSpace: 'nowrap' }}>
          <MailOutlineOutlined sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Subject:
          </Typography>
        </Stack>
        <Tooltip title="Right-click to insert template fields" placement="bottom">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter email subject..."
            value={subject}
            onChange={handleChange}
            onContextMenu={handleContextMenu}
            inputRef={inputRef}
            sx={{
              width: 350,
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Tooltip>
      </Stack>
      <TemplateFieldContextMenu
        anchorPosition={contextMenuPosition}
        onClose={() => setContextMenuPosition(null)}
        onSelectField={handleInsertField}
        fields={templateFields}
      />
    </>
  );
}

