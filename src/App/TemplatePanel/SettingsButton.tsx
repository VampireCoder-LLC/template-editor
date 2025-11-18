import React, { useState } from 'react';

import { SettingsOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';

import { useDocument, setDocument } from '../../documents/editor/EditorContext';
import StylesPanelDialog from './StylesPanelDialog';

export default function SettingsButton() {
  const [open, setOpen] = useState(false);
  const document = useDocument();
  const [tempDocument, setTempDocument] = useState(document);

  const handleOpen = () => {
    setTempDocument(document);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setDocument(tempDocument);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Style Settings">
        <IconButton onClick={handleOpen}>
          <SettingsOutlined fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: '90vh',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Style Settings</DialogTitle>
        <DialogContent
          sx={{
            overflow: 'auto',
            p: 2,
          }}
        >
          <StylesPanelDialog document={tempDocument} setDocument={setTempDocument} />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

