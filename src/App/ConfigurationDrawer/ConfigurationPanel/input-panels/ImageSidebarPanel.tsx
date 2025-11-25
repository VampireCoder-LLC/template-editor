import React, { useState, useRef } from 'react';
import { ZodError } from 'zod';

import {
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
  LinkOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import { Stack, ToggleButton, Button, Typography, Alert, Box } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '../../../../blocks/image';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);
  const [inputMode, setInputMode] = useState<'URL' | 'UPLOAD'>(() => {
    // Infer mode from URL: if it starts with 'data:', it's an uploaded image
    const url = data.props?.url ?? '';
    return url.startsWith('data:') ? 'UPLOAD' : 'URL';
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError(null);

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a JPG, PNG, GIF, WebP, or SVG image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size exceeds 2MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (base64String) {
        updateData({ ...data, props: { ...data.props, url: base64String } });
        setUploadedFileName(file.name);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleModeChange = (mode: 'URL' | 'UPLOAD') => {
    setInputMode(mode);
    setUploadError(null);
    // Clear URL when switching modes
    if (mode === 'UPLOAD') {
      setUploadedFileName(null);
    }
  };

  return (
    <BaseSidebarPanel title="Image block">
      <RadioGroupInput
        label="Input Method"
        defaultValue={inputMode}
        onChange={(mode) => handleModeChange(mode as 'URL' | 'UPLOAD')}
      >
        <ToggleButton value="URL">
          <LinkOutlined fontSize="small" sx={{ mr: 0.5 }} />
          URL
        </ToggleButton>
        <ToggleButton value="UPLOAD">
          <UploadOutlined fontSize="small" sx={{ mr: 0.5 }} />
          Upload
        </ToggleButton>
      </RadioGroupInput>

      {inputMode === 'URL' ? (
        <TextInput
          label="Source URL"
          defaultValue={data.props?.url ?? ''}
          onChange={(v) => {
            const url = v.trim().length === 0 ? null : v.trim();
            updateData({ ...data, props: { ...data.props, url } });
          }}
        />
      ) : (
        <Stack spacing={1}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<UploadOutlined />}
            fullWidth
          >
            Choose Image File
          </Button>
          {uploadError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {uploadError}
            </Alert>
          )}
          {uploadedFileName && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Uploaded: {uploadedFileName}
            </Typography>
          )}
          {data.props?.url && data.props.url.startsWith('data:') && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <img
                src={data.props.url}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                Preview
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      <TextInput
        label="Alt text"
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
      />
      <TextInput
        label="Click through URL"
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label="Width"
          defaultValue={data.props?.width}
          onChange={(width) => updateData({ ...data, props: { ...data.props, width } })}
        />
        <TextDimensionInput
          label="Height"
          defaultValue={data.props?.height}
          onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
        />
      </Stack>

      <RadioGroupInput
        label="Alignment"
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) => updateData({ ...data, props: { ...data.props, contentAlignment } })}
      >
        <ToggleButton value="top">
          <VerticalAlignTopOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="middle">
          <VerticalAlignCenterOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bottom">
          <VerticalAlignBottomOutlined fontSize="small" />
        </ToggleButton>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
