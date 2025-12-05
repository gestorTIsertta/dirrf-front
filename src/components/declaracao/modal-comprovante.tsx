import { useRef } from 'react';
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
  Paper,
  Typography,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { CompraVenda, ComprovanteData } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';

interface ModalComprovanteProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (compraVendaId: string, arquivo: File) => void;
  comprasVendas: CompraVenda[];
  comprovanteData: ComprovanteData;
  onComprovanteDataChange: (data: ComprovanteData) => void;
}

export function ModalComprovante({
  open,
  onClose,
  onSubmit,
  comprasVendas,
  comprovanteData,
  onComprovanteDataChange,
}: ModalComprovanteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleComprovanteFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onComprovanteDataChange({ ...comprovanteData, arquivo: file });
  };

  const handleSubmit = () => {
    if (!comprovanteData.compraVendaId || !comprovanteData.arquivo) {
      alert('Por favor, selecione uma compra/venda e anexe o comprovante');
      return;
    }

    onSubmit(comprovanteData.compraVendaId, comprovanteData.arquivo);
    onClose();
  };

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
          Anexar Comprovante
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Selecione a compra/venda e anexe o comprovante
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <FormControl fullWidth required>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Selecione a compra/venda
            </Typography>
            <Select
              value={comprovanteData.compraVendaId}
              onChange={(e) => onComprovanteDataChange({ ...comprovanteData, compraVendaId: e.target.value })}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecione uma opção
              </MenuItem>
              {comprasVendas.length === 0 ? (
                <MenuItem value="" disabled>
                  Nenhuma compra/venda cadastrada
                </MenuItem>
              ) : (
                comprasVendas.map((cv) => (
                  <MenuItem key={cv.id} value={cv.id}>
                    {cv.operacao} - {cv.categoria} - {cv.tipo} - R$ {cv.valor} ({cv.data})
                  </MenuItem>
                ))
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
            <Paper
              variant="outlined"
              sx={{
                borderStyle: 'dashed',
                borderColor: COLORS.grey200,
                borderWidth: 2,
                bgcolor: COLORS.grey100,
                textAlign: 'center',
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: COLORS.primary,
                  bgcolor: '#F3F4FF',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
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
            </Paper>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!comprovanteData.compraVendaId || !comprovanteData.arquivo}
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          Anexar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

