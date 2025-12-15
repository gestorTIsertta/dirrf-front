import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Button,
  Box,
  Card,
  Typography,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Banco, ComprovanteData } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { getBancoImagem } from 'src/constants/bancos';

interface ModalComprovanteProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bancoId: string, arquivo: File) => void;
  bancos: Banco[];
  comprovanteData: ComprovanteData;
  onComprovanteDataChange: (data: ComprovanteData) => void;
  loading?: boolean;
}

export function ModalComprovante({
  open,
  onClose,
  onSubmit,
  bancos,
  comprovanteData,
  onComprovanteDataChange,
  loading = false,
}: ModalComprovanteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleComprovanteFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onComprovanteDataChange({ ...comprovanteData, arquivo: file });
  };

  const handleSubmit = async () => {
    if (!comprovanteData.bancoId || !comprovanteData.arquivo) {
      alert('Por favor, selecione um banco e anexe o comprovante');
      return;
    }

    try {
      setLocalLoading(true);
      await onSubmit(comprovanteData.bancoId, comprovanteData.arquivo);
      onClose();
    } catch (error) {
      console.error('Erro ao anexar comprovante:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Anexar Informe de Renda
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Selecione um banco e anexe o informe de rendimentos
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <FormControl fullWidth required>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Selecione o banco
            </Typography>
            <Select
              value={comprovanteData.bancoId}
              onChange={(e) => onComprovanteDataChange({ ...comprovanteData, bancoId: e.target.value })}
              displayEmpty
              disabled={isLoading}
            >
              <MenuItem value="" disabled>
                Selecione um banco
              </MenuItem>
              {bancos.length === 0 ? (
                <MenuItem value="" disabled>
                  Nenhum banco cadastrado. Cadastre um banco primeiro.
                </MenuItem>
              ) : (
                bancos.map((banco) => {
                  const imagemBanco = getBancoImagem(banco.codigoCompe || null);
                  return (
                    <MenuItem key={banco.id} value={banco.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: '100%' }}>
                        <Box
                          component="img"
                          src={imagemBanco || ''}
                          alt={banco.nome}
                          sx={{
                            width: 20,
                            height: 20,
                            objectFit: 'contain',
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.01em',
                            }}
                          >
                            {banco.nome.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color={COLORS.grey600}>
                            Conta: {banco.conta} • Agência: {banco.agencia}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })
              )}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Anexar Arquivo
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleComprovanteFileChange}
            />
            <Card
              variant="outlined"
              onClick={() => !isLoading && fileInputRef.current?.click()}
              sx={{
                borderStyle: 'dashed',
                borderColor: COLORS.grey200,
                borderWidth: 2,
                bgcolor: COLORS.grey100,
                textAlign: 'center',
                p: 2,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isLoading ? 0.6 : 1,
                '&:hover': {
                  borderColor: isLoading ? COLORS.grey200 : COLORS.primary,
                  bgcolor: isLoading ? COLORS.grey100 : '#F3F4FF',
                },
              }}
            >
              {comprovanteData.arquivo ? (
                <Stack spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 32 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {comprovanteData.arquivo.name}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComprovanteDataChange({ ...comprovanteData, arquivo: null });
                    }}
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
                    PDF, JPG, PNG – até 10 MB
                  </Typography>
                </Stack>
              )}
            </Card>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!comprovanteData.bancoId || !comprovanteData.arquivo || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          {isLoading ? 'Anexando...' : 'Anexar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

