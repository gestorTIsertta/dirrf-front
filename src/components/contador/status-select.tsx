import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import { COLORS } from 'src/constants/declaracao';
import type { ClientStatus } from 'src/api/requests/backoffice-clients';

interface StatusSelectProps {
  value: ClientStatus | undefined;
  onChange: (status: ClientStatus) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

function getStatusColors(status: ClientStatus) {
  const map: Record<ClientStatus, { bg: string; color: string }> = {
    'Em Preenchimento': { bg: '#FEE2E2', color: '#DC2626' },
    'Em análise': { bg: '#FEF3C7', color: '#D97706' },
    'Aprovado': { bg: '#DCFCE7', color: '#16A34A' },
  };
  return map[status];
}

export function StatusSelect({
  value,
  onChange,
  disabled = false,
  size = 'medium',
}: Readonly<StatusSelectProps>) {
  const statusOptions: ClientStatus[] = ['Em Preenchimento', 'Em análise', 'Aprovado'];

  return (
    <FormControl fullWidth size={size} disabled={disabled}>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as ClientStatus)}
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
          const status = selected as ClientStatus;
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

