import React, { useState, useRef, useEffect } from 'react';

import { Box, InputProps, TextField } from '@mui/material';
import { useTemplateFields } from '../../../../../../documents/editor/TemplateFieldsContext';
import TemplateFieldFloatingButton from '../../../../../../documents/blocks/helpers/TemplateFieldFloatingButton';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  // Floating button state
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [floatingButtonPosition, setFloatingButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMultiline = typeof rows === 'number' && rows > 1;

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = ev.target.value;
    setValue(v);
    onChange(v);

    // Mark as typing
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to mark as not typing after 500ms
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  // Update floating button position when input is focused or cursor moves
  const updateFloatingButtonPosition = () => {
    if (!inputRef.current || !containerRef.current) return;

    const input = inputRef.current;
    const container = containerRef.current;

    // Save current cursor position
    savedSelectionRef.current = {
      start: input.selectionStart || 0,
      end: input.selectionEnd || 0,
    };

    // Get input element position relative to container
    const inputRect = input.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Position button at the right side of the input
    const top = inputRect.top - containerRect.top;
    const left = inputRect.right - containerRect.left + 8; // 8px offset from input

    setFloatingButtonPosition({ top, left });
  };

  // Handle focus - show floating button
  const handleFocus = () => {
    if (enableTemplateFieldsContextMenu) {
      setShowFloatingButton(true);
      updateFloatingButtonPosition();
    }
  };

  // Helper function to normalize text spacing
  const normalizeText = (text: string): string => {
    return text
      .trim() // Remove leading and trailing spaces
      .replace(/\s+/g, ' '); // Replace multiple consecutive spaces with a single space
  };

  // Handle blur - hide floating button (unless menu is open) and normalize text
  const handleBlur = () => {
    // Normalize the text content
    const normalizedValue = normalizeText(value);
    if (normalizedValue !== value) {
      setValue(normalizedValue);
      onChange(normalizedValue);
    }

    // Delay hiding to allow clicking the button
    setTimeout(() => {
      // Don't hide if menu is open
      if (!isMenuOpen) {
        setShowFloatingButton(false);
      }
    }, 200);
  };

  // Handle click and selection change
  const handleClick = () => {
    if (enableTemplateFieldsContextMenu) {
      updateFloatingButtonPosition();
    }
  };

  const handleKeyUp = () => {
    if (enableTemplateFieldsContextMenu) {
      updateFloatingButtonPosition();
    }
  };

  // Handle template field insertion
  const handleInsertField = (fieldName: string) => {
    const handlebarsText = `{{${fieldName}}}`;

    if (savedSelectionRef.current && inputRef.current) {
      const { start, end } = savedSelectionRef.current;

      // Check if we need to add space before the field
      const textBefore = value.substring(0, start);
      const needsSpaceBefore = start > 0 && textBefore[textBefore.length - 1] !== ' ';

      // Check if we need to add space after the field
      const textAfter = value.substring(end);
      const charAfter = textAfter.length > 0 ? textAfter[0] : '';

      // Don't add space after if cursor is before these characters or at end of string
      const noSpaceAfterChars = [' ', '.', ',', ':', ';', '<', '>', '(', ')', '!', '?'];
      const needsSpaceAfter = charAfter !== '' && !noSpaceAfterChars.includes(charAfter);

      // Build the text to insert with proper spacing
      const textToInsert = (needsSpaceBefore ? ' ' : '') + handlebarsText + (needsSpaceAfter ? ' ' : '');

      const newValue = value.substring(0, start) + textToInsert + value.substring(end);

      setValue(newValue);
      onChange(newValue);

      // Restore focus and set cursor position after the inserted text
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = start + textToInsert.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          savedSelectionRef.current = { start: newCursorPos, end: newCursorPos };
        }
      }, 0);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
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
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        onKeyUp={handleKeyUp}
      />

      {enableTemplateFieldsContextMenu && (
        <TemplateFieldFloatingButton
          position={floatingButtonPosition}
          isTyping={isTyping}
          show={showFloatingButton && templateFields.length > 0}
          fields={templateFields}
          onSelectField={handleInsertField}
          containerRef={containerRef}
          onMenuOpenChange={setIsMenuOpen}
        />
      )}
    </Box>
  );
}
