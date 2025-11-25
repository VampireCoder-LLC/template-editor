import React, { useState, useRef, useEffect } from 'react';

import { MailOutlineOutlined } from '@mui/icons-material';
import { Box, Stack, TextField, Typography } from '@mui/material';

import { useDocument, setDocument } from '../../documents/editor/EditorContext';
import { useTemplateFields } from '../../documents/editor/TemplateFieldsContext';
import TemplateFieldFloatingButton from '../../documents/blocks/helpers/TemplateFieldFloatingButton';

export default function SubjectInput() {
  const document = useDocument();
  const subject = (document.subject as string) || '';
  const templateFields = useTemplateFields();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  // Floating button state
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [floatingButtonPosition, setFloatingButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = event.target.value;
    setDocument({ subject: newSubject });

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
    setShowFloatingButton(true);
    updateFloatingButtonPosition();
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
    const normalizedSubject = normalizeText(subject);
    if (normalizedSubject !== subject) {
      setDocument({ subject: normalizedSubject });
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
    updateFloatingButtonPosition();
  };

  const handleKeyUp = () => {
    updateFloatingButtonPosition();
  };

  // Handle template field insertion
  const handleInsertField = (fieldName: string) => {
    const handlebarsText = `{{${fieldName}}}`;

    if (savedSelectionRef.current && inputRef.current) {
      const { start, end } = savedSelectionRef.current;

      // Check if we need to add space before the field
      const textBefore = subject.substring(0, start);
      const needsSpaceBefore = start > 0 && textBefore[textBefore.length - 1] !== ' ';

      // Check if we need to add space after the field
      const textAfter = subject.substring(end);
      const charAfter = textAfter.length > 0 ? textAfter[0] : '';

      // Don't add space after if cursor is before these characters or at end of string
      const noSpaceAfterChars = [' ', '.', ',', ':', ';', '<', '>', '(', ')', '!', '?'];
      const needsSpaceAfter = charAfter !== '' && !noSpaceAfterChars.includes(charAfter);

      // Build the text to insert with proper spacing
      const textToInsert = (needsSpaceBefore ? ' ' : '') + handlebarsText + (needsSpaceAfter ? ' ' : '');

      const newSubject = subject.substring(0, start) + textToInsert + subject.substring(end);

      setDocument({ subject: newSubject });

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
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ whiteSpace: 'nowrap' }}>
          <MailOutlineOutlined sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Subject:
          </Typography>
        </Stack>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Enter email subject..."
          value={subject}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          inputRef={inputRef}
          sx={{
            width: 350,
            '& .MuiOutlinedInput-root': {
              fontSize: '0.875rem',
            },
          }}
        />
      </Stack>

      <TemplateFieldFloatingButton
        position={floatingButtonPosition}
        isTyping={isTyping}
        show={showFloatingButton && templateFields.length > 0}
        fields={templateFields}
        onSelectField={handleInsertField}
        containerRef={containerRef}
        onMenuOpenChange={setIsMenuOpen}
      />
    </Box>
  );
}

