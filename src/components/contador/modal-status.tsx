import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { COLORS } from 'src/constants/declaracao';
import { StatusSelect } from './status-select';
import type { DeclarationStatus } from 'src/types/backoffice';

interface ModalStatusProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (status: DeclarationStatus) => Promise<void>;
  currentStatus?: DeclarationStatus;
  clienteNome?: string;
  loading?: boolean;
}

export function ModalStatus({
  open,
  onClose,
  onSubmit,
  currentStatus,
  clienteNome,
  loading = false,
}: Readonly<ModalStatusProps>) {
  const [status, setStatus] = useState<DeclarationStatus | undefined>(currentStatus);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const handleClose = () => {
    if (!localLoading && !loading) {
      setStatus(currentStatus);
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!status) {
      return;
    }

    try {
      setLocalLoading(true);
      await onSubmit(status);
      handleClose();
    } catch (error) {
      // Error updating status - ignore
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box component="span" sx={{ fontWeight: 700, fontSize: '1.25rem', display: 'block' }}>
          Editar Status
        </Box>
        {clienteNome && (
          <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5, fontWeight: 400 }}>
            Cliente: {clienteNome}
          </Typography>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Selecione o novo status
            </Typography>
            <StatusSelect
              value={status}
              onChange={(newStatus) => setStatus(newStatus)}
              disabled={isLoading}
              size="medium"
            />
          </Box>
        </Stack>
      </DialogContent>
      <Divider sx={{ mt: 2 }} />
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderColor: COLORS.grey200,
            color: COLORS.grey600,
            '&:hover': {
              borderColor: COLORS.grey600,
              bgcolor: COLORS.grey100,
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !status}
          variant="contained"
          sx={{
            bgcolor: COLORS.primary,
            color: 'white',
            '&:hover': {
              bgcolor: '#1D4ED8',
            },
            '&:disabled': {
              bgcolor: COLORS.grey200,
              color: COLORS.grey600,
            },
          }}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
