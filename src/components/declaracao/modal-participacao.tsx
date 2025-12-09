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
} from '@mui/material';
import { FormDataParticipacao } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';

interface ModalParticipacaoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormDataParticipacao) => void;
  formData: FormDataParticipacao;
  onFormDataChange: (data: FormDataParticipacao) => void;
}

export function ModalParticipacao({
  open,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
}: ModalParticipacaoProps) {
  const handleSubmit = () => {
    if (!formData.cnpj || !formData.razaoSocial || !formData.percentual) {
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
          Nova Participação em Empresa
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Preencha as informações da participação
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChange={(e) => onFormDataChange({ ...formData, cnpj: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Razão Social"
            placeholder="Nome da empresa"
            value={formData.razaoSocial}
            onChange={(e) => onFormDataChange({ ...formData, razaoSocial: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Percentual de Participação (%)"
            placeholder="0,00"
            value={formData.percentual}
            onChange={(e) => onFormDataChange({ ...formData, percentual: e.target.value })}
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

