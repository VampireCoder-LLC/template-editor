import React from 'react';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

type BlockMenuButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function BlockTypeButton({ label, icon, onClick }: BlockMenuButtonProps) {
  return (
    <ListItemButton
      onClick={(ev) => {
        ev.stopPropagation();
        onClick();
      }}
      sx={{
        py: 1.5,
        px: 2,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
    </ListItemButton>
  );
}
