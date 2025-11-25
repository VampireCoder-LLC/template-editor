import React, { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';

import { ImageProps, ImagePropsSchema } from '../../../../blocks/image';
import { setDocument, useDocument } from '../../../editor/EditorContext';
import TextInput from '../../../../App/ConfigurationDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextInput';
import TextDimensionInput from '../../../../App/ConfigurationDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextDimensionInput';

type ImageEditDialogProps = {
  blockId: string;
  open: boolean;
  onClose: () => void;
};

export default function ImageEditDialog({ blockId, open, onClose }: ImageEditDialogProps) {
  const document = useDocument();
  const block = document[blockId];
  const data = (block?.data as ImageProps) || {};

  const [formData, setFormData] = useState<any>(data);
  const [errors, setErrors] = useState<any>(null);

  const handleSave = () => {
    const res = ImagePropsSchema.safeParse(formData);
    if (res.success) {
      setDocument({
        [blockId]: {
          ...block,
          data: res.data,
        },
      });
      setErrors(null);
      onClose();
    } else {
      setErrors(res.error);
    }
  };

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setFormData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <TextInput
            label="Source URL"
            defaultValue={formData.props?.url ?? ''}
            onChange={(v) => {
              const url = v.trim().length === 0 ? null : v.trim();
              updateData({ ...formData, props: { ...formData.props, url } });
            }}
          />

          <TextInput
            label="Alt text"
            defaultValue={formData.props?.alt ?? ''}
            onChange={(alt) => updateData({ ...formData, props: { ...formData.props, alt } })}
          />

          <TextInput
            label="Target URL"
            defaultValue={formData.props?.linkHref ?? ''}
            onChange={(v) => {
              const linkHref = v.trim().length === 0 ? null : v.trim();
              updateData({ ...formData, props: { ...formData.props, linkHref } });
            }}
          />

          <Stack direction="row" spacing={2}>
            <TextDimensionInput
              label="Width"
              defaultValue={formData.props?.width}
              onChange={(width) => updateData({ ...formData, props: { ...formData.props, width } })}
            />
            <TextDimensionInput
              label="Height"
              defaultValue={formData.props?.height}
              onChange={(height) => updateData({ ...formData, props: { ...formData.props, height } })}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

