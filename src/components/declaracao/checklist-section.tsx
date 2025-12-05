import { Box, Paper, Stack, Typography, Button, Grid, Checkbox } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { checklistItems, COLORS } from 'src/constants/declaracao';

export function ChecklistSection() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Antes de enviar, confirme:
      </Typography>
      <Stack spacing={1.5} mb={2}>
        {checklistItems.map((item, idx) => (
          <Stack direction="row" spacing={1} key={idx} sx={{ alignItems: 'flex-start' }}>
            <Checkbox sx={{ mt: { xs: -0.5, sm: 0 } }} />
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
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: '#EFF6FF', mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Importante
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Após o envio, sua declaração será analisada pela nossa equipe de contadores. Alterações posteriores deverão
          ser solicitadas diretamente ao escritório através do chat ou telefone.
        </Typography>
      </Paper>
      <Button
        fullWidth
        variant="contained"
        startIcon={<SendIcon />}
        sx={{
          bgcolor: COLORS.primary,
          py: { xs: 1.25, sm: 1.5 },
          mb: 3,
          '&:hover': { bgcolor: COLORS.primaryDark },
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          Enviar Declaração para Contabilidade
        </Box>
        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
          Enviar Declaração
        </Box>
      </Button>

      <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: '#F3E8FF', height: '100%', display: 'flex' }}>
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
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: COLORS.successLight, height: '100%', display: 'flex' }}>
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
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

