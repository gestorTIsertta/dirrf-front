import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { FormDataEmprestimo, Banco } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { getBancoImagem } from 'src/constants/bancos';
import { DatePickerField } from './date-picker-field';

interface ModalEmprestimoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormDataEmprestimo) => void;
  formData: FormDataEmprestimo;
  onFormDataChange: (data: FormDataEmprestimo) => void;
  bancos: Banco[];
}

export function ModalEmprestimo({
  open,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  bancos,
}: Readonly<ModalEmprestimoProps>) {
  const handleSubmit = () => {
    if (!formData.data || !formData.bancoId || !formData.valor) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    onSubmit(formData);
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
          Novo Empréstimo
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Preencha as informações do empréstimo
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <DatePickerField
            label="Data do Empréstimo"
            value={formData.data}
            onChange={(e) => onFormDataChange({ ...formData, data: e.target.value })}
            required
          />
          <FormControl fullWidth required>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Banco
            </Typography>
            <Select
              value={formData.bancoId}
              onChange={(e) => onFormDataChange({ ...formData, bancoId: e.target.value })}
              displayEmpty
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
          <TextField
            fullWidth
            label="Valor (R$)"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => onFormDataChange({ ...formData, valor: e.target.value })}
            required
          />
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

