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
  Card as FileCard,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { Banco, FormDataBanco } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { getBancoOptionsOrdenados, getBancoImagem } from 'src/constants/bancos';
import { DatePickerField } from './date-picker-field';

interface ModalBancoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (banco: Banco) => void;
  formData: FormDataBanco;
  onFormDataChange: (data: FormDataBanco) => void;
  editingId: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function ModalBanco({
  open,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  editingId,
  fileInputRef,
}: Readonly<ModalBancoProps>) {
  const todosBancos = getBancoOptionsOrdenados();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      onFormDataChange({ 
        ...formData, 
        informesAnexados: [...formData.informesAnexados, file],
        informeRendimentos: null 
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const novosArquivos = formData.informesAnexados.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, informesAnexados: novosArquivos });
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.conta || !formData.agencia || !formData.dataAbertura) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const bancoSelecionado = getBancoOptionsOrdenados().find((opt) => opt.label === formData.nome);

    const banco: Banco = {
      id: editingId || Date.now().toString(),
      nome: formData.nome,
      codigoCompe: bancoSelecionado?.codigo,
      conta: formData.conta,
      agencia: formData.agencia,
      tipo: formData.tipo,
      dataAbertura: formData.dataAbertura,
      informeRendimentos: formData.informesAnexados.length > 0 ? formData.informesAnexados[0] : undefined,
    };

    onSubmit(banco);
  };

  const handleBancoChange = (nomeBanco: string) => {
    onFormDataChange({ ...formData, nome: nomeBanco });
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
          {editingId ? 'Editar Banco' : 'Cadastrar Banco'}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <Autocomplete
            freeSolo
            options={todosBancos}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            value={todosBancos.find((b) => b.label === formData.nome) || null}
            onChange={(_, newValue) => {
              if (newValue && typeof newValue !== 'string') {
                handleBancoChange(newValue.label);
              } else if (typeof newValue === 'string' && newValue) {
                const bancoEncontrado = todosBancos.find(
                  (opt) => opt.label.toLowerCase() === newValue.toLowerCase()
                );
                if (bancoEncontrado) {
                  handleBancoChange(bancoEncontrado.label);
                } else {
                  handleBancoChange(newValue);
                }
              } else {
                handleBancoChange('');
              }
            }}
              renderOption={(props, option) => {
              const label = typeof option === 'string' ? option : option.label;
              const codigo = typeof option === 'string' ? null : option.codigo;
              const imagemBanco = getBancoImagem(codigo || null);
              
              return (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 0.75 }}>
                  <Box
                    component="img"
                    src={imagemBanco || ''}
                    alt={label}
                    sx={{
                      width: 20,
                      height: 20,
                      objectFit: 'contain',
                      flexShrink: 0,
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {label.toUpperCase()}
                  </Typography>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Nome do Banco" 
                placeholder="Ex: Banco do Brasil"
                required
              />
            )}
          />
          <TextField
            fullWidth
            label="Conta"
            placeholder="00000-0"
            value={formData.conta}
            onChange={(e) => onFormDataChange({ ...formData, conta: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Agência"
            placeholder="0000-0"
            value={formData.agencia}
            onChange={(e) => onFormDataChange({ ...formData, agencia: e.target.value })}
            required
          />
          <FormControl fullWidth required>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Tipo de Conta
            </Typography>
            <Select
              value={formData.tipo}
              onChange={(e) => onFormDataChange({ ...formData, tipo: e.target.value as 'Corrente' | 'Poupança' })}
            >
              <MenuItem value="Corrente">Corrente</MenuItem>
              <MenuItem value="Poupança">Poupança</MenuItem>
            </Select>
          </FormControl>
          <DatePickerField
            label="Data de Abertura"
            value={formData.dataAbertura}
            onChange={(e) => onFormDataChange({ ...formData, dataAbertura: e.target.value })}
            required
          />

          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Informe de Rendimentos (opcional)
            </Typography>
            
            {formData.informesAnexados.length > 0 && (
              <Stack spacing={1} mb={2}>
                {formData.informesAnexados.map((arquivo, index) => (
                  <FileCard
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: COLORS.grey100,
                    }}
                  >
                    <DescriptionIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                        {arquivo.name}
                      </Typography>
                      <Typography variant="caption" color={COLORS.grey600}>
                        {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      sx={{ color: COLORS.primary }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </FileCard>
                ))}
              </Stack>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <FileCard
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
              <Stack spacing={1} alignItems="center">
                <CloudUploadIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                <Typography variant="body2" fontWeight={600}>
                  Clique para selecionar arquivo
                </Typography>
                <Typography variant="caption" color={COLORS.grey600}>
                  PDF – até 10 MB
                </Typography>
              </Stack>
            </FileCard>
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
          {editingId ? 'Salvar Alterações' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

