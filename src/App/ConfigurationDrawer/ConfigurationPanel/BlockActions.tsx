import React, { useState } from 'react';

import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';

import { TEditorBlock } from '../../../documents/editor/core';
import { resetDocument, setSelectedBlockId, useDocument, useSelectedBlockId } from '../../../documents/editor/EditorContext';
import { ColumnsContainerProps } from '../../../documents/blocks/ColumnsContainer/ColumnsContainerPropsSchema';

export default function BlockActions() {
  const editorDocument = useDocument();
  const selectedBlockId = useSelectedBlockId();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!selectedBlockId) {
    return null;
  }

  const block = editorDocument[selectedBlockId];

  const performDelete = () => {
    const filterChildrenIds = (childrenIds: string[] | null | undefined) => {
      if (!childrenIds) {
        return childrenIds;
      }
      return childrenIds.filter((f) => f !== selectedBlockId);
    };
    const nDocument: typeof editorDocument = { ...editorDocument };
    for (const [id, b] of Object.entries(nDocument)) {
      const block = b as TEditorBlock;
      if (id === selectedBlockId) {
        continue;
      }
      switch (block.type) {
        case 'EmailLayout':
          nDocument[id] = {
            ...block,
            data: {
              ...block.data,
              childrenIds: filterChildrenIds(block.data.childrenIds),
            },
          };
          break;
        case 'Container':
          nDocument[id] = {
            ...block,
            data: {
              ...block.data,
              props: {
                ...block.data.props,
                childrenIds: filterChildrenIds(block.data.props?.childrenIds),
              },
            },
          };
          break;
        case 'ColumnsContainer':
          nDocument[id] = {
            type: 'ColumnsContainer',
            data: {
              style: block.data.style,
              props: {
                ...block.data.props,
                columns: block.data.props?.columns?.map((c) => ({
                  childrenIds: filterChildrenIds(c.childrenIds),
                })),
              },
            } as ColumnsContainerProps,
          };
          break;
        default:
          nDocument[id] = block;
      }
    }
    delete nDocument[selectedBlockId];
    resetDocument(nDocument);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    performDelete();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleMoveClick = (direction: 'up' | 'down') => {
    try {
      const moveChildrenIds = (ids: string[] | null | undefined) => {
        if (!ids) {
          return ids;
        }
        const index = ids.indexOf(selectedBlockId);
        if (index < 0) {
          return ids;
        }
        const childrenIds = [...ids];
        if (direction === 'up' && index > 0) {
          [childrenIds[index], childrenIds[index - 1]] = [childrenIds[index - 1], childrenIds[index]];
        } else if (direction === 'down' && index < childrenIds.length - 1) {
          [childrenIds[index], childrenIds[index + 1]] = [childrenIds[index + 1], childrenIds[index]];
        }
        return childrenIds;
      };

      // Create a new document with all blocks
      const nDocument: typeof editorDocument = {};

      // Copy all blocks first
      for (const [id, b] of Object.entries(editorDocument)) {
        nDocument[id] = b;
      }

      // Now update parent blocks with reordered children
      for (const [id, b] of Object.entries(nDocument)) {
        const block = b as TEditorBlock;
        if (id === selectedBlockId) {
          continue;
        }
        switch (block.type) {
          case 'EmailLayout':
            const newEmailLayoutChildren = moveChildrenIds(block.data.childrenIds);
            if (newEmailLayoutChildren !== block.data.childrenIds) {
              nDocument[id] = {
                ...block,
                data: {
                  ...block.data,
                  childrenIds: newEmailLayoutChildren,
                },
              };
            }
            break;
          case 'Container':
            const newContainerChildren = moveChildrenIds(block.data.props?.childrenIds);
            if (newContainerChildren !== block.data.props?.childrenIds) {
              nDocument[id] = {
                ...block,
                data: {
                  ...block.data,
                  props: {
                    ...block.data.props,
                    childrenIds: newContainerChildren,
                  },
                },
              };
            }
            break;
          case 'ColumnsContainer':
            const newColumns = block.data.props?.columns?.map((c) => ({
              childrenIds: moveChildrenIds(c.childrenIds),
            }));
            if (newColumns && newColumns.some((c, i) => c.childrenIds !== block.data.props?.columns?.[i]?.childrenIds)) {
              nDocument[id] = {
                type: 'ColumnsContainer',
                data: {
                  style: block.data.style,
                  props: {
                    ...block.data.props,
                    columns: newColumns,
                  },
                },
              } as ColumnsContainerProps;
            }
            break;
          default:
            // Keep as is
            break;
        }
      }

      resetDocument(nDocument, selectedBlockId);
    } catch (error) {
      console.error('Error moving block:', error);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0.5} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Tooltip title="Move up" placement="top">
          <IconButton onClick={() => handleMoveClick('up')} size="small" sx={{ color: 'text.primary' }}>
            <ArrowUpwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Move down" placement="top">
          <IconButton onClick={() => handleMoveClick('down')} size="small" sx={{ color: 'text.primary' }}>
            <ArrowDownwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" placement="top">
          <IconButton onClick={handleDeleteClick} size="small" sx={{ color: 'error.main' }}>
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Block</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this block? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

