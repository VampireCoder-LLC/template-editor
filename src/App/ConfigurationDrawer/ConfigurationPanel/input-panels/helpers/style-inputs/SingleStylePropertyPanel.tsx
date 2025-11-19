import React from 'react';

import { Box } from '@mui/material';
import { RoundedCornerOutlined } from '@mui/icons-material';

import { TStyle } from '../../../../../../documents/blocks/helpers/TStyle';
import { NullableColorInput } from '../inputs/ColorInput';
import { NullableFontFamily } from '../inputs/FontFamily';
import FontSizeInput from '../inputs/FontSizeInput';
import FontWeightInput from '../inputs/FontWeightInput';
import PaddingInput from '../inputs/PaddingInput';
import SliderInput from '../inputs/SliderInput';
import TextAlignInput from '../inputs/TextAlignInput';
import TextDecorationInput from '../inputs/TextDecorationInput';

type StylePropertyPanelProps = {
  name: keyof TStyle;
  value: TStyle;
  onChange: (style: TStyle) => void;
};
export default function SingleStylePropertyPanel({ name, value, onChange }: StylePropertyPanelProps) {
  const defaultValue = value[name] ?? null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (v: any) => {
    onChange({ ...value, [name]: v });
  };

  switch (name) {
    case 'backgroundColor':
      return (
        <Box sx={{ width: '100%' }}>
          <NullableColorInput label="Background color" defaultValue={defaultValue} onChange={handleChange} />
        </Box>
      );
    case 'borderColor':
      return (
        <Box sx={{ width: '100%' }}>
          <NullableColorInput label="Border color" defaultValue={defaultValue} onChange={handleChange} />
        </Box>
      );
    case 'borderRadius':
      return (
        <SliderInput
          iconLabel={<RoundedCornerOutlined />}
          units="px"
          step={4}
          marks
          min={0}
          max={48}
          label="Border radius"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'color':
      return (
        <Box sx={{ width: '100%' }}>
          <NullableColorInput label="Text color" defaultValue={defaultValue} onChange={handleChange} />
        </Box>
      );
    case 'fontFamily':
      return <NullableFontFamily label="Font family" defaultValue={defaultValue} onChange={handleChange} />;
    case 'fontSize':
      return <FontSizeInput label="Font size" defaultValue={defaultValue} onChange={handleChange} />;
    case 'fontWeight':
      return <FontWeightInput label="Font weight" defaultValue={defaultValue} onChange={handleChange} />;
    case 'fontStyle':
    case 'textDecoration':
      // These are handled together by TextDecorationInput (along with fontWeight)
      return (
        <TextDecorationInput
          label="Formatting"
          defaultValue={{ fontWeight: value.fontWeight, fontStyle: value.fontStyle, textDecoration: value.textDecoration }}
          onChange={(v) => onChange({ ...value, fontWeight: v.fontWeight, fontStyle: v.fontStyle, textDecoration: v.textDecoration })}
        />
      );
    case 'textAlign':
      return <TextAlignInput label="Alignment" defaultValue={defaultValue} onChange={handleChange} />;
    case 'padding':
      return <PaddingInput label="Padding" defaultValue={defaultValue} onChange={handleChange} />;
  }
}
