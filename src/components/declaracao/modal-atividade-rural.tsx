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
  Typography,
  Box,
  Card,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { FormDataAtividadeRural, Banco } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { getBancoImagem } from 'src/constants/bancos';
import { CurrencyInputField } from './currency-input';

interface ModalAtividadeRuralProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormDataAtividadeRural) => void;
  formData: FormDataAtividadeRural;
  onFormDataChange: (data: FormDataAtividadeRural) => void;
  bancos: Banco[];
}

export function ModalAtividadeRural({
  open,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  bancos,
}: ModalAtividadeRuralProps) {
  const fichaSanitariaInputRef = useRef<HTMLInputElement>(null);

  const handleFichaSanitariaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      onFormDataChange({ 
        ...formData, 
        fichasAnexadas: [...formData.fichasAnexadas, file],
        fichaSanitaria: null 
      });
      if (fichaSanitariaInputRef.current) {
        fichaSanitariaInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const novosArquivos = formData.fichasAnexadas.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, fichasAnexadas: novosArquivos });
  };

  const handleSubmit = () => {
    if (!formData.emprestimoRuralBancoId || !formData.emprestimoRuralValor || !formData.bensAtividadeRural) {
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
          Atividade Rural
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          Preencha as informações da atividade rural
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Empréstimo Rural
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth required>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Banco
                </Typography>
                <Select
                  value={formData.emprestimoRuralBancoId}
                  onChange={(e) => onFormDataChange({ ...formData, emprestimoRuralBancoId: e.target.value })}
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
              <CurrencyInputField
                fullWidth
                label="Valor (R$)"
                placeholder="0,00"
                value={formData.emprestimoRuralValor}
                onChange={(value) => {
                  onFormDataChange({ ...formData, emprestimoRuralValor: value || '' });
                }}
                required
              />
            </Stack>
          </Box>

          <TextField
            fullWidth
            label="Bens da Atividade Rural"
            placeholder="Descreva os bens"
            value={formData.bensAtividadeRural}
            onChange={(e) => onFormDataChange({ ...formData, bensAtividadeRural: e.target.value })}
            multiline
            rows={3}
            required
          />

          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Ficha Sanitária
            </Typography>
            
            {formData.fichasAnexadas.length > 0 && (
              <Stack spacing={1} mb={2}>
                {formData.fichasAnexadas.map((arquivo, index) => (
                  <Card
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
                  </Card>
                ))}
              </Stack>
            )}

            <input
              ref={fichaSanitariaInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFichaSanitariaChange}
            />
            <Card
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
              onClick={() => fichaSanitariaInputRef.current?.click()}
            >
              <Stack spacing={1} alignItems="center">
                <CloudUploadIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                <Typography variant="body2" fontWeight={600}>
                  Clique para anexar documento
                </Typography>
                <Typography variant="caption" color={COLORS.grey600}>
                  PDF, JPG, PNG – até 10 MB
                </Typography>
              </Stack>
            </Card>
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

