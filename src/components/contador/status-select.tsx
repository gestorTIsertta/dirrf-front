import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import { COLORS } from 'src/constants/declaracao';
import type { DeclarationStatus } from 'src/types/backoffice';

interface StatusSelectProps {
  value: DeclarationStatus | undefined;
  onChange: (status: DeclarationStatus) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

function getStatusColors(status: DeclarationStatus) {
  const map: Record<DeclarationStatus, { bg: string; color: string }> = {
    'pendente': { bg: '#FEF3C7', color: '#92400E' },
    'em_analise': { bg: '#FFEDD5', color: '#C2410C' },
    'aprovada': { bg: '#DCFCE7', color: '#166534' },
    'rejeitada': { bg: '#FEE2E2', color: '#DC2626' },
    'concluida': { bg: '#DCFCE7', color: '#166534' },
  };
  return map[status];
}

export function StatusSelect({
  value,
  onChange,
  disabled = false,
  size = 'medium',
}: Readonly<StatusSelectProps>) {
  const statusOptions: DeclarationStatus[] = ['pendente', 'em_analise', 'aprovada', 'rejeitada', 'concluida'];

  return (
    <FormControl fullWidth size={size} disabled={disabled}>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as DeclarationStatus)}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            py: size === 'small' ? 1 : 1.5,
          },
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography variant="body2" color={COLORS.grey600}>
                Selecione o status
              </Typography>
            );
          }
          const status = selected as DeclarationStatus;
          const colors = getStatusColors(status);
          return (
            <Chip
              label={status}
              size="small"
              sx={{
                bgcolor: colors.bg,
                color: colors.color,
                fontWeight: 600,
                fontSize: size === 'small' ? '0.75rem' : '0.875rem',
                height: size === 'small' ? 24 : 28,
              }}
            />
          );
        }}
      >
        {statusOptions.map((status) => {
          const colors = getStatusColors(status);
          return (
            <MenuItem key={status} value={status}>
              <Chip
                label={status}
                size="small"
                sx={{
                  bgcolor: colors.bg,
                  color: colors.color,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

