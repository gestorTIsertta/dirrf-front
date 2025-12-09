import { Grid, Card, Stack, Typography, Chip, Box } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify/iconify';
import { COLORS } from 'src/constants/declaracao';

export function ResumoCards() {
  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Resumo da Declaração
      </Typography>
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  bgcolor: '#E3F2FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Iconify icon="solar:document-text-bold" width={28} sx={{ color: '#2196F3' }} />
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color={COLORS.grey600} mb={0.5}>
                  Rendimentos
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="eva:arrow-upward-fill" width={16} sx={{ color: COLORS.success }} />
                  <Typography variant="caption" color={COLORS.success} fontWeight={600}>
                    12.5%
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Tributáveis
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  R$ 185.420,00
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Isentos
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  R$ 24.800,00
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Exclusivos
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  R$ 12.350,00
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  bgcolor: '#F3E5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Iconify icon="solar:buildings-2-bold" width={28} sx={{ color: '#9C27B0' }} />
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color={COLORS.grey600} mb={0.5}>
                  Bens e Direitos
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="eva:arrow-upward-fill" width={16} sx={{ color: COLORS.success }} />
                  <Typography variant="caption" color={COLORS.success} fontWeight={600}>
                    8.2%
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Valor total
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  R$ 845.200,00
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Itens declarados
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.primary}
                  fontWeight={600}
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  18 itens
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  bgcolor: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Iconify icon="solar:wallet-bold" width={28} sx={{ color: '#FF9800' }} />
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color={COLORS.grey600} mb={0.5}>
                  Dívidas e Ônus
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="eva:arrow-upward-fill" width={16} sx={{ color: COLORS.error }} />
                  <Typography variant="caption" color={COLORS.error} fontWeight={600}>
                    15.3%
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Total em dívidas
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  R$ 125.800,00
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Obrigações
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.error}
                  fontWeight={600}
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  5 itens
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, bgcolor: COLORS.successLight, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: COLORS.success,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircleIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Chip label="Restituição" size="small" sx={{ bgcolor: COLORS.success, color: '#fff', fontWeight: 600 }} />
            </Stack>
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Restituição a receber
                </Typography>
                <Typography fontWeight={700} color={COLORS.success} fontSize={24}>
                  R$ 4.825,00
                </Typography>
              </Box>
              <Typography variant="caption" color={COLORS.grey600}>
                Previsão: 3º lote (Julho/2024)
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
}

