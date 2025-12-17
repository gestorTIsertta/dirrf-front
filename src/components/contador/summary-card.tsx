import React from 'react';
import { Paper, Stack, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface SummaryCardProps {
  label: string;
  value: number | string;
  diff?: string;
  backgroundColor: string;
  icon: SvgIconComponent;
  iconColor: string;
  highlightDiff?: boolean;
}

const COLORS = {
  success: '#16A34A',
  grey600: '#4B5563',
};

export function SummaryCard({
  label,
  value,
  diff,
  backgroundColor,
  icon: IconComponent,
  iconColor,
  highlightDiff = false,
}: SummaryCardProps) {
  return (
    <Paper 
      sx={{ 
        p: { xs: 2, sm: 2.5 }, 
        bgcolor: backgroundColor, 
        position: 'relative', 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="flex-start" 
        mb={1}
        sx={{ flex: 1 }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="caption" 
            color={COLORS.grey600} 
            display="block" 
            mb={0.5}
            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
          >
            {label}
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            sx={{ 
              lineHeight: 1.2,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              wordBreak: 'break-word'
            }}
          >
            {value}
          </Typography>
        </Box>
        <IconComponent 
          sx={{ 
            color: iconColor, 
            fontSize: { xs: 24, sm: 32 }, 
            opacity: 0.8,
            flexShrink: 0,
            ml: 1
          }} 
        />
      </Stack>
      {diff && (
        <Typography
          variant="caption"
          color={highlightDiff ? COLORS.success : COLORS.grey600}
          sx={{ 
            display: 'block',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            wordBreak: 'break-word'
          }}
        >
          {diff}
        </Typography>
      )}
    </Paper>
  );
}

