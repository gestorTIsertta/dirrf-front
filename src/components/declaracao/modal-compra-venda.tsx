import { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  TextField,
  Button,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { FormDataCompraVenda, CompraVenda } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';

interface ModalCompraVendaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompraVenda) => void;
  operacao: 'Compra' | 'Venda' | null;
  categoria: string | null;
  formData: FormDataCompraVenda;
  onFormDataChange: (data: FormDataCompraVenda) => void;
}

export function ModalCompraVenda({
  open,
  onClose,
  onSubmit,
  operacao,
  categoria,
  formData,
  onFormDataChange,
}: ModalCompraVendaProps) {
  const comprovanteFileInputRef = useRef<HTMLInputElement>(null);

  const handleComprovanteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFormDataChange({ ...formData, comprovante: file });
  };

  const handleSubmit = () => {
    if (!formData.tipo || !formData.data || !formData.valor) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novaCompraVenda: CompraVenda = {
      id: Date.now().toString(),
      categoria: categoria || '',
      tipo: formData.tipo,
      operacao: operacao || 'Compra',
      data: formData.data,
      valor: formData.valor,
      comprovante: formData.comprovante,
    };

    onSubmit(novaCompraVenda);
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
          {operacao === 'Compra' ? 'Nova Compra' : 'Nova Venda'} - {categoria}
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Preencha as informações da {operacao?.toLowerCase()}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Tipo"
            placeholder="Ex: Apartamento, Automóvel, Ações..."
            value={formData.tipo}
            onChange={(e) => onFormDataChange({ ...formData, tipo: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Data"
            type="date"
            value={formData.data}
            onChange={(e) => onFormDataChange({ ...formData, data: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Valor (R$)"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => onFormDataChange({ ...formData, valor: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Descrição (opcional)"
            placeholder="Informações adicionais sobre a operação"
            value={formData.descricao}
            onChange={(e) => onFormDataChange({ ...formData, descricao: e.target.value })}
            multiline
            rows={3}
          />

          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Anexar Comprovante (opcional)
            </Typography>
            <input
              ref={comprovanteFileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleComprovanteChange}
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
              onClick={() => comprovanteFileInputRef.current?.click()}
            >
              {formData.comprovante ? (
                <Stack spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 32 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {formData.comprovante.name}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFormDataChange({ ...formData, comprovante: null });
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
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

