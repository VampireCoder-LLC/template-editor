import React, { useEffect, useState } from 'react';

import { AddOutlined } from '@mui/icons-material';
import { Box, Fade, IconButton } from '@mui/material';

type Props = {
  buttonElement: HTMLElement | null;
  onClick: () => void;
};
export default function DividerButton({ buttonElement, onClick }: Props) {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    function listener({ clientX, clientY }: MouseEvent) {
      if (!buttonElement) {
        return;
      }
      const rect = buttonElement.getBoundingClientRect();
      const rectY = rect.y;
      const bottomX = rect.x;
      const topX = bottomX + rect.width;

      if (Math.abs(clientY - rectY) < 20) {
        if (bottomX < clientX && clientX < topX) {
          setVisible(true);
          return;
        }
      }
      setVisible(false);
    }
    window.addEventListener('mousemove', listener);
    return () => {
      window.removeEventListener('mousemove', listener);
    };
  }, [buttonElement, setVisible]);

  return (
    <Fade in={visible}>
      <IconButton
        size="small"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: 0.12,
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: isHovered ? 'translateX(-50%)' : 'translateX(-10px)',
          bgcolor: 'brand.blue',
          color: 'primary.contrastText',
          zIndex: 'fab',
          borderRadius: isHovered ? '16px' : '50%',
          paddingX: isHovered ? 1.5 : 0.12,
          paddingY: 0.12,
          transition: 'all 0.2s ease-in-out',
          minWidth: isHovered ? 'auto' : '20px',
          '&:hover, &:active, &:focus': {
            bgcolor: 'brand.blue',
            color: 'primary.contrastText',
          },
        }}
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            whiteSpace: 'nowrap',
          }}
        >
          <AddOutlined fontSize="small" />
          {isHovered && (
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Add Block
            </Box>
          )}
        </Box>
      </IconButton>
    </Fade>
  );
}
