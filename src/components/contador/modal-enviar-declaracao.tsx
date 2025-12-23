import React, { useState, useRef } from 'react';
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
  Card,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { COLORS } from 'src/constants/declaracao';

interface ModalEnviarDeclaracaoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (arquivo: File) => Promise<void>;
  loading?: boolean;
}

export function ModalEnviarDeclaracao({
  open,
  onClose,
  onSubmit,
  loading = false,
}: ModalEnviarDeclaracaoProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setArquivo(file);
  };

  const handleSubmit = async () => {
    if (!arquivo) {
      return;
    }

    try {
      setLocalLoading(true);
      await onSubmit(arquivo);
      setArquivo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch (error) {
      // ignore
    } finally {
      setLocalLoading(false);
    }
  };

  const handleClose = () => {
    if (!localLoading) {
      setArquivo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
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
        <Typography variant="h6" fontWeight={700}>
          Enviar Declaração
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Selecione o arquivo da declaração para enviar
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Card
            variant="outlined"
            sx={{
              borderStyle: 'dashed',
              borderColor: COLORS.grey200,
              borderWidth: 2,
              bgcolor: COLORS.grey100,
              textAlign: 'center',
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: '#F3F4FF',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {arquivo ? (
              <Stack spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 32 }} />
                <Typography variant="body2" fontWeight={600}>
                  {arquivo.name}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setArquivo(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={isLoading}
                >
                  Remover
                </Button>
              </Stack>
            ) : (
              <Stack spacing={1} alignItems="center">
                <CloudUploadIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                <Typography variant="body2" fontWeight={600}>
                  Clique para selecionar arquivo
                </Typography>
                <Typography variant="caption" color={COLORS.grey600}>
                  PDF – até 10 MB
                </Typography>
              </Stack>
            )}
          </Card>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!arquivo || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

