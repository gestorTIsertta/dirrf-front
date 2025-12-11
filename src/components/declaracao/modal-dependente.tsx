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
} from '@mui/material';
import { FormDataDependente, Dependente } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { DatePickerField } from './date-picker-field';

interface ModalDependenteProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Dependente) => void;
  formData: FormDataDependente;
  onFormDataChange: (data: FormDataDependente) => void;
  editingId?: string | null;
}

const grausParentesco = [
  'Filho(a)',
  'Cônjuge',
  'Enteado(a)',
  'Pai',
  'Mãe',
  'Irmão(ã)',
  'Neto(a)',
  'Bisneto(a)',
  'Sobrinho(a)',
  'Genro/Nora',
  'Sogro(a)',
  'Outro',
];

const nacionalidades = [
  'Brasileiro(a)',
  'Argentino(a)',
  'Chileno(a)',
  'Uruguaio(a)',
  'Paraguaio(a)',
  'Outro',
];

const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  }
  return value;
};

export function ModalDependente({
  open,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  editingId,
}: Readonly<ModalDependenteProps>) {
  const handleSubmit = () => {
    if (!formData.nomeCompleto || !formData.cpf || !formData.dataNascimento || !formData.grauParentesco) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      alert('CPF deve conter 11 dígitos');
      return;
    }

    const novoDependente: Dependente = {
      id: editingId || Date.now().toString(),
      nomeCompleto: formData.nomeCompleto,
      cpf: cpfLimpo,
      dataNascimento: formData.dataNascimento,
      grauParentesco: formData.grauParentesco,
      nomeMae: formData.nomeMae || undefined,
      nacionalidade: formData.nacionalidade || undefined,
      sexo: formData.sexo ? (formData.sexo as 'Masculino' | 'Feminino' | 'Outro') : undefined,
    };

    onSubmit(novoDependente);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    onFormDataChange({ ...formData, cpf: formatted });
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
          {editingId ? 'Editar Dependente' : 'Novo Dependente'}
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Preencha as informações do dependente
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Nome Completo"
            placeholder="Digite o nome completo do dependente"
            value={formData.nomeCompleto}
            onChange={(e) => onFormDataChange({ ...formData, nomeCompleto: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label="CPF"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={handleCPFChange}
            required
            inputProps={{ maxLength: 14 }}
          />

          <DatePickerField
            label="Data de Nascimento"
            value={formData.dataNascimento}
            onChange={(e) => onFormDataChange({ ...formData, dataNascimento: e.target.value })}
            required
          />

          <FormControl fullWidth required>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Grau de Parentesco
            </Typography>
            <Select
              value={formData.grauParentesco}
              onChange={(e) => onFormDataChange({ ...formData, grauParentesco: e.target.value })}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecione o grau de parentesco
              </MenuItem>
              {grausParentesco.map((grau) => (
                <MenuItem key={grau} value={grau}>
                  {grau}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Nome da Mãe (opcional)"
            placeholder="Nome completo da mãe do dependente"
            value={formData.nomeMae}
            onChange={(e) => onFormDataChange({ ...formData, nomeMae: e.target.value })}
          />

          <FormControl fullWidth>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Nacionalidade (opcional)
            </Typography>
            <Select
              value={formData.nacionalidade}
              onChange={(e) => onFormDataChange({ ...formData, nacionalidade: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">Selecione a nacionalidade</MenuItem>
              {nacionalidades.map((nacionalidade) => (
                <MenuItem key={nacionalidade} value={nacionalidade}>
                  {nacionalidade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Sexo (opcional)
            </Typography>
            <Select
              value={formData.sexo}
              onChange={(e) => onFormDataChange({ ...formData, sexo: e.target.value as 'Masculino' | 'Feminino' | 'Outro' | '' })}
              displayEmpty
            >
              <MenuItem value="">Selecione o sexo</MenuItem>
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Feminino">Feminino</MenuItem>
              <MenuItem value="Outro">Outro</MenuItem>
            </Select>
          </FormControl>
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

