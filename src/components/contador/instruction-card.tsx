import React, { ReactNode } from 'react';
import { Paper, Typography } from '@mui/material';

const COLORS = {
  grey600: '#4B5563',
};

interface InstructionCardProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function InstructionCard({ 
  children, 
  backgroundColor = '#E3F2FD' 
}: InstructionCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: backgroundColor }}>
      <Typography 
        variant="body2" 
        color={COLORS.grey600}
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          wordBreak: 'break-word',
          '& strong': {
            display: 'block',
            mb: 0.5
          },
          '& code': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            padding: '2px 4px',
            borderRadius: '3px',
            fontSize: '0.85em'
          }
        }}
      >
        {children}
      </Typography>
    </Paper>
  );
}

