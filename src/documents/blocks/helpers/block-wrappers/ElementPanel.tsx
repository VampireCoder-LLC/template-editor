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
  SxProps,
  Tooltip,
  Box,
} from '@mui/material';

import { TEditorBlock } from '../../../editor/core';
import { resetDocument, setDocument, useDocument } from '../../../editor/EditorContext';
import { useTemplateFields } from '../../../editor/TemplateFieldsContext';
import { ColumnsContainerProps } from '../../ColumnsContainer/ColumnsContainerPropsSchema';
import TemplateFieldsSection from '../../../../App/InspectorDrawer/TemplateFieldsSection';

import AvatarSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/AvatarSidebarPanel';
import ButtonSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/ButtonSidebarPanel';
import ColumnsContainerSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/ColumnsContainerSidebarPanel';
import ContainerSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/ContainerSidebarPanel';
import DividerSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/DividerSidebarPanel';
import EmailLayoutSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/EmailLayoutSidebarPanel';
import HeadingSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/HeadingSidebarPanel';
import HtmlSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/HtmlSidebarPanel';
import ImageSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/ImageSidebarPanel';
import SpacerSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/SpacerSidebarPanel';
import TextSidebarPanel from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/TextSidebarPanel';

const sx: SxProps = {
  position: 'absolute',
  top: 0,
  left: '100%',
  marginLeft: 2,
  borderRadius: 2,
  paddingX: 2,
  paddingY: 2,
  zIndex: 'fab',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '400px',
  maxHeight: '90vh',
  overflow: 'visible',
  backgroundColor: '#fff',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '-10px',
    top: '20px',
    width: '20px',
    height: '20px',
    backgroundColor: '#fff',
    transform: 'rotate(45deg)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    zIndex: 0,
  },
};

type Props = {
  blockId: string;
};

export default function ElementPanel({ blockId }: Props) {
  const editorDocument = useDocument();
  const templateFields = useTemplateFields();
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

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleStyleChange = (updatedStyle: any) => {
    setDocument({
      [blockId]: {
        ...block,
        data: {
          ...block.data,
          style: updatedStyle,
        },
      },
    });
  };

  const handlePropsChange = (updatedProps: any) => {
    setDocument({
      [blockId]: {
        ...block,
        data: {
          ...block.data,
          props: updatedProps,
        },
      },
    });
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

  // Render the appropriate sidebar panel based on block type
  const renderInspectorContent = () => {
    if (!block) {
      return null;
    }

    const setBlock = (conf: TEditorBlock) => setDocument({ [blockId]: conf });
    const { data, type } = block;

    switch (type) {
      case 'Avatar':
        return <AvatarSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Button':
        return <ButtonSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'ColumnsContainer':
        return (
          <ColumnsContainerSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />
        );
      case 'Container':
        return <ContainerSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Divider':
        return <DividerSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Heading':
        return <HeadingSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Html':
        return <HtmlSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Image':
        return <ImageSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'EmailLayout':
        return <EmailLayoutSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Spacer':
        return <SpacerSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      case 'Text':
        return <TextSidebarPanel key={blockId} data={data} setData={(data) => setBlock({ type, data })} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Paper sx={sx} onClick={(ev) => ev.stopPropagation()}>
        {/* Template Fields Section - Show for all blocks except Button */}
        {templateFields.length > 0 && block.type !== 'Button' && <TemplateFieldsSection fields={templateFields} />}

        {/* Inspector Panel Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflow: 'hidden' }}>
          {renderInspectorContent()}
        </Box>

        {/* Move and Delete Buttons */}
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Move up" placement="right-start">
            <IconButton onClick={() => handleMoveClick('up')} size="small" sx={{ color: 'text.primary' }}>
              <ArrowUpwardOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move down" placement="right-start">
            <IconButton onClick={() => handleMoveClick('down')} size="small" sx={{ color: 'text.primary' }}>
              <ArrowDownwardOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="right-start">
            <IconButton onClick={handleDeleteClick} size="small" sx={{ color: 'error.main' }}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle id="delete-dialog-title">Delete Block</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this block? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                performDelete();
                setDeleteDialogOpen(false);
              }}
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
