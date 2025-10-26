import React, { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';

import { TextProps, TextPropsSchema } from '../../../../blocks/text';
import { HeadingProps, HeadingPropsSchema } from '../../../../blocks/heading';
import { setDocument, useDocument } from '../../../editor/EditorContext';
import TextInput from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextInput';

type TextEditDialogProps = {
  blockId: string;
  open: boolean;
  onClose: () => void;
};

export default function TextEditDialog({ blockId, open, onClose }: TextEditDialogProps) {
  const document = useDocument();
  const block = document[blockId];
  const blockType = block?.type;
  const isHeading = blockType === 'Heading';
  const isText = blockType === 'Text';

  const data = (block?.data as TextProps | HeadingProps) || {};
  const [formData, setFormData] = useState<any>(data);
  const [errors, setErrors] = useState<any>(null);

  const getSchema = () => {
    return isHeading ? HeadingPropsSchema : TextPropsSchema;
  };

  const handleSave = () => {
    const schema = getSchema();
    const res = schema.safeParse(formData);
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
    const schema = getSchema();
    const res = schema.safeParse(d);
    if (res.success) {
      setFormData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const dialogTitle = isHeading ? 'Edit Heading' : 'Edit Text';
  const contentRows = isHeading ? 3 : 5;

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
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <TextInput
            label="Content"
            rows={contentRows}
            defaultValue={formData.props?.text ?? ''}
            onChange={(text) => updateData({ ...formData, props: { ...formData.props, text } })}
          />
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

