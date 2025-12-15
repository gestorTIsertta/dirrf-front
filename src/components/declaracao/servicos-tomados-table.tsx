import { useState } from 'react';
import { Box, Card, Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ServicoTomado } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { ModalDeleteConfirm } from './modal-delete-confirm';
import { ModalServicoTomado } from './modal-servico-tomado';
import { ActionButtons } from './action-buttons';
import { useServicosTomados } from 'src/hooks/use-servicos-tomados';
import { useDeleteModal } from 'src/hooks/use-delete-modal';
import { formatCPFCNPJ, formatCurrency } from 'src/utils/format';
import { Loading } from 'src/components/loading/loading';

interface ServicosTomadosTableProps {
  year: number;
  servicosTomados?: ServicoTomado[];
  onServicosTomadosChange?: (servicosTomados: ServicoTomado[]) => void;
}

export function ServicosTomadosTable({ year, servicosTomados: servicosTomadosProp, onServicosTomadosChange }: Readonly<ServicosTomadosTableProps>) {
  const {
    servicosTomados,
    formData,
    setFormData,
    editingId,
    loading,
    addServicoTomado,
    updateServicoTomado,
    deleteServicoTomado,
    prepareEditForm,
    resetForm,
  } = useServicosTomados({ year, initialServicosTomados: servicosTomadosProp, onServicosTomadosChange });

  const { isOpen, itemToDelete, openModal, closeModal } = useDeleteModal<ServicoTomado>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (servicoTomado?: ServicoTomado) => {
    if (servicoTomado) {
      prepareEditForm(servicoTomado);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (servicoTomado: ServicoTomado) => {
    try {
      if (editingId) {
        await updateServicoTomado(editingId, servicoTomado);
      } else {
        await addServicoTomado(servicoTomado);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar serviço tomado:', error);
    }
  };

  const handleOpenDeleteModal = (servicoTomado: ServicoTomado) => {
    openModal(servicoTomado);
  };

  const handleConfirmDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteServicoTomado(itemToDelete.id);
      }
    } catch (error) {
      console.error('Erro ao deletar serviço tomado:', error);
    }
  };


  return (
    <>
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, position: 'relative' }}>
        {loading && servicosTomados.length > 0 && <Loading overlay />}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={2}
          spacing={2}
        >
          <Box sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Cadastro de Serviços Tomados
            </Typography>
            <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Cadastre os serviços tomados para dedução na declaração de imposto de renda.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            disabled={loading}
            sx={{
              bgcolor: COLORS.primary,
              '&:hover': { bgcolor: COLORS.primaryDark },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Adicionar Serviço
          </Button>
        </Stack>

        <Box
          sx={{
            overflowX: 'auto',
            width: '100%',
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': { bgcolor: COLORS.grey200, borderRadius: 1 },
          }}
        >
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Prestador
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  CPF/CNPJ
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Tipo de Serviço
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Valor Total
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Valor Reembolsado
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Valor Dedutível
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && servicosTomados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : servicosTomados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color={COLORS.grey600}>
                      Nenhum serviço cadastrado. Clique em &quot;Adicionar Serviço&quot; para começar.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                servicosTomados.map((servico) => {
                  const valorTotal = parseFloat(servico.valorTotal.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                  const valorReembolsado = parseFloat((servico.valorReembolsado || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                  const valorDedutivel = valorTotal - valorReembolsado;

                  return (
                    <TableRow key={servico.id} hover>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                        <Typography fontWeight={600}>{servico.nomePrestador}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                        {formatCPFCNPJ(servico.cpfCnpj)}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                        {servico.tipoServico}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                        {formatCurrency(servico.valorTotal)}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                        {servico.valorReembolsado ? formatCurrency(servico.valorReembolsado) : '-'}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                        <Typography fontWeight={600} color={COLORS.primary}>
                          {formatCurrency(valorDedutivel.toString())}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <ActionButtons onEdit={() => handleOpenModal(servico)} onDelete={() => handleOpenDeleteModal(servico)} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <ModalServicoTomado
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onFormDataChange={setFormData}
        editingId={editingId}
        loading={loading}
      />

      <ModalDeleteConfirm
        open={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Serviço"
        message="Tem certeza que deseja excluir este serviço tomado?"
        itemName={itemToDelete?.nomePrestador}
      />
    </>
  );
}

