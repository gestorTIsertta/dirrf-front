import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useRouter, useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getClient } from 'src/api/requests/backoffice-clients';
import { updateDeclarationStatus } from 'src/api/requests/declarations';
import { enqueueSnackbar } from 'notistack';
import { useContadorContext } from 'src/hooks/use-contador-context';
import { PageHeader, InfoCard, InfoField, InstructionCard, StatusSelect } from 'src/components/contador';
import { COLORS } from 'src/constants/declaracao';
import type { DeclarationStatus } from 'src/types/backoffice';

const COLORS_LOCAL = {
  primary: '#2563EB',
  grey100: '#F9FAFB',
  grey600: '#4B5563',
};

export default function ClienteDetalhesView() {
  const router = useRouter();
  const { clientId } = useParams<{ clientId: string }>();
  const { setSelectedClientCpf } = useContadorContext();
  const [clienteNome, setClienteNome] = useState('');
  const [clienteCpf, setClienteCpf] = useState('');
  const [clienteCpfSemFormatacao, setClienteCpfSemFormatacao] = useState('');
  const [clienteStatus, setClienteStatus] = useState<DeclarationStatus | undefined>(undefined);
  const [selectedYear] = useState(2024);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!clientId) {
      enqueueSnackbar('ID do cliente não encontrado', { variant: 'error' });
      router.push(paths.contador.dashboard);
      return;
    }

    const fetchCliente = async () => {
      try {
        setLoading(true);
        const client = await getClient(clientId);
        setClienteNome(client.name);
        setClienteCpf(client.documentFormatted || client.document);
        setClienteCpfSemFormatacao(client.document);
        setClienteStatus(client.declaracao?.status || 'pendente');
        
        setSelectedClientCpf(client.document);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
        if (axiosError?.response?.status === 401) {
          enqueueSnackbar('Erro de autenticação. Por favor, faça login novamente.', { variant: 'error' });
          setTimeout(() => {
            router.push(paths.contador.login);
          }, 2000);
        } else if (axiosError?.response?.status === 403) {
          enqueueSnackbar('Acesso negado. Verifique suas permissões.', { variant: 'error' });
          router.push(paths.contador.dashboard);
        } else {
          const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao carregar dados do cliente';
          enqueueSnackbar(errorMessage, { variant: 'error' });
          router.push(paths.contador.dashboard);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [clientId, router, setSelectedClientCpf]);

  const handleVerDeclaracao = () => {
    if (!clienteCpfSemFormatacao) {
      enqueueSnackbar('CPF do cliente não disponível', { variant: 'error' });
      return;
    }
    
    router.push(`${paths.declaracao}?cpf=${clienteCpfSemFormatacao}`);
  };

  const handleStatusChange = async (newStatus: DeclarationStatus) => {
    if (!clientId) {
      enqueueSnackbar('ID do cliente não encontrado', { variant: 'error' });
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await updateDeclarationStatus(selectedYear, newStatus, clientId);
      setClienteStatus(response.declaration.status);
      enqueueSnackbar('Status atualizado com sucesso', { variant: 'success' });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao atualizar status';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: COLORS_LOCAL.grey100, 
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
    <Box sx={{ bgcolor: COLORS_LOCAL.grey100, minHeight: '100vh', py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <PageHeader
          title={clienteNome}
          subtitle={`CPF: ${clienteCpf} | Ano-calendário: 2024`}
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => router.push(paths.contador.dashboard) },
            { label: clienteNome },
          ]}
          onBack={() => router.push(paths.contador.dashboard)}
          actionButton={{
            label: 'Ver Declaração Completa',
            onClick: handleVerDeclaracao,
          }}
        />

        <InfoCard title="Informações do Cliente">
          <InfoField label="Nome Completo" value={clienteNome} />
          <InfoField label="CPF" value={clienteCpf} />
          <Box>
            <Typography 
              variant="body2" 
              color={COLORS.grey600}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 1 }}
            >
              Status
            </Typography>
            <StatusSelect
              value={clienteStatus}
              onChange={handleStatusChange}
              disabled={updatingStatus}
              size="medium"
            />
          </Box>
        </InfoCard>

        <InstructionCard>
          <strong>Como funciona:</strong> Ao clicar em &quot;Ver Declaração Completa&quot;, você será redirecionado para a página de declaração do cliente. 
          Todas as APIs serão chamadas com o CPF do cliente na query string (<code>?cpf=...</code>), permitindo que você visualize e edite 
          a declaração do cliente mesmo estando logado como contador.
        </InstructionCard>
      </Container>
    </Box>
  );
}
