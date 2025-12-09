import { Chip } from '@mui/material';
import { getOperacaoColors } from 'src/utils/status-colors';

interface OperacaoChipProps {
  operacao: string;
  size?: 'small' | 'medium';
  fontSize?: { xs: string; sm: string };
}

export function OperacaoChip({
  operacao,
  size = 'small',
  fontSize = { xs: '0.7rem', sm: '0.75rem' },
}: OperacaoChipProps) {
  const colors = getOperacaoColors(operacao);

  return (
    <Chip
      label={operacao}
      size={size}
      sx={{
        bgcolor: colors.bgcolor,
        color: colors.color,
        fontSize,
      }}
    />
  );
}

