import React, { useState, useRef, useEffect } from 'react';
import { Box, Tooltip } from '@mui/material';
import { setDocument, setSelectedBlockId, useDocument, useSelectedBlockId } from '../../../editor/EditorContext';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import { useTemplateFields } from '../../../editor/TemplateFieldsContext';
import TemplateFieldContextMenu from '../TemplateFieldContextMenu';

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
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isInsertingFieldRef = useRef(false);
  const pendingCursorPositionRef = useRef<number | null>(null);

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

  // Handle context menu (right-click)
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only show context menu when editing
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();

      // Save the current selection/cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
      }

      setContextMenuPosition({
        top: e.clientY,
        left: e.clientX,
      });
    }
  };

  // Handle template field insertion
  const handleInsertField = (fieldName: string) => {
    // Set flag to prevent blur from exiting edit mode
    isInsertingFieldRef.current = true;

    const handlebarsText = `{{${fieldName}}}`;

    // Close the context menu first
    setContextMenuPosition(null);

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

          range.deleteContents();
          const textNode = document.createTextNode(handlebarsText);
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
              cursorPosition += startOffset + handlebarsText.length;
              foundInsertionPoint = true;
              break;
            } else if (node === textNode) {
              cursorPosition += handlebarsText.length;
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
              cursorPosition = insertedIndex + handlebarsText.length;
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

  // Handle blur to save changes
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Don't blur if we're currently inserting a field
    if (isInsertingFieldRef.current) {
      e.preventDefault();
      return;
    }

    // Don't blur if the context menu is open
    if (contextMenuPosition !== null) {
      e.preventDefault();
      return;
    }

    // Don't blur if clicking on the context menu
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest('[role="menu"]')) {
      return;
    }

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
    setContextMenuPosition(null);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      // Close context menu if open, otherwise exit edit mode
      if (contextMenuPosition) {
        setContextMenuPosition(null);
      } else {
        setIsEditing(false);
      }
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
          },
        });
      }
      setIsEditing(false);
      setContextMenuPosition(null);
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
    }
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
    };
  }, []);

  // When editing, show raw text; when not editing, show rendered component
  if (isEditing) {
    return (
      <>
        <Tooltip title="Right-click to insert template fields" placement="top">
          <Box
            ref={contentRef}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
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
        </Tooltip>
        <TemplateFieldContextMenu
          anchorPosition={contextMenuPosition}
          onClose={() => setContextMenuPosition(null)}
          onSelectField={handleInsertField}
          fields={templateFields}
        />
      </>
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

