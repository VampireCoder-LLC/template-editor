import React from 'react';

import { Grid } from '@mui/material';
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

  // Filter out properties that will be rendered together
  let displayNames = names;
  if (hasColorPair) {
    displayNames = displayNames.filter((n) => n !== 'backgroundColor');
  }
  if (hasFontPair) {
    displayNames = displayNames.filter((n) => n !== 'fontSize');
  }

  return (
    <>
      {displayNames.map((name) => {
        // Render color and backgroundColor side-by-side
        if (hasColorPair && name === 'color') {
          return (
            <Grid container spacing={2} key="color-pair">
              <Grid item xs={6} sx={{ width: '100%', marginLeft: '-1rem;' }}>
                <SingleStylePropertyPanel name="color" value={value || {}} onChange={onChange} />
              </Grid>
              <Grid item xs={6} sx={{ width: '100%' }}>
                <SingleStylePropertyPanel name="backgroundColor" value={value || {}} onChange={onChange} />
              </Grid>
            </Grid>
          );
        }

        // Render fontFamily and fontSize side-by-side
        if (hasFontPair && name === 'fontFamily') {
          return (
            <Grid container spacing={2} key="font-pair">
              <Grid item xs={6} sx={{ width: '100%', marginLeft: '-1rem;' }}>
                <SingleStylePropertyPanel name="fontFamily" value={value || {}} onChange={onChange} />
              </Grid>
              <Grid item xs={6} sx={{ width: '100%' }}>
                <SingleStylePropertyPanel name="fontSize" value={value || {}} onChange={onChange} />
              </Grid>
            </Grid>
          );
        }

        return <SingleStylePropertyPanel key={name} name={name} value={value || {}} onChange={onChange} />;
      })}
    </>
  );
}
