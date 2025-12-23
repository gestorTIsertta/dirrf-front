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
import type { DeclaracaoResumo, Comentario } from 'src/types/backoffice';
import { listClientsByResponsible, updateClient, type Client, type ClientStatus } from 'src/api/requests/backoffice-clients';
import { enqueueSnackbar } from 'notistack';
import { authBackoffice } from 'src/config-firebase-backoffice';
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
  const [clientsMap, setClientsMap] = useState<Record<string, Client>>({});
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

  const handleEnviarDeclaracao = async (_declaracao: DeclaracaoResumo, _arquivo: File) => {
    enqueueSnackbar('Funcionalidade de envio de declaração em desenvolvimento', { variant: 'info' });
  };

  const comentariosIniciais: Comentario[] = [
    {
      id: '1',
      texto: 'Documento "Escritura_Apartamento.pdf" aprovado e vinculado ao item de declaração.',
      autorNome: 'Rafael Silva',
      autorEmail: 'rafael.silva@exemplo.com',
      data: new Date(2024, 2, 20, 14, 35).toISOString(),
      createdAt: new Date(2024, 2, 20, 14, 35).toISOString(),
    },
    {
      id: '2',
      texto: 'Valor de "Rendimentos de trabalho assalariado" alterado de R$ 120.000,00 para R$ 125.450,00',
      autorNome: 'Rafael Silva',
      autorEmail: 'rafael.silva@exemplo.com',
      data: new Date(2024, 2, 19, 16, 20).toISOString(),
      createdAt: new Date(2024, 2, 19, 16, 20).toISOString(),
    },
    {
      id: '3',
      texto: 'Mensagem enviada ao cliente solicitando esclarecimento sobre compra de veículo.',
      autorNome: 'Rafael Silva',
      autorEmail: 'rafael.silva@exemplo.com',
      data: new Date(2024, 2, 18, 10, 15).toISOString(),
      createdAt: new Date(2024, 2, 18, 10, 15).toISOString(),
    },
    {
      id: '4',
      texto: 'Cliente enviou 3 novos documentos para análise.',
      autorNome: 'Cliente',
      autorEmail: 'cliente@exemplo.com',
      data: new Date(2024, 2, 15, 9, 45).toISOString(),
      createdAt: new Date(2024, 2, 15, 9, 45).toISOString(),
    },
    {
      id: '5',
      texto: 'Declaração criada para o ano-calendário 2024.',
      autorNome: 'Rafael Silva',
      autorEmail: 'rafael.silva@exemplo.com',
      data: new Date(2024, 2, 10, 11, 30).toISOString(),
      createdAt: new Date(2024, 2, 10, 11, 30).toISOString(),
    },
  ];

  const [comentariosMap, setComentariosMap] = useState<Record<string, Comentario[]>>({});

  const handleAdicionarComentario = async (declaracao: DeclaracaoResumo, comentario: string) => {
    const user = authBackoffice.currentUser;
    const autorNome = user?.displayName || user?.email?.split('@')[0] || 'Usuário';
    const autorEmail = user?.email || '';
    
    const novoComentario: Comentario = {
      id: Date.now().toString(),
      texto: comentario,
      autorNome,
      autorEmail,
      data: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    setComentariosMap((prev) => ({
      ...prev,
      [declaracao.id]: [...(prev[declaracao.id] || []), novoComentario],
    }));
    
    enqueueSnackbar('Comentário adicionado com sucesso', { variant: 'success' });
  };

  const handleEditarComentario = async (declaracao: DeclaracaoResumo, comentarioId: string, comentario: string) => {
    setComentariosMap((prev) => ({
      ...prev,
      [declaracao.id]: (prev[declaracao.id] || []).map((c) =>
        c.id === comentarioId ? { ...c, texto: comentario } : c
      ),
    }));
    
    enqueueSnackbar('Comentário editado com sucesso', { variant: 'success' });
  };

  const handleExcluirComentario = async (declaracao: DeclaracaoResumo, comentarioId: string) => {
    setComentariosMap((prev) => ({
      ...prev,
      [declaracao.id]: (prev[declaracao.id] || []).filter((c) => c.id !== comentarioId),
    }));
    
    enqueueSnackbar('Comentário excluído com sucesso', { variant: 'success' });
  };

  const getComentarios = (declaracao: DeclaracaoResumo): Comentario[] => {
    return comentariosMap[declaracao.id] || [];
  };

  const handleEditarStatus = async (declaracao: DeclaracaoResumo, status: ClientStatus) => {
    try {
      const clientCpf = declaracao.cpf.replace(/\D/g, '');
      if (!clientCpf || clientCpf.length < 11) {
        enqueueSnackbar('CPF inválido', { variant: 'error' });
        return;
      }

      await updateClient(clientCpf, { status });
      
      // Atualizar o mapa de clientes
      setClientsMap((prev) => {
        const client = prev[clientCpf];
        if (client) {
          return {
            ...prev,
            [clientCpf]: {
              ...client,
              status,
            },
          };
        }
        return prev;
      });

      // Atualizar também o status na lista de declarações (UI)
      setDeclaracoes((prev) =>
        prev.map((d) => {
          if (d.id === declaracao.id) {
            return {
              ...d,
              status: mapAPIStatusToUIStatus(status),
            };
          }
          return d;
        })
      );

      enqueueSnackbar('Status atualizado com sucesso', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao atualizar status';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw error;
    }
  };

  // Função para mapear status da UI para status da API
  const mapUIStatusToAPIStatus = (uiStatus: string): ClientStatus => {
    if (uiStatus === 'Em preenchimento') return 'Em Preenchimento';
    if (uiStatus === 'Aguardando conferência') return 'Em análise';
    if (uiStatus === 'Enviado à Receita' || uiStatus === 'Finalizado') return 'Aprovado';
    return 'Em Preenchimento'; // Default
  };

  // Função para mapear status da API para status da UI
  const mapAPIStatusToUIStatus = (apiStatus?: ClientStatus): 'Em preenchimento' | 'Aguardando conferência' | 'Enviado à Receita' | 'Finalizado' => {
    if (apiStatus === 'Em Preenchimento') return 'Em preenchimento';
    if (apiStatus === 'Em análise') return 'Aguardando conferência';
    if (apiStatus === 'Aprovado') return 'Finalizado';
    return 'Em preenchimento'; // Default
  };

  const getClienteStatus = (declaracao: DeclaracaoResumo): ClientStatus | undefined => {
    const clientCpf = declaracao.cpf.replace(/\D/g, '');
    const client = clientsMap[clientCpf];
    // Se o cliente tem status na API, usa ele. Caso contrário, mapeia o status da UI.
    if (client?.status) {
      return client.status;
    }
    // Fallback: mapeia o status da UI para o status da API
    return mapUIStatusToAPIStatus(declaracao.status);
  };

  const getClienteNome = (declaracao: DeclaracaoResumo): string | undefined => {
    const clientCpf = declaracao.cpf.replace(/\D/g, '');
    const client = clientsMap[clientCpf];
    return client?.name;
  };

  useEffect(() => {
    let isMounted = true; // Flag para evitar atualizações se o componente foi desmontado
    
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await listClientsByResponsible({
          page: 1,
          limit: 100, // Buscar muitos clientes para o dashboard
          anoExercicio: parseInt(selectedYear),
        });

        // Só atualiza o estado se o componente ainda estiver montado
        if (!isMounted) return;

        // Armazenar clientes em um mapa para acesso rápido
        const clientsMapData: Record<string, Client> = {};
        response.clients.forEach(client => {
          clientsMapData[client.id] = client;
        });
        setClientsMap(clientsMapData);

        const declaracoesData: DeclaracaoResumo[] = response.clients
          .filter(client => client.type === 'PF') // Apenas pessoas físicas por enquanto
          .map((client) => {
            // Mapear o status do backend para o formato esperado na UI
            let statusUI: 'Em preenchimento' | 'Aguardando conferência' | 'Enviado à Receita' | 'Finalizado';
            if (client.status === 'Em Preenchimento') {
              statusUI = 'Em preenchimento';
            } else if (client.status === 'Em análise') {
              statusUI = 'Aguardando conferência';
            } else if (client.status === 'Aprovado') {
              statusUI = 'Finalizado';
            } else {
              statusUI = 'Em preenchimento'; // Default
            }

            return {
              id: client.id,
              nome: client.name,
              cpf: client.documentFormatted || formatCPF(client.document),
              status: statusUI,
              ano: parseInt(selectedYear),
              resultado: 'A calcular',
              resultadoTipo: 'pagar' as const,
              dataEnvio: client.lastInvoiceDate 
                ? new Date(client.lastInvoiceDate).toLocaleDateString('pt-BR')
                : 'Não enviado',
              responsavel: client.email || 'Não atribuído',
              pendencias: '0 itens',
            };
          });

        setDeclaracoes(declaracoesData);
        
        if (declaracoesData.length > 0) {
          setComentariosMap((prev) => {
            const novo = { ...prev };
            if (declaracoesData[0]) {
              const primeiroId = declaracoesData[0].id;
              if (!novo[primeiroId] || novo[primeiroId].length === 0) {
                novo[primeiroId] = [...comentariosIniciais];
              }
            }
            declaracoesData.slice(1, 3).forEach((decl, index) => {
              if (!novo[decl.id] || novo[decl.id].length === 0) {
                novo[decl.id] = [
                  {
                    id: `mock-${decl.id}-1`,
                    texto: `Comentário para ${decl.nome}. Status atual: ${decl.status}`,
                    autorNome: 'Rafael Silva',
                    autorEmail: 'rafael.silva@exemplo.com',
                    data: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
                    createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
                  },
                ];
              }
            });
            return novo;
          });
        }

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
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <SummaryCardsGrid cards={cardsResumo} />

        <DeclaracoesTable
          declaracoes={declaracoes}
          onViewCliente={handleViewCliente}
          onEnviarDeclaracao={handleEnviarDeclaracao}
          onAdicionarComentario={handleAdicionarComentario}
          onEditarComentario={handleEditarComentario}
          onExcluirComentario={handleExcluirComentario}
          getComentarios={getComentarios}
          onEditarStatus={handleEditarStatus}
          getClienteStatus={getClienteStatus}
          getClienteNome={getClienteNome}
        />
      </Container>
    </Box>
  );
}
