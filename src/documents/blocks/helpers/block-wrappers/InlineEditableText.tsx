import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { setDocument, setSelectedBlockId, useDocument, useSelectedBlockId } from '../../../editor/EditorContext';
import { useCurrentBlockId } from '../../../editor/EditorBlock';

type InlineEditableTextProps = {
  children: JSX.Element;
  blockType: 'Text' | 'Heading';
};

export default function InlineEditableText({ children, blockType }: InlineEditableTextProps) {
  const blockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const editorDocument = useDocument();
  const block = editorDocument[blockId];
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSelected = selectedBlockId === blockId;
  const currentText = block?.data?.props?.text ?? '';

  // Handle click to enter edit mode (double-click or single click when not selected)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSelected) {
      // First click: select the block and enter edit mode
      setSelectedBlockId(blockId);
      // Use setTimeout to ensure state updates before entering edit mode
      clickTimeoutRef.current = setTimeout(() => {
        setIsEditing(true);
      }, 0);
    } else if (isEditing) {
      // Already editing, do nothing
      return;
    } else {
      // Already selected, wait for double-click or enter edit mode after delay
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        // Double-click detected
        setIsEditing(true);
      } else {
        // Single click on selected element - set up for potential double-click
        clickTimeoutRef.current = setTimeout(() => {
          clickTimeoutRef.current = null;
        }, 300);
      }
    }
  };

  // Handle blur to save changes
  const handleBlur = () => {
    const newText = contentRef.current?.textContent || '';
    if (newText !== currentText) {
      setDocument({
        [blockId]: {
          ...block,
          data: {
            ...block.data,
            props: {
              ...block.data.props,
              text: newText,
            },
          },
        },
      });
    }
    setIsEditing(false);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    } else if (e.key === 'Enter' && !e.shiftKey && blockType === 'Heading') {
      // For headings, Enter saves
      e.preventDefault();
      handleBlur();
    }
  };

  // Focus and place cursor at the end when entering edit mode
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Place cursor at the end of the content
      const range = window.document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false); // false = collapse to end
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // When editing, show raw text; when not editing, show rendered component
  if (isEditing) {
    return (
      <Box
        ref={contentRef}
        onClick={handleClick}
        contentEditable={true}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        sx={{
          cursor: 'text',
          outline: '2px solid #0079cc',
          outlineOffset: '-2px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          boxSizing: 'border-box',
          // Apply same padding/styling as the rendered component for consistency
          padding: block?.data?.style?.padding
            ? `${block.data.style.padding.top}px ${block.data.style.padding.right}px ${block.data.style.padding.bottom}px ${block.data.style.padding.left}px`
            : undefined,
          color: block?.data?.style?.color ?? undefined,
          backgroundColor: block?.data?.style?.backgroundColor ?? undefined,
          fontSize: block?.data?.style?.fontSize ?? undefined,
          fontFamily: block?.data?.style?.fontFamily ?? undefined,
          fontWeight: block?.data?.style?.fontWeight ?? undefined,
          fontStyle: block?.data?.style?.fontStyle ?? undefined,
          textAlign: block?.data?.style?.textAlign ?? undefined,
        }}
      >
        {currentText}
      </Box>
    );
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: isSelected ? 'text' : 'default',
        '&:hover': isSelected ? { opacity: 0.8 } : {},
        wordWrap: 'break-word',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
}

