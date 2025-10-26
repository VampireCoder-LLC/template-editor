import React from 'react';

import { MailOutlineOutlined } from '@mui/icons-material';
import { Stack, TextField, Typography } from '@mui/material';

import { useDocument, setDocument } from '../../documents/editor/EditorContext';

export default function SubjectInput() {
  const document = useDocument();
  const subject = (document.subject as string) || '';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = event.target.value;
    setDocument({ subject: newSubject });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ whiteSpace: 'nowrap' }}>
        <MailOutlineOutlined sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
          Subject:
        </Typography>
      </Stack>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Enter email subject..."
        value={subject}
        onChange={handleChange}
        sx={{
          width: 350,
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem',
          },
        }}
      />
    </Stack>
  );
}

