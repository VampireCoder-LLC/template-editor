import React, { CSSProperties, useState } from 'react';

import { Box } from '@mui/material';

import { useCurrentBlockId } from '../../../editor/EditorBlock';
import { setSelectedBlockId, useSelectedBlockId, useDocument } from '../../../editor/EditorContext';

import BlockActionsMenu from './BlockActionsMenu';

type TEditorBlockWrapperProps = {
  children: React.ReactElement;
};

export default function EditorBlockWrapper({ children }: TEditorBlockWrapperProps) {
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = useState(false);
  const blockId = useCurrentBlockId();
  const document = useDocument();
  const block = document[blockId];

  let outline: CSSProperties['outline'];
  if (selectedBlockId === blockId) {
    outline = '2px solid rgba(0,121,204, 1)';
  } else if (mouseInside) {
    outline = '2px solid rgba(0,121,204, 0.3)';
  }

  // Show actions menu for selected block (except EmailLayout root block)
  const showActionsMenu = selectedBlockId === blockId && block?.type !== 'EmailLayout';

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: '100%',
        outlineOffset: '-1px',
        outline,
      }}
      onMouseEnter={(ev) => {
        setMouseInside(true);
        ev.stopPropagation();
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}
      onClick={(ev) => {
        // Only set selected block if not already selected
        // This allows InlineEditableText to handle the click for entering edit mode
        if (selectedBlockId !== blockId) {
          setSelectedBlockId(blockId);
        }
        ev.stopPropagation();
        ev.preventDefault();
      }}
    >
      {children}
      {showActionsMenu && <BlockActionsMenu blockId={blockId} />}
    </Box>
  );
}
