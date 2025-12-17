import React, { ReactNode } from 'react';
import { Paper, Stack, Typography, Box } from '@mui/material';

const COLORS = {
  grey600: '#4B5563',
};

interface InfoFieldProps {
  label: string;
  value: string | ReactNode;
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <Box>
      <Typography 
        variant="body2" 
        color={COLORS.grey600}
        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body1" 
        fontWeight={600}
        sx={{ 
          fontSize: { xs: '0.875rem', sm: '1rem' },
          wordBreak: 'break-word'
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography 
        variant="h6" 
        fontWeight={700} 
        mb={2}
        sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
      >
        {title}
      </Typography>
      <Stack spacing={2}>
        {children}
      </Stack>
    </Paper>
  );
}

