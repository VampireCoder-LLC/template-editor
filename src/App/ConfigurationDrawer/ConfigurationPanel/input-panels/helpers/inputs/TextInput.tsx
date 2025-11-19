import React, { useState, useRef } from 'react';

import { InputProps, TextField, Tooltip } from '@mui/material';
import { useTemplateFields } from '../../../../../../documents/editor/TemplateFieldsContext';
import TemplateFieldContextMenu from '../../../../../../documents/blocks/helpers/TemplateFieldContextMenu';

type Props = {
  label: string;
  rows?: number;
  placeholder?: string;
  helperText?: string | JSX.Element;
  InputProps?: InputProps;
  defaultValue: string;
  onChange: (v: string) => void;
  enableTemplateFieldsContextMenu?: boolean;
};
export default function TextInput({
  helperText,
  label,
  placeholder,
  rows,
  InputProps,
  defaultValue,
  onChange,
  enableTemplateFieldsContextMenu = false,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const templateFields = useTemplateFields();
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  const isMultiline = typeof rows === 'number' && rows > 1;

  // Handle context menu (right-click)
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (enableTemplateFieldsContextMenu) {
      e.preventDefault();
      e.stopPropagation();

      // Save the current selection/cursor position
      const target = e.currentTarget.querySelector('textarea, input') as HTMLTextAreaElement | HTMLInputElement;
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
    }
  };

  // Handle template field insertion
  const handleInsertField = (fieldName: string) => {
    const handlebarsText = `{{${fieldName}}}`;

    if (savedSelectionRef.current && inputRef.current) {
      const { start, end } = savedSelectionRef.current;
      const newValue = value.substring(0, start) + handlebarsText + value.substring(end);

      setValue(newValue);
      onChange(newValue);

      // Restore focus and set cursor position after the inserted text
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = start + handlebarsText.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const textField = (
    <TextField
      fullWidth
      multiline={isMultiline}
      minRows={rows}
      variant={isMultiline ? 'outlined' : 'standard'}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      InputProps={InputProps}
      inputRef={inputRef}
      value={value}
      onChange={(ev) => {
        const v = ev.target.value;
        setValue(v);
        onChange(v);
      }}
      onContextMenu={handleContextMenu}
    />
  );

  return (
    <>
      {enableTemplateFieldsContextMenu ? (
        <Tooltip title="Right-click to insert template fields" placement="top">
          {textField}
        </Tooltip>
      ) : (
        textField
      )}
      {enableTemplateFieldsContextMenu && (
        <TemplateFieldContextMenu
          anchorPosition={contextMenuPosition}
          onClose={() => setContextMenuPosition(null)}
          onSelectField={handleInsertField}
          fields={templateFields}
        />
      )}
    </>
  );
}
