import React, { useEffect, useState } from 'react';

import { CloseOutlined, PaletteOutlined } from '@mui/icons-material';
import { ButtonBase, InputLabel, Menu, Stack } from '@mui/material';

import Picker from './Picker';

const BUTTON_SX = {
  border: '1px solid',
  borderColor: 'cadet.400',
  width: 32,
  height: 32,
  borderRadius: '4px',
  bgcolor: '#FFFFFF',
};

type Props =
  | {
      nullable: true;
      label: string;
      onChange: (value: string | null) => void;
      onStartEditing?: () => void;
      onFinishEditing?: () => void;
      defaultValue: string | null;
    }
  | {
      nullable: false;
      label: string;
      onChange: (value: string) => void;
      onStartEditing?: () => void;
      onFinishEditing?: () => void;
      defaultValue: string;
    };

export default function ColorInputWithUndo({ label, defaultValue, onChange, onStartEditing, onFinishEditing, nullable }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [value, setValue] = useState(defaultValue);

  // Sync internal state when defaultValue changes (e.g., from undo/redo)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Call onStartEditing when color picker opens
    if (onStartEditing) {
      onStartEditing();
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Call onFinishEditing when color picker closes
    if (onFinishEditing) {
      onFinishEditing();
    }
  };

  const renderResetButton = () => {
    if (!nullable) {
      return null;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    return (
      <ButtonBase
        onClick={() => {
          if (onStartEditing) {
            onStartEditing();
          }
          setValue(null);
          onChange(null);
          if (onFinishEditing) {
            onFinishEditing();
          }
        }}
      >
        <CloseOutlined fontSize="small" sx={{ color: 'grey.600' }} />
      </ButtonBase>
    );
  };

  const renderOpenButton = () => {
    if (value) {
      return <ButtonBase onClick={handleClickOpen} sx={{ ...BUTTON_SX, bgcolor: value }} />;
    }
    return (
      <ButtonBase onClick={handleClickOpen} sx={{ ...BUTTON_SX }}>
        <PaletteOutlined fontSize="small" />
      </ButtonBase>
    );
  };

  return (
    <Stack alignItems="flex-start" sx={{ width: '100%' }}>
      <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>
      <Stack direction="row" spacing={1}>
        {renderOpenButton()}
        {renderResetButton()}
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          sx: { height: 'auto', padding: 0 },
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Picker
          value={value || ''}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      </Menu>
    </Stack>
  );
}

