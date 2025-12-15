import { useState, useEffect } from 'react';
import { Grid, Card, Stack, Typography, Chip, Box } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify/iconify';
import { COLORS } from 'src/constants/declaracao';
import { getSummary, SummaryResponse } from 'src/api/requests/summary';
import { Loading } from 'src/components/loading/loading';
import { formatCurrency } from 'src/utils/format';

interface ResumoCardsProps {
  year: number;
}

export function ResumoCards({ year }: ResumoCardsProps) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await getSummary(year);
        setSummary(data);
      } catch (err) {
        console.error('Erro ao carregar resumo:', err);
        setSummary({
          rendimentos: { tributaveis: 0, isentos: 0, exclusivos: 0 },
          bensEDireitos: { valorTotal: 0, itensDeclarados: 0 },
          dividasEOnus: { totalDividas: 0, obrigacoes: 0 },
          restituicao: { valor: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [year]);

  if (loading) {
    return (
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Loading />
      </Card>
    );
  }

  const rendimentos = summary?.rendimentos || { tributaveis: 0, isentos: 0, exclusivos: 0, variacaoPercentual: 0 };
  const bensEDireitos = summary?.bensEDireitos || { valorTotal: 0, itensDeclarados: 0, variacaoPercentual: 0 };
  const dividasEOnus = summary?.dividasEOnus || { totalDividas: 0, obrigacoes: 0, variacaoPercentual: 0 };
  const restituicao = summary?.restituicao || { valor: 0, previsao: 'A calcular' };
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
                {rendimentos.variacaoPercentual !== undefined && rendimentos.variacaoPercentual !== 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify 
                      icon={rendimentos.variacaoPercentual > 0 ? "eva:arrow-upward-fill" : "eva:arrow-downward-fill"} 
                      width={16} 
                      sx={{ color: rendimentos.variacaoPercentual > 0 ? COLORS.success : COLORS.error }} 
                    />
                    <Typography 
                      variant="caption" 
                      color={rendimentos.variacaoPercentual > 0 ? COLORS.success : COLORS.error} 
                      fontWeight={600}
                    >
                      {Math.abs(rendimentos.variacaoPercentual).toFixed(1)}%
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Tributáveis
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {formatCurrency(rendimentos.tributaveis)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Isentos
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {formatCurrency(rendimentos.isentos)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Exclusivos
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {formatCurrency(rendimentos.exclusivos)}
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
                {bensEDireitos.variacaoPercentual !== undefined && bensEDireitos.variacaoPercentual !== 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify 
                      icon={bensEDireitos.variacaoPercentual > 0 ? "eva:arrow-upward-fill" : "eva:arrow-downward-fill"} 
                      width={16} 
                      sx={{ color: bensEDireitos.variacaoPercentual > 0 ? COLORS.success : COLORS.error }} 
                    />
                    <Typography 
                      variant="caption" 
                      color={bensEDireitos.variacaoPercentual > 0 ? COLORS.success : COLORS.error} 
                      fontWeight={600}
                    >
                      {Math.abs(bensEDireitos.variacaoPercentual).toFixed(1)}%
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Valor total
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {formatCurrency(bensEDireitos.valorTotal)}
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
                  {bensEDireitos.itensDeclarados} {bensEDireitos.itensDeclarados === 1 ? 'item' : 'itens'}
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
                {dividasEOnus.variacaoPercentual !== undefined && dividasEOnus.variacaoPercentual !== 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify 
                      icon={dividasEOnus.variacaoPercentual > 0 ? "eva:arrow-upward-fill" : "eva:arrow-downward-fill"} 
                      width={16} 
                      sx={{ color: dividasEOnus.variacaoPercentual > 0 ? COLORS.error : COLORS.success }} 
                    />
                    <Typography 
                      variant="caption" 
                      color={dividasEOnus.variacaoPercentual > 0 ? COLORS.error : COLORS.success} 
                      fontWeight={600}
                    >
                      {Math.abs(dividasEOnus.variacaoPercentual).toFixed(1)}%
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color={COLORS.grey600}>
                  Total em dívidas
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {formatCurrency(dividasEOnus.totalDividas)}
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
                  {dividasEOnus.obrigacoes} {dividasEOnus.obrigacoes === 1 ? 'item' : 'itens'}
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
                  {formatCurrency(restituicao.valor)}
                </Typography>
              </Box>
              {restituicao.previsao && (
                <Typography variant="caption" color={COLORS.grey600}>
                  Previsão: {restituicao.previsao}
                </Typography>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
}

