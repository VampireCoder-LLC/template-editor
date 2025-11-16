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
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';

import { TEditorBlock } from '../../../editor/core';
import { resetDocument, useDocument } from '../../../editor/EditorContext';
import { ColumnsContainerProps } from '../../ColumnsContainer/ColumnsContainerPropsSchema';

type Props = {
  blockId: string;
};

export default function BlockActionsMenu({ blockId }: Props) {
  const editorDocument = useDocument();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const block = editorDocument[blockId];

  const performDelete = () => {
    const filterChildrenIds = (childrenIds: string[] | null | undefined) => {
      if (!childrenIds) {
        return childrenIds;
      }
      return childrenIds.filter((f) => f !== blockId);
    };
    const nDocument: typeof editorDocument = { ...editorDocument };
    for (const [id, b] of Object.entries(nDocument)) {
      const block = b as TEditorBlock;
      if (id === blockId) {
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
    delete nDocument[blockId];
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
        const index = ids.indexOf(blockId);
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
        if (id === blockId) {
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

      resetDocument(nDocument, blockId);
    } catch (error) {
      console.error('Error moving block:', error);
    }
  };

  return (
    <>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '100%',
          transform: 'translateY(-50%)',
          marginLeft: 1,
          borderRadius: 1,
          zIndex: 'fab',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <Stack direction="column" spacing={0}>
          <Tooltip title="Move up" placement="right">
            <IconButton onClick={() => handleMoveClick('up')} size="small" sx={{ color: 'text.primary', borderRadius: 0 }}>
              <ArrowUpwardOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move down" placement="right">
            <IconButton onClick={() => handleMoveClick('down')} size="small" sx={{ color: 'text.primary', borderRadius: 0 }}>
              <ArrowDownwardOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="right">
            <IconButton onClick={handleDeleteClick} size="small" sx={{ color: 'error.main', borderRadius: 0 }}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

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


