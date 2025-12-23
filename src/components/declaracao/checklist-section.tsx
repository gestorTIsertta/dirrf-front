import { useState } from 'react';
import { Box, Card, Stack, Typography, Button, Grid, Checkbox, CircularProgress } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { checklistItems, COLORS } from 'src/constants/declaracao';
import { updateDeclarationStatus } from 'src/api/requests/declarations';
import { getMeProfile } from 'src/api/requests/me';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';

interface ChecklistSectionProps {
  year: number;
}

export function ChecklistSection({ year }: ChecklistSectionProps) {
  const location = useLocation();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(checklistItems.length).fill(false));
  const [loading, setLoading] = useState(false);

  const getClientCpf = async (): Promise<string> => {
    const searchParams = new URLSearchParams(location.search);
    const cpfFromQuery = searchParams.get('cpf');

    if (cpfFromQuery) {
      return cpfFromQuery.replace(/\D/g, '');
    }

    try {
      const profile = await getMeProfile();
      return profile.document.replace(/\D/g, '');
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      throw new Error('Não foi possível obter o CPF do cliente');
    }
  };

  const allChecked = checkedItems.every((checked) => checked);

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const handleEnviarDeclaracao = async () => {
    if (!allChecked) {
      enqueueSnackbar('Por favor, marque todos os itens do checklist antes de enviar', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const clientCpf = await getClientCpf();
      
      if (!clientCpf || clientCpf.length < 11) {
        enqueueSnackbar('CPF do cliente não encontrado ou inválido', { variant: 'error' });
        return;
      }

      await updateDeclarationStatus(year, 'em_analise', clientCpf);
      enqueueSnackbar('Declaração enviada para contabilidade com sucesso!', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao enviar declaração';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Antes de enviar, confirme:
      </Typography>
      <Stack spacing={1.5} mb={2}>
        {checklistItems.map((item, idx) => (
          <Stack direction="row" spacing={1} key={idx} sx={{ alignItems: 'flex-start' }}>
            <Checkbox
              checked={checkedItems[idx]}
              onChange={() => handleCheckboxChange(idx)}
              disabled={loading}
              sx={{ mt: { xs: -0.5, sm: 0 } }}
            />
            <Box>
              <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {item.titulo}
              </Typography>
              <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {item.desc}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Card sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: '#EFF6FF', mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Importante
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Após o envio, sua declaração será analisada pela nossa equipe de contadores. Alterações posteriores deverão
          ser solicitadas diretamente ao escritório através do chat ou telefone.
        </Typography>
      </Card>
      <Button
        fullWidth
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <SendIcon />}
        onClick={handleEnviarDeclaracao}
        disabled={!allChecked || loading}
        sx={{
          bgcolor: COLORS.primary,
          py: { xs: 1.25, sm: 1.5 },
          mb: 3,
          '&:hover': { bgcolor: COLORS.primaryDark },
          '&:disabled': {
            bgcolor: COLORS.grey200,
            color: COLORS.grey600,
          },
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {loading ? 'Enviando...' : 'Enviar Declaração para Contabilidade'}
        </Box>
        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
          {loading ? 'Enviando...' : 'Enviar Declaração'}
        </Box>
      </Button>

      <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: '#F3E8FF', height: '100%', display: 'flex' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
              <ChatIcon sx={{ color: '#7C3AED', fontSize: { xs: 32, sm: 40 }, mt: { xs: 0, sm: 0.5 }, flexShrink: 0 }} />
              <Stack spacing={1} sx={{ flex: 1, height: '100%', width: '100%' }}>
                <Typography fontWeight={700} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Precisa de ajuda?
                </Typography>
                <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Nossa equipe está pronta para esclarecer suas dúvidas sobre a declaração.
                </Typography>
                <Box sx={{ flex: 1, minHeight: 2 }} />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    bgcolor: '#7C3AED',
                    '&:hover': { bgcolor: '#6D28D9' },
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Iniciar chat com contador
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    Iniciar chat
                  </Box>
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: COLORS.successLight, height: '100%', display: 'flex' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
              <HelpOutlineIcon
                sx={{ color: COLORS.success, fontSize: { xs: 32, sm: 40 }, mt: { xs: 0, sm: 0.5 }, flexShrink: 0 }}
              />
              <Stack spacing={1} sx={{ flex: 1, height: '100%', width: '100%' }}>
                <Typography fontWeight={700} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Base de conhecimento
                </Typography>
                <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Acesse artigos, vídeos e guias passo a passo sobre declaração de IR.
                </Typography>
                <Box sx={{ flex: 1, minHeight: 2 }} />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    bgcolor: COLORS.success,
                    '&:hover': { bgcolor: '#118D57' },
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Acessar central de ajuda
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    Central de ajuda
                  </Box>
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
}

