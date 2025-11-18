import React, { useEffect, useRef, useState } from 'react';

import { Box, IconButton, Stack, Tab, Tabs, Tooltip } from '@mui/material';
import { RedoOutlined, UndoOutlined } from '@mui/icons-material';

import { setDocument, setSidebarTab, useInspectorDrawerOpen, useSelectedBlockId, useSelectedSidebarTab, useDocument } from '../../documents/editor/EditorContext';
import { EmailLayoutProps } from '../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';

import ConfigurationPanel from './ConfigurationPanel';
import TemplateFieldsSection, { TemplateField } from './TemplateFieldsSection';
import { UndoRedoControls, UndoRedoProvider } from './UndoRedoContext';

export const INSPECTOR_DRAWER_WIDTH = 400;

interface InspectorDrawerProps {
  templateFields?: (string | TemplateField)[];
}

export default function InspectorDrawer({ templateFields = [] }: InspectorDrawerProps) {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const selectedBlockId = useSelectedBlockId();
  const document = useDocument();

  // Get the selected block's type
  const selectedBlock = selectedBlockId ? document[selectedBlockId] : null;
  const selectedBlockType = selectedBlock?.type;

  // Only show Template Fields tab for Html, Text, and Heading blocks
  const showTemplateFieldsTab =
    selectedBlockId &&
    templateFields.length > 0 &&
    (selectedBlockType === 'Html' || selectedBlockType === 'Text' || selectedBlockType === 'Heading');

  // Undo/Redo state management for EmailLayout
  const undoStackRef = useRef<EmailLayoutProps[]>([]);
  const redoStackRef = useRef<EmailLayoutProps[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Track the state before editing starts (for onBlur-based undo)
  const beforeEditStateRef = useRef<EmailLayoutProps | null>(null);

  // Clear undo/redo stacks when selectedBlockId changes
  useEffect(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    beforeEditStateRef.current = null;
    setCanUndo(false);
    setCanRedo(false);
  }, [selectedBlockId]);

  const updateUndoRedoStates = () => {
    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);
  };

  const handleUndo = () => {
    if (undoStackRef.current.length === 0) return;

    const currentData = selectedBlock?.data as EmailLayoutProps;
    const previousState = undoStackRef.current.pop()!;

    // Push current state to redo stack
    redoStackRef.current.push(currentData);

    // Restore previous state
    if (selectedBlockId) {
      setDocument({ [selectedBlockId]: { type: 'EmailLayout', data: previousState } });
    }

    updateUndoRedoStates();
  };

  const handleRedo = () => {
    if (redoStackRef.current.length === 0) return;

    const currentData = selectedBlock?.data as EmailLayoutProps;
    const nextState = redoStackRef.current.pop()!;

    // Push current state to undo stack
    undoStackRef.current.push(currentData);

    // Restore next state
    if (selectedBlockId) {
      setDocument({ [selectedBlockId]: { type: 'EmailLayout', data: nextState } });
    }

    updateUndoRedoStates();
  };

  const pushToUndoStack = (state: EmailLayoutProps) => {
    undoStackRef.current.push(state);

    // Limit undo stack size to 50
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }

    // Clear redo stack when new change is made
    redoStackRef.current = [];

    updateUndoRedoStates();
  };

  // Called when user starts editing a control (onFocus)
  const startEditing = (state: EmailLayoutProps) => {
    // Only capture the "before" state if we're not already editing
    if (beforeEditStateRef.current === null) {
      beforeEditStateRef.current = { ...state };
    }
  };

  // Called when user finishes editing a control (onBlur)
  const finishEditing = () => {
    // Push the "before" state to undo stack if it exists
    if (beforeEditStateRef.current !== null) {
      pushToUndoStack(beforeEditStateRef.current);
      beforeEditStateRef.current = null;
    }
  };

  const undoRedoControls: UndoRedoControls | null =
    selectedBlockId === 'root' && selectedBlockType === 'EmailLayout'
      ? {
          canUndo,
          canRedo,
          undo: handleUndo,
          redo: handleRedo,
          pushToUndoStack,
          startEditing,
          finishEditing,
        }
      : null;

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'template-fields':
        return templateFields.length > 0 ? <TemplateFieldsSection fields={templateFields} /> : null;
    }
  };

  // Use absolute positioning to overlay the drawer without affecting canvas width
  // This prevents the editor canvas from shifting when the drawer toggles
  return (
    <UndoRedoProvider controls={undoRedoControls}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: inspectorDrawerOpen ? 0 : -INSPECTOR_DRAWER_WIDTH,
          width: INSPECTOR_DRAWER_WIDTH,
          height: '100%',
          borderLeft: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          transition: 'right 0.3s ease-in-out',
          zIndex: 10,
          boxShadow: inspectorDrawerOpen ? '-2px 0 8px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        <Box sx={{ height: 49, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} height="100%">
            <Tabs value={selectedSidebarTab} onChange={(_, v) => setSidebarTab(v)}>
              {selectedBlockId && <Tab value="block-configuration" label="Configuration" />}
              {showTemplateFieldsTab && <Tab value="template-fields" label="Template Fields" />}
            </Tabs>

            {/* Show undo/redo buttons only when EmailLayout (root) is selected */}
            {undoRedoControls && (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Undo">
                  <span>
                    <IconButton size="small" disabled={!undoRedoControls.canUndo} onClick={undoRedoControls.undo}>
                      <UndoOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Redo">
                  <span>
                    <IconButton size="small" disabled={!undoRedoControls.canRedo} onClick={undoRedoControls.redo}>
                      <RedoOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Box>
        <Box
          sx={{
            height: 'calc(100% - 49px)',
            overflowX: 'hidden',
            overflowY: 'auto',
            // Custom scrollbar styling - thin, auto-hide, fade-out
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
              transition: 'background 0.3s ease',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(0, 0, 0, 0.4)',
            },
            // Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
          }}
        >
          {/* Main Panel Content */}
          {renderCurrentSidebarPanel()}
        </Box>
      </Box>
    </UndoRedoProvider>
  );
}
