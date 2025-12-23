import React, { useState, useEffect, useCallback } from 'react';
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
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import type { DeclaracaoResumo, Comentario, DeclarationStatus } from 'src/types/backoffice';
import { listClientsByResponsible, type Client } from 'src/api/requests/backoffice-clients';
import { updateDeclarationStatus } from 'src/api/requests/declarations';
import { listNotes, createNote, updateNote, deleteNote } from 'src/api/requests/notes';
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
      label: 'pendente', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#FEF3C7',
      icon: AccessTimeIcon,
      iconColor: '#F59E0B',
    },
    { 
      label: 'em_analise', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#FFEDD5',
      icon: WarningIcon,
      iconColor: '#F59E0B',
    },
    { 
      label: 'aprovada', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#DCFCE7',
      icon: CheckCircleOutlineIcon,
      iconColor: '#16A34A',
    },
    { 
      label: 'rejeitada', 
      valor: 0, 
      diff: '0% do total', 
      cor: '#FEE2E2',
      icon: WarningIcon,
      iconColor: '#DC2626',
    },
    { 
      label: 'concluida', 
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

  const [comentariosMap, setComentariosMap] = useState<Record<string, Comentario[]>>({});
  const [loadingComentarios, setLoadingComentarios] = useState<Record<string, boolean>>({});

  // Carregar comentários da API quando necessário (chamado quando o modal abre)
  const loadComentarios = useCallback(async (declaracao: DeclaracaoResumo): Promise<void> => {
    const clientCpf = declaracao.cpf.replace(/\D/g, '');
    if (!clientCpf || clientCpf.length < 11) {
      return;
    }

    setLoadingComentarios((prev) => ({ ...prev, [declaracao.id]: true }));

    try {
      const year = parseInt(selectedYear);
      const notes = await listNotes(year, clientCpf);
      
      // Converter notas da API para o formato de Comentario
      const comentarios: Comentario[] = notes.map((note) => ({
        id: note.id,
        texto: note.anotacoes,
        autorNome: note.createdByEmail?.split('@')[0] || 'Usuário',
        autorEmail: note.createdByEmail,
        data: note.createdAt,
        createdAt: note.createdAt,
      }));

      setComentariosMap((prev) => ({
        ...prev,
        [declaracao.id]: comentarios,
      }));
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao carregar comentários';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoadingComentarios((prev) => ({ ...prev, [declaracao.id]: false }));
    }
  }, [selectedYear]);

  const handleAdicionarComentario = async (declaracao: DeclaracaoResumo, comentario: string) => {
    try {
      const clientCpf = declaracao.cpf.replace(/\D/g, '');
      if (!clientCpf || clientCpf.length < 11) {
        enqueueSnackbar('CPF inválido', { variant: 'error' });
        return;
      }

      const year = parseInt(selectedYear);
      await createNote(year, { anotacoes: comentario }, clientCpf);
      
      // Recarregar comentários do backend após criar
      await loadComentarios(declaracao);
      
      enqueueSnackbar('Comentário adicionado com sucesso', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao adicionar comentário';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleEditarComentario = async (declaracao: DeclaracaoResumo, comentarioId: string, comentario: string) => {
    try {
      const clientCpf = declaracao.cpf.replace(/\D/g, '');
      if (!clientCpf || clientCpf.length < 11) {
        enqueueSnackbar('CPF inválido', { variant: 'error' });
        return;
      }

      const year = parseInt(selectedYear);
      await updateNote(year, comentarioId, { anotacoes: comentario }, clientCpf);
      
      // Recarregar comentários do backend após editar
      await loadComentarios(declaracao);
      
      enqueueSnackbar('Comentário editado com sucesso', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao editar comentário';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleExcluirComentario = async (declaracao: DeclaracaoResumo, comentarioId: string) => {
    try {
      const clientCpf = declaracao.cpf.replace(/\D/g, '');
      if (!clientCpf || clientCpf.length < 11) {
        enqueueSnackbar('CPF inválido', { variant: 'error' });
        return;
      }

      const year = parseInt(selectedYear);
      await deleteNote(year, comentarioId, clientCpf);
      
      // Recarregar comentários do backend após deletar
      await loadComentarios(declaracao);
      
      enqueueSnackbar('Comentário excluído com sucesso', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao excluir comentário';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const getComentarios = (declaracao: DeclaracaoResumo): Comentario[] => {
    return comentariosMap[declaracao.id] || [];
  };

  const getLoadingComentarios = (declaracao: DeclaracaoResumo): boolean => {
    return loadingComentarios[declaracao.id] || false;
  };

  const handleEditarStatus = async (declaracao: DeclaracaoResumo, status: DeclarationStatus) => {
    try {
      const clientCpf = declaracao.cpf.replace(/\D/g, '');
      if (!clientCpf || clientCpf.length < 11) {
        enqueueSnackbar('CPF inválido', { variant: 'error' });
        return;
      }

      const year = parseInt(selectedYear);
      // Usar a API de declarações para atualizar o status
      const response = await updateDeclarationStatus(year, status, clientCpf);
      
      // Atualizar o mapa de clientes com o status da declaração atualizado
      setClientsMap((prev) => {
        const client = prev[clientCpf];
        if (client) {
          return {
            ...prev,
            [clientCpf]: {
              ...client,
              declaracao: {
                anoExercicio: response.declaration.anoExercicio,
                status: response.declaration.status,
                createdAt: response.declaration.createdAt,
                updatedAt: response.declaration.updatedAt,
              },
            },
          };
        }
        return prev;
      });

      // Recarregar a lista do backend para garantir dados atualizados
      const refreshResponse = await listClientsByResponsible({
        page: 1,
        limit: 100,
        anoExercicio: parseInt(selectedYear),
      });

      // Atualizar o mapa de clientes
      const refreshedClientsMap: Record<string, Client> = {};
      refreshResponse.clients.forEach(client => {
        refreshedClientsMap[client.id] = client;
      });
      setClientsMap(refreshedClientsMap);

      // Atualizar a lista de declarações com dados do backend
      const refreshedDeclaracoesData: DeclaracaoResumo[] = refreshResponse.clients
        .filter(client => client.type === 'PF')
        .map((client) => {
          const status: DeclarationStatus = client.declaracao?.status || 'pendente';
          return {
            id: client.id,
            nome: client.name,
            cpf: client.documentFormatted || formatCPF(client.document),
            status,
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

      setDeclaracoes(refreshedDeclaracoesData);

      // Atualizar cards de resumo
      const refreshedTotal = refreshedDeclaracoesData.length;
      const refreshedPendente = refreshedDeclaracoesData.filter(d => d.status === 'pendente').length;
      const refreshedEmAnalise = refreshedDeclaracoesData.filter(d => d.status === 'em_analise').length;
      const refreshedAprovada = refreshedDeclaracoesData.filter(d => d.status === 'aprovada').length;
      const refreshedRejeitada = refreshedDeclaracoesData.filter(d => d.status === 'rejeitada').length;
      const refreshedConcluida = refreshedDeclaracoesData.filter(d => d.status === 'concluida').length;

      setCardsResumo([
        { 
          label: 'Total de declarações', 
          valor: refreshedTotal, 
          diff: `${refreshedTotal} declarações`, 
          cor: '#EEF2FF',
          icon: DescriptionIcon,
          iconColor: '#2563EB',
        },
        { 
          label: 'pendente', 
          valor: refreshedPendente, 
          diff: refreshedTotal > 0 ? `${Math.round((refreshedPendente / refreshedTotal) * 100)}% do total` : '0% do total', 
          cor: '#FEF3C7',
          icon: AccessTimeIcon,
          iconColor: '#F59E0B',
        },
        { 
          label: 'em_analise', 
          valor: refreshedEmAnalise, 
          diff: refreshedTotal > 0 ? `${Math.round((refreshedEmAnalise / refreshedTotal) * 100)}% do total` : '0% do total', 
          cor: '#FFEDD5',
          icon: WarningIcon,
          iconColor: '#F59E0B',
        },
        { 
          label: 'aprovada', 
          valor: refreshedAprovada, 
          diff: refreshedTotal > 0 ? `${Math.round((refreshedAprovada / refreshedTotal) * 100)}% do total` : '0% do total', 
          cor: '#DCFCE7',
          icon: CheckCircleOutlineIcon,
          iconColor: '#16A34A',
        },
        { 
          label: 'rejeitada', 
          valor: refreshedRejeitada, 
          diff: refreshedTotal > 0 ? `${Math.round((refreshedRejeitada / refreshedTotal) * 100)}% do total` : '0% do total', 
          cor: '#FEE2E2',
          icon: WarningIcon,
          iconColor: '#DC2626',
        },
        { 
          label: 'concluida', 
          valor: refreshedConcluida, 
          diff: refreshedTotal > 0 ? `${Math.round((refreshedConcluida / refreshedTotal) * 100)}% do total` : '0% do total', 
          cor: '#DCFCE7',
          icon: CheckCircleOutlineIcon,
          iconColor: '#16A34A',
        },
      ]);

      enqueueSnackbar('Status atualizado com sucesso', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao atualizar status';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw error;
    }
  };

  const getClienteStatus = (declaracao: DeclaracaoResumo): DeclarationStatus | undefined => {
    const clientCpf = declaracao.cpf.replace(/\D/g, '');
    const client = clientsMap[clientCpf];
    
    // Retornar status da declaração se disponível
    if (client?.declaracao?.status) {
      return client.declaracao.status;
    }
    
    // Fallback: usar status da declaração na lista
    return declaracao.status;
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
            // Usar status da declaração diretamente do backend
            const status: DeclarationStatus = client.declaracao?.status || 'pendente';
            
          

            return {
              id: client.id,
              nome: client.name,
              cpf: client.documentFormatted || formatCPF(client.document),
              status,
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

        const total = declaracoesData.length;
        const pendente = declaracoesData.filter(d => d.status === 'pendente').length;
        const emAnalise = declaracoesData.filter(d => d.status === 'em_analise').length;
        const aprovada = declaracoesData.filter(d => d.status === 'aprovada').length;
        const rejeitada = declaracoesData.filter(d => d.status === 'rejeitada').length;
        const concluida = declaracoesData.filter(d => d.status === 'concluida').length;

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
            label: 'pendente', 
            valor: pendente, 
            diff: total > 0 ? `${Math.round((pendente / total) * 100)}% do total` : '0% do total', 
            cor: '#FEF3C7',
            icon: AccessTimeIcon,
            iconColor: '#F59E0B',
          },
          { 
            label: 'em_analise', 
            valor: emAnalise, 
            diff: total > 0 ? `${Math.round((emAnalise / total) * 100)}% do total` : '0% do total', 
            cor: '#FFEDD5',
            icon: WarningIcon,
            iconColor: '#F59E0B',
          },
          { 
            label: 'aprovada', 
            valor: aprovada, 
            diff: total > 0 ? `${Math.round((aprovada / total) * 100)}% do total` : '0% do total', 
            cor: '#DCFCE7',
            icon: CheckCircleOutlineIcon,
            iconColor: '#16A34A',
          },
          { 
            label: 'rejeitada', 
            valor: rejeitada, 
            diff: total > 0 ? `${Math.round((rejeitada / total) * 100)}% do total` : '0% do total', 
            cor: '#FEE2E2',
            icon: WarningIcon,
            iconColor: '#DC2626',
          },
          { 
            label: 'concluida', 
            valor: concluida, 
            diff: total > 0 ? `${Math.round((concluida / total) * 100)}% do total` : '0% do total', 
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
          onLoadComentarios={loadComentarios}
          getLoadingComentarios={getLoadingComentarios}
          onEditarStatus={handleEditarStatus}
          getClienteStatus={getClienteStatus}
          getClienteNome={getClienteNome}
        />
      </Container>
    </Box>
  );
}
