import React from 'react';

import { Box, Stack } from '@mui/material';
import { TStyle } from '../../../../../../documents/blocks/helpers/TStyle';

import SingleStylePropertyPanel from './SingleStylePropertyPanel';

type MultiStylePropertyPanelProps = {
  names: (keyof TStyle)[];
  value: TStyle | undefined | null;
  onChange: (style: TStyle) => void;
};
export default function MultiStylePropertyPanel({ names, value, onChange }: MultiStylePropertyPanelProps) {
  // Check if both color and backgroundColor are in the names array
  const hasColorPair = names.includes('color') && names.includes('backgroundColor');

  // Check if both fontFamily and fontSize are in the names array
  const hasFontPair = names.includes('fontFamily') && names.includes('fontSize');

  // Check if both backgroundColor and borderColor are in the names array (for Container blocks)
  const hasBackgroundBorderColorPair = names.includes('backgroundColor') && names.includes('borderColor');

  // Filter out properties that will be rendered together
  let displayNames = names;
  if (hasColorPair) {
    displayNames = displayNames.filter((n) => n !== 'backgroundColor');
  }
  if (hasFontPair) {
    displayNames = displayNames.filter((n) => n !== 'fontSize');
  }
  if (hasBackgroundBorderColorPair) {
    displayNames = displayNames.filter((n) => n !== 'borderColor');
  }

  return (
    <>
      {displayNames.map((name) => {
        // Render color and backgroundColor side-by-side
        if (hasColorPair && name === 'color') {
          return (
            <Stack direction="row" spacing={2} key="color-pair">
              <Box sx={{ flex: 1 }}>
                <SingleStylePropertyPanel name="color" value={value || {}} onChange={onChange} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SingleStylePropertyPanel name="backgroundColor" value={value || {}} onChange={onChange} />
              </Box>
            </Stack>
          );
        }

        // Render fontFamily and fontSize side-by-side
        if (hasFontPair && name === 'fontFamily') {
          return (
            <Stack direction="row" spacing={2} key="font-pair">
              <Box sx={{ flex: 1 }}>
                <SingleStylePropertyPanel name="fontFamily" value={value || {}} onChange={onChange} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SingleStylePropertyPanel name="fontSize" value={value || {}} onChange={onChange} />
              </Box>
            </Stack>
          );
        }

        // Render backgroundColor and borderColor side-by-side (for Container blocks)
        if (hasBackgroundBorderColorPair && name === 'backgroundColor') {
          return (
            <Stack direction="row" spacing={2} key="background-border-color-pair">
              <Box sx={{ flex: 1 }}>
                <SingleStylePropertyPanel name="backgroundColor" value={value || {}} onChange={onChange} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SingleStylePropertyPanel name="borderColor" value={value || {}} onChange={onChange} />
              </Box>
            </Stack>
          );
        }

        return <SingleStylePropertyPanel key={name} name={name} value={value || {}} onChange={onChange} />;
      })}
    </>
  );
}
