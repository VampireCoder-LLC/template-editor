import React, { useState } from 'react';

import { FormatBold, FormatItalicOutlined, FormatStrikethroughOutlined, FormatUnderlinedOutlined } from '@mui/icons-material';
import { InputLabel, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

type Props = {
  label: string;
  defaultValue: { fontWeight?: string | null; fontStyle?: string | null; textDecoration?: string | null } | null;
  onChange: (value: { fontWeight?: string | null; fontStyle?: string | null; textDecoration?: string | null }) => void;
};

export default function TextDecorationInput({ label, defaultValue, onChange }: Props) {
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    const values: string[] = [];
    if (defaultValue?.fontWeight === 'bold' || defaultValue?.fontWeight === '700') values.push('bold');
    if (defaultValue?.fontStyle === 'italic') values.push('italic');
    if (defaultValue?.textDecoration?.includes('underline')) values.push('underline');
    if (defaultValue?.textDecoration?.includes('line-through')) values.push('strikethrough');
    return values;
  });

  const handleChange = (_: React.MouseEvent<HTMLElement>, newValues: string[]) => {
    setSelectedValues(newValues);

    const fontWeight = newValues.includes('bold') ? 'bold' : null;
    const fontStyle = newValues.includes('italic') ? 'italic' : null;
    const decorations: string[] = [];
    if (newValues.includes('underline')) decorations.push('underline');
    if (newValues.includes('strikethrough')) decorations.push('line-through');
    const textDecoration = decorations.length > 0 ? decorations.join(' ') : null;

    onChange({ fontWeight, fontStyle, textDecoration });
  };

  return (
    <Stack alignItems="flex-start">
      <InputLabel shrink>{label}</InputLabel>
      <ToggleButtonGroup
        value={selectedValues}
        onChange={handleChange}
        fullWidth
        size="small"
      >
        <ToggleButton value="bold">
          <FormatBold fontSize="small" />
        </ToggleButton>
        <ToggleButton value="italic">
          <FormatItalicOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="underline">
          <FormatUnderlinedOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="strikethrough">
          <FormatStrikethroughOutlined fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}

