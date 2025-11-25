import React, { useState, useRef } from 'react';
import { Box, Chip, Popover } from '@mui/material';
import { TemplateField } from '../../editor/TemplateFieldsContext';
import TemplateFieldMenu from './TemplateFieldMenu';

interface TemplateFieldFloatingButtonProps {
  /** Position of the button relative to its container */
  position: { top: number; left: number } | null;

  /** Whether user is currently typing (affects opacity) */
  isTyping: boolean;

  /** Whether to show the button at all */
  show: boolean;

  /** Available template fields */
  fields: (string | TemplateField)[];

  /** Callback when a field is selected */
  onSelectField: (fieldName: string) => void;

  /** Reference to the container element for boundary checks */
  containerRef: React.RefObject<HTMLElement>;

  /** Callback when menu open state changes */
  onMenuOpenChange?: (isOpen: boolean) => void;
}

/**
 * TemplateFieldFloatingButton Component
 * 
 * A floating button with {{}} badge that follows the cursor position.
 * Shows reduced opacity while typing, full opacity when user stops.
 * Opens a popover menu with available template fields.
 */
export default function TemplateFieldFloatingButton({
  position,
  isTyping,
  show,
  fields,
  onSelectField,
  containerRef,
  onMenuOpenChange,
}: TemplateFieldFloatingButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Don't render if not shown or no position
  if (!show || !position) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent blur event on the input
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure button ref is set before opening menu
    if (buttonRef.current) {
      setMenuOpen(true);
      onMenuOpenChange?.(true);
    }
  };

  const handleClose = () => {
    setMenuOpen(false);
    onMenuOpenChange?.(false);
  };

  const handleSelectField = (fieldName: string) => {
    onSelectField(fieldName);
    setMenuOpen(false);
    onMenuOpenChange?.(false);
  };

  // Adjust position to keep button within container bounds
  const getAdjustedPosition = () => {
    if (!containerRef.current || !position) return position;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonWidth = 50; // Approximate button width
    const buttonHeight = 24; // Button height

    let { top, left } = position;

    // Keep within horizontal bounds
    if (left + buttonWidth > containerRect.width) {
      left = containerRect.width - buttonWidth - 8;
    }
    
    // Keep within vertical bounds
    if (top + buttonHeight > containerRect.height) {
      top = containerRect.height - buttonHeight - 8;
    }

    // Ensure minimum position
    left = Math.max(8, left);
    top = Math.max(8, top);

    return { top, left };
  };

  const adjustedPosition = getAdjustedPosition();

  return (
    <>
      <Box
        ref={buttonRef}
        sx={{
          position: 'absolute',
          top: `${adjustedPosition.top}px`,
          left: `${adjustedPosition.left}px`,
          opacity: isTyping ? 0.5 : 1.0,
          transform: isTyping ? 'scale(0.95)' : 'scale(1)',
          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
          zIndex: 100,
          pointerEvents: 'auto',
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <Chip
          label="{{}}"
          size="small"
          sx={{
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            height: 24,
            boxShadow: 2,
            backgroundColor: 'background.paper',
            '&:hover': {
              boxShadow: 4,
              backgroundColor: 'action.hover',
            },
            '&:active': {
              boxShadow: 1,
            },
          }}
        />
      </Box>

      <Popover
        open={menuOpen && buttonRef.current !== null}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            mt: 1,
          },
        }}
        // Prevent blur event on the editable element
        disableRestoreFocus
        disableEnforceFocus
        disableAutoFocus
        // Keep the popover mounted to prevent re-rendering issues
        keepMounted={false}
      >
        <TemplateFieldMenu
          fields={fields}
          onSelectField={handleSelectField}
          onClose={handleClose}
        />
      </Popover>
    </>
  );
}
