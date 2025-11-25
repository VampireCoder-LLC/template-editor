import React, { useState } from 'react';
import { ZodError } from 'zod';

import { Grid, ToggleButton } from '@mui/material';
import { RoundedCornerOutlined } from '@mui/icons-material';
import { ButtonProps, ButtonPropsDefaults, ButtonPropsSchema } from '../../../../blocks/button';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import SliderInput from './helpers/inputs/SliderInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ButtonSidebarPanelProps = {
  data: ButtonProps;
  setData: (v: ButtonProps) => void;
};
export default function ButtonSidebarPanel({ data, setData }: ButtonSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? ButtonPropsDefaults.text;
  const url = data.props?.url ?? ButtonPropsDefaults.url;
  const fullWidth = data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const size = data.props?.size ?? ButtonPropsDefaults.size;
  const buttonTextColor = data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor;
  const buttonBackgroundColor = data.props?.buttonBackgroundColor ?? ButtonPropsDefaults.buttonBackgroundColor;
  const borderRadius = data.props?.borderRadius ?? 0;

  return (
    <BaseSidebarPanel title="Button block">
      <TextInput
        label="Text"
        defaultValue={text}
        onChange={(text) => updateData({ ...data, props: { ...data.props, text } })}
      />
      <TextInput
        label="Url"
        defaultValue={url}
        onChange={(url) => updateData({ ...data, props: { ...data.props, url } })}
      />
      <RadioGroupInput
        label="Width"
        defaultValue={fullWidth ? 'FULL_WIDTH' : 'AUTO'}
        onChange={(v) => updateData({ ...data, props: { ...data.props, fullWidth: v === 'FULL_WIDTH' } })}
      >
        <ToggleButton value="FULL_WIDTH">Full</ToggleButton>
        <ToggleButton value="AUTO">Auto</ToggleButton>
      </RadioGroupInput>
      <RadioGroupInput
        label="Size"
        defaultValue={size}
        onChange={(size) => updateData({ ...data, props: { ...data.props, size } })}
      >
        <ToggleButton value="x-small">Xs</ToggleButton>
        <ToggleButton value="small">Sm</ToggleButton>
        <ToggleButton value="medium">Md</ToggleButton>
        <ToggleButton value="large">Lg</ToggleButton>
      </RadioGroupInput>
      <SliderInput
        label="Border radius"
        iconLabel={<RoundedCornerOutlined />}
        units="px"
        step={4}
        marks
        min={0}
        max={64}
        defaultValue={borderRadius}
        onChange={(borderRadius) => updateData({ ...data, props: { ...data.props, borderRadius } })}
      />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ColorInput
            label="Text color"
            defaultValue={buttonTextColor}
            onChange={(buttonTextColor) => updateData({ ...data, props: { ...data.props, buttonTextColor } })}
          />
        </Grid>
        <Grid item xs={4}>
          <ColorInput
            label="Button color"
            defaultValue={buttonBackgroundColor}
            onChange={(buttonBackgroundColor) => updateData({ ...data, props: { ...data.props, buttonBackgroundColor } })}
          />
        </Grid>
        <Grid item xs={4}>
          <MultiStylePropertyPanel
            names={['backgroundColor']}
            value={data.style}
            onChange={(style) => updateData({ ...data, style })}
          />
        </Grid>
      </Grid>
      <MultiStylePropertyPanel
        names={['fontFamily', 'fontSize', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
