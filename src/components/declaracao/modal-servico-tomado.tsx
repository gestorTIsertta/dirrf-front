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
import { FormDataServicoTomado, ServicoTomado } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { formatCPFCNPJ, unformatCPFCNPJ } from 'src/utils/format';
import { CurrencyInputField } from './currency-input';

interface ModalServicoTomadoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServicoTomado) => void;
  formData: FormDataServicoTomado;
  onFormDataChange: (data: FormDataServicoTomado) => void;
  editingId?: string | null;
}

const tiposServico = [
  'Consulta Médica',
  'Exame Médico',
  'Cirurgia',
  'Plano de Saúde',
  'Dentista',
  'Fisioterapia',
  'Psicologia',
  'Psiquiatria',
  'Educação - Ensino Fundamental',
  'Educação - Ensino Médio',
  'Educação - Ensino Superior',
  'Educação - Pós-Graduação',
  'Educação - Cursos Técnicos',
  'Honorários Advocatícios',
  'Serviços Contábeis',
  'Serviços de TI',
  'Outros',
];


export function ModalServicoTomado({
  open,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  editingId,
}: Readonly<ModalServicoTomadoProps>) {
  const handleSubmit = () => {
    if (!formData.nomePrestador || !formData.cpfCnpj || !formData.tipoServico || !formData.valorTotal) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const cpfCnpjLimpo = unformatCPFCNPJ(formData.cpfCnpj);
    if (cpfCnpjLimpo.length !== 11 && cpfCnpjLimpo.length !== 14) {
      alert('CPF deve conter 11 dígitos ou CNPJ deve conter 14 dígitos');
      return;
    }

    const novoServico: ServicoTomado = {
      id: editingId || Date.now().toString(),
      nomePrestador: formData.nomePrestador,
      cpfCnpj: cpfCnpjLimpo,
      tipoServico: formData.tipoServico,
      valorTotal: formData.valorTotal,
      valorReembolsado: formData.valorReembolsado || undefined,
      observacoes: formData.observacoes || undefined,
    };

    onSubmit(novoServico);
  };

  const handleCPFCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPFCNPJ(e.target.value);
    onFormDataChange({ ...formData, cpfCnpj: formatted });
  };


  const valorTotalNum = parseFloat(formData.valorTotal.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const valorReembolsadoNum = parseFloat((formData.valorReembolsado || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const valorDedutivel = valorTotalNum - valorReembolsadoNum;

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
          {editingId ? 'Editar Serviço Tomado' : 'Novo Serviço Tomado'}
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Preencha as informações do serviço tomado
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Nome ou Razão Social do Prestador"
            placeholder="Digite o nome completo ou razão social"
            value={formData.nomePrestador}
            onChange={(e) => onFormDataChange({ ...formData, nomePrestador: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label="CPF ou CNPJ do Prestador"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            value={formData.cpfCnpj}
            onChange={handleCPFCNPJChange}
            required
            helperText="Obrigatório para dedutibilidade"
          />

          <FormControl fullWidth required>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Tipo de Serviço/Despesa
            </Typography>
            <Select
              value={formData.tipoServico}
              onChange={(e) => onFormDataChange({ ...formData, tipoServico: e.target.value })}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecione o tipo de serviço
              </MenuItem>
              {tiposServico.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <CurrencyInputField
            fullWidth
            label="Valor Total Pago no Ano (R$)"
            placeholder="0,00"
            value={formData.valorTotal}
            onChange={(value) => {
              onFormDataChange({ ...formData, valorTotal: value || '' });
            }}
            required
            helperText="Valor total pago no ano-calendário"
          />

          <CurrencyInputField
            fullWidth
            label="Valor Reembolsado (R$)"
            placeholder="0,00"
            value={formData.valorReembolsado}
            onChange={(value) => {
              onFormDataChange({ ...formData, valorReembolsado: value || '' });
            }}
            helperText="Ex: reembolso de plano de saúde. Deixe em branco se não houver reembolso."
          />

          {valorDedutivel > 0 && (
            <Box
              sx={{
                p: 2,
                bgcolor: COLORS.grey100,
                borderRadius: 2,
                border: `1px solid ${COLORS.grey200}`,
              }}
            >
              <Typography variant="body2" color={COLORS.grey600} mb={0.5}>
                Valor Dedutível
              </Typography>
              <Typography variant="h6" fontWeight={700} color={COLORS.primary}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorDedutivel)}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Observações (opcional)"
            placeholder="Informações adicionais sobre o serviço"
            value={formData.observacoes}
            onChange={(e) => onFormDataChange({ ...formData, observacoes: e.target.value })}
            multiline
            rows={3}
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

