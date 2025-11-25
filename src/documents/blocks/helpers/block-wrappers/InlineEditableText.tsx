import React, { useState, useRef, useEffect } from 'react';
import { Box, Tooltip } from '@mui/material';
import { setDocument, setSelectedBlockId, useDocument, useSelectedBlockId } from '../../../editor/EditorContext';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import { useTemplateFields } from '../../../editor/TemplateFieldsContext';
import TemplateFieldFloatingButton from '../TemplateFieldFloatingButton';

type InlineEditableTextProps = {
  children: JSX.Element;
  blockType: 'Text' | 'Heading';
};

export default function InlineEditableText({ children, blockType }: InlineEditableTextProps) {
  const blockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const editorDocument = useDocument();
  const block = editorDocument[blockId];
  const templateFields = useTemplateFields();
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isInsertingFieldRef = useRef(false);
  const pendingCursorPositionRef = useRef<number | null>(null);

  // Floating button state
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [floatingButtonPosition, setFloatingButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Update floating button position based on cursor
  const updateFloatingButtonPosition = () => {
    if (!contentRef.current || !containerRef.current || !isEditing) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Save the current selection
    savedSelectionRef.current = selection.getRangeAt(0).cloneRange();

    // Get the bounding rect of the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Position button to the right of the cursor
    const top = rect.top - containerRect.top;
    const left = rect.right - containerRect.left + 8; // 8px offset

    setFloatingButtonPosition({ top, left });
  };

  // Handle input events to track typing
  const handleInput = () => {
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

    // Update button position
    updateFloatingButtonPosition();
  };

  // Handle selection change (cursor movement)
  const handleSelectionChange = () => {
    if (isEditing && document.activeElement === contentRef.current) {
      updateFloatingButtonPosition();
    }
  };

  // Handle template field insertion
  const handleInsertField = (fieldName: string) => {
    // Set flag to prevent blur from exiting edit mode
    isInsertingFieldRef.current = true;

    const handlebarsText = `{{${fieldName}}}`;

    // Use setTimeout to ensure the menu closes and focus is restored properly
    setTimeout(() => {
      // Restore the saved selection
      if (savedSelectionRef.current && contentRef.current) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelectionRef.current);

          // Insert the text at the cursor position
          const range = selection.getRangeAt(0);
          const startOffset = range.startOffset;
          const startContainer = range.startContainer;

          // Check if we need to add space before the field
          const textBefore = startContainer.textContent?.substring(0, startOffset) || '';
          const needsSpaceBefore = startOffset > 0 && textBefore[textBefore.length - 1] !== ' ';

          // Check if we need to add space after the field
          const textAfter = startContainer.textContent?.substring(startOffset) || '';
          const charAfter = textAfter.length > 0 ? textAfter[0] : '';

          // Don't add space after if cursor is before these characters or at end of string
          const noSpaceAfterChars = [' ', '.', ',', ':', ';', '<', '>', '(', ')', '!', '?'];
          const needsSpaceAfter = charAfter !== '' && !noSpaceAfterChars.includes(charAfter);

          // Build the text to insert with proper spacing
          const textToInsert = (needsSpaceBefore ? ' ' : '') + handlebarsText + (needsSpaceAfter ? ' ' : '');

          range.deleteContents();
          const textNode = document.createTextNode(textToInsert);
          range.insertNode(textNode);

          // Calculate the cursor position in the text content
          // We need to find the position after the inserted text
          const newText = contentRef.current.textContent || '';

          // Find the position by traversing from the start
          let cursorPosition = 0;
          const treeWalker = document.createTreeWalker(
            contentRef.current,
            NodeFilter.SHOW_TEXT,
            null
          );

          let foundInsertionPoint = false;
          while (treeWalker.nextNode()) {
            const node = treeWalker.currentNode;
            if (node === startContainer) {
              cursorPosition += startOffset + textToInsert.length;
              foundInsertionPoint = true;
              break;
            } else if (node === textNode) {
              cursorPosition += textToInsert.length;
              foundInsertionPoint = true;
              break;
            } else {
              cursorPosition += node.textContent?.length || 0;
            }
          }

          // If we couldn't find it through tree walking, calculate based on text content
          if (!foundInsertionPoint) {
            // Find where the handlebars text was inserted
            const insertedIndex = newText.indexOf(handlebarsText);
            if (insertedIndex !== -1) {
              cursorPosition = insertedIndex + textToInsert.length;
            }
          }

          // Store the cursor position to restore after React re-render
          pendingCursorPositionRef.current = cursorPosition;

          // Update the document with the new text
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

          // Reset the flag after a short delay
          setTimeout(() => {
            isInsertingFieldRef.current = false;
          }, 100);
        }
      }
    }, 0);
  };

  // Helper function to normalize text spacing
  const normalizeText = (text: string): string => {
    return text
      .trim() // Remove leading and trailing spaces
      .replace(/\s+/g, ' '); // Replace multiple consecutive spaces with a single space
  };

  // Handle blur to save changes
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Don't blur if we're currently inserting a field
    if (isInsertingFieldRef.current) {
      e.preventDefault();
      return;
    }

    // Delay to allow clicking the floating button
    setTimeout(() => {
      // Don't exit editing mode if menu is open
      if (isMenuOpen) {
        return;
      }

      const newText = contentRef.current?.textContent || '';
      const normalizedText = normalizeText(newText);

      if (normalizedText !== currentText) {
        // Update the content with normalized text
        if (contentRef.current) {
          contentRef.current.textContent = normalizedText;
        }

        setDocument({
          [blockId]: {
            ...block,
            data: {
              ...block.data,
              props: {
                ...block.data.props,
                text: normalizedText,
              },
            },
          } as any,
        });
      }
      setIsEditing(false);
      setShowFloatingButton(false);
    }, 200);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setShowFloatingButton(false);
    } else if (e.key === 'Enter' && !e.shiftKey && blockType === 'Heading') {
      // For headings, Enter saves
      e.preventDefault();
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
          } as any,
        });
      }
      setIsEditing(false);
      setShowFloatingButton(false);
    }
  };

  // Focus and place cursor at the end when entering edit mode
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Place cursor at the end of the content (default behavior)
      const range = window.document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false); // false = collapse to end
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);

      // Show floating button and update position
      setShowFloatingButton(true);
      updateFloatingButtonPosition();

      // Add selection change listener
      document.addEventListener('selectionchange', handleSelectionChange);
    } else {
      // Remove selection change listener when not editing
      document.removeEventListener('selectionchange', handleSelectionChange);
    }

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditing]);

  // Restore cursor position after field insertion (triggered by text change)
  useEffect(() => {
    if (isEditing && contentRef.current && pendingCursorPositionRef.current !== null) {
      const targetPosition = pendingCursorPositionRef.current;
      pendingCursorPositionRef.current = null;

      // Find the text node and offset for the target position
      let currentPosition = 0;
      const treeWalker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      let targetNode: Node | null = null;
      let targetOffset = 0;

      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        const nodeLength = node.textContent?.length || 0;

        if (currentPosition + nodeLength >= targetPosition) {
          targetNode = node;
          targetOffset = targetPosition - currentPosition;
          break;
        }

        currentPosition += nodeLength;
      }

      // If we found the target node, set the cursor position
      if (targetNode) {
        const range = document.createRange();
        range.setStart(targetNode, targetOffset);
        range.setEnd(targetNode, targetOffset);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Keep focus on the editable element
      contentRef.current.focus();
    }
  }, [isEditing, currentText]); // Triggered when text changes after field insertion

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // When editing, show raw text; when not editing, show rendered component
  if (isEditing) {
    return (
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        <Box
          ref={contentRef}
          onClick={handleClick}
          contentEditable={true}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          sx={{
            cursor: 'text',
            outline: '2px solid #0079cc',
            outlineOffset: '-2px',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            boxSizing: 'border-box',
            // Apply same padding/styling as the rendered component for consistency
            padding: (block?.data as any)?.style?.padding
              ? `${(block.data as any).style.padding.top}px ${(block.data as any).style.padding.right}px ${(block.data as any).style.padding.bottom}px ${(block.data as any).style.padding.left}px`
              : undefined,
            color: (block?.data as any)?.style?.color ?? undefined,
            backgroundColor: (block?.data as any)?.style?.backgroundColor ?? undefined,
            fontSize: (block?.data as any)?.style?.fontSize ?? undefined,
            fontFamily: (block?.data as any)?.style?.fontFamily ?? undefined,
            fontWeight: (block?.data as any)?.style?.fontWeight ?? undefined,
            fontStyle: (block?.data as any)?.style?.fontStyle ?? undefined,
            textAlign: (block?.data as any)?.style?.textAlign ?? undefined,
          }}
        >
          {currentText}
        </Box>

        <TemplateFieldFloatingButton
          position={floatingButtonPosition}
          isTyping={isTyping}
          show={showFloatingButton && templateFields.length > 0}
          fields={templateFields}
          onSelectField={handleInsertField}
          containerRef={containerRef as React.RefObject<HTMLElement>}
          onMenuOpenChange={setIsMenuOpen}
        />
      </Box>
    );
  }

  return (
    <Tooltip title="Double-click to edit" placement="top">
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
    </Tooltip>
  );
}

