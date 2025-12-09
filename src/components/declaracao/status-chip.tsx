import { Chip } from '@mui/material';
import { getStatusColors } from 'src/utils/status-colors';

interface StatusChipProps {
  status: string;
  size?: 'small' | 'medium';
  fontSize?: { xs: string; sm: string };
}

export function StatusChip({ status, size = 'small', fontSize = { xs: '0.7rem', sm: '0.75rem' } }: StatusChipProps) {
  const colors = getStatusColors(status);

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        bgcolor: colors.bgcolor,
        color: colors.color,
        fontSize,
      }}
    />
  );
}

