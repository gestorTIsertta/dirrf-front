import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  Send as SendIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import type { DeclaracaoResumo } from 'src/types/backoffice';
import { listClientsByResponsible } from 'src/api/requests/backoffice-clients';
import { enqueueSnackbar } from 'notistack';
import { PageHeader, SummaryCardsGrid, DeclaracoesTable, type SummaryCardData } from 'src/components/contador';

const COLORS = {
  primary: '#2563EB',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  grey100: '#F9FAFB',
  grey200: '#E5E7EB',
  grey600: '#4B5563',
  grey800: '#111827',
};

function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function BackofficeDeclaracoesView() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const [declaracoes, setDeclaracoes] = useState<DeclaracaoResumo[]>([]);
  const [cardsResumo, setCardsResumo] = useState<SummaryCardData[]>([
    { 
      label: 'Total de declarações', 
      valor: 0, 
      diff: '0 declarações', 
      cor: '#EEF2FF',
      icon: DescriptionIcon,
      iconColor: '#2563EB',
    },
    { 
      label: 'Em preenchimento', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#FEF3C7',
      icon: AccessTimeIcon,
      iconColor: '#F59E0B',
    },
    { 
      label: 'Aguardando conferência', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#FEF3C7',
      icon: WarningIcon,
      iconColor: '#F59E0B',
    },
    { 
      label: 'Enviado à Receita', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#DBEAFE',
      icon: SendIcon,
      iconColor: '#8B5CF6',
    },
    { 
      label: 'Finalizado', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#DCFCE7',
      icon: CheckCircleOutlineIcon,
      iconColor: '#16A34A',
    },
  ]);

  const handleViewCliente = (declaracao: DeclaracaoResumo) => {
    const clientCpf = declaracao.cpf.replace(/\D/g, '');
    
    if (!clientCpf || clientCpf.length < 11) {
      enqueueSnackbar('CPF inválido', { variant: 'error' });
      return;
    }
    router.push(`${paths.declaracao}?cpf=${clientCpf}`);
  };

  useEffect(() => {
    let isMounted = true; // Flag para evitar atualizações se o componente foi desmontado
    
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await listClientsByResponsible({
          page: 1,
          limit: 100, // Buscar muitos clientes para o dashboard
        });

        // Só atualiza o estado se o componente ainda estiver montado
        if (!isMounted) return;

        // Transformar clientes em declarações (mockado pois não temos dados de declaração ainda)
        // TODO: Quando o backend tiver endpoint de declarações, usar dados reais
        const declaracoesData: DeclaracaoResumo[] = response.clients
          .filter(client => client.type === 'PF') // Apenas pessoas físicas por enquanto
          .map((client, index) => ({
            id: client.id,
            nome: client.name,
            cpf: client.documentFormatted || formatCPF(client.document),
            status: (['Em preenchimento', 'Aguardando conferência', 'Enviado à Receita', 'Finalizado'] as const)[
              index % 4
            ],
            ano: parseInt(selectedYear),
            resultado: 'A calcular', // TODO: Buscar da declaração quando endpoint existir
            resultadoTipo: 'pagar' as const,
            dataEnvio: client.lastInvoiceDate 
              ? new Date(client.lastInvoiceDate).toLocaleDateString('pt-BR')
              : 'Não enviado',
            responsavel: client.email || 'Não atribuído',
            pendencias: '0 itens', // TODO: Calcular quando endpoint existir
          }));

        setDeclaracoes(declaracoesData);

        const total = declaracoesData.length;
        const emPreenchimento = declaracoesData.filter(d => d.status === 'Em preenchimento').length;
        const aguardando = declaracoesData.filter(d => d.status === 'Aguardando conferência').length;
        const enviado = declaracoesData.filter(d => d.status === 'Enviado à Receita').length;
        const finalizado = declaracoesData.filter(d => d.status === 'Finalizado').length;

        setCardsResumo([
          { 
            label: 'Total de declarações', 
            valor: total, 
            diff: `${total} declarações`, 
            cor: '#EEF2FF',
            icon: DescriptionIcon,
            iconColor: '#2563EB',
          },
          { 
            label: 'Em preenchimento', 
            valor: emPreenchimento, 
            diff: total > 0 ? `${Math.round((emPreenchimento / total) * 100)}% do total` : '0% do total', 
            cor: '#FEF3C7',
            icon: AccessTimeIcon,
            iconColor: '#F59E0B',
          },
          { 
            label: 'Aguardando conferência', 
            valor: aguardando, 
            diff: total > 0 ? `${Math.round((aguardando / total) * 100)}% do total` : '0% do total', 
            cor: '#FEF3C7',
            icon: WarningIcon,
            iconColor: '#F59E0B',
          },
          { 
            label: 'Enviado à Receita', 
            valor: enviado, 
            diff: total > 0 ? `${Math.round((enviado / total) * 100)}% do total` : '0% do total', 
            cor: '#DBEAFE',
            icon: SendIcon,
            iconColor: '#8B5CF6',
          },
          { 
            label: 'Finalizado', 
            valor: finalizado, 
            diff: total > 0 ? `${Math.round((finalizado / total) * 100)}% do total` : '0% do total', 
            cor: '#DCFCE7',
            icon: CheckCircleOutlineIcon,
            iconColor: '#16A34A',
          },
        ]);
      } catch (error: unknown) {
        
        // Verificar se é erro de autenticação
        const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
        if (axiosError?.response?.status === 401) {
          enqueueSnackbar('Erro de autenticação. Por favor, faça login novamente.', { variant: 'error' });
          setTimeout(() => {
            router.push(paths.contador.login);
          }, 2000);
        } else if (axiosError?.response?.status === 403) {
          enqueueSnackbar('Acesso negado. Verifique suas permissões.', { variant: 'error' });
        } else {
          const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao carregar declarações';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClients();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]); // router é estável e não precisa estar nas dependências

  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: COLORS.grey100, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        px: 2
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: COLORS.grey100, minHeight: '100vh', py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <PageHeader
          title="Backoffice – Declarações de Imposto de Renda"
          subtitle="Gerencie, edite e valide as declarações dos seus clientes."
        />

        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            mb={2}
            spacing={{ xs: 2, sm: 0 }}
          >
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Filtros
            </Typography>
            <Button 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Limpar filtros
            </Button>
          </Stack>
          <Grid container spacing={{ xs: 2, sm: 2 }}>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Ano-calendário</InputLabel>
                <Select
                  label="Ano-calendário"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <SummaryCardsGrid cards={cardsResumo} />

        <DeclaracoesTable declaracoes={declaracoes} onViewCliente={handleViewCliente} />
      </Container>
    </Box>
  );
}
