import { useState } from 'react';
import { Box, Card, Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Dependente } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { ModalDeleteConfirm } from './modal-delete-confirm';
import { ModalDependente } from './modal-dependente';
import { ActionButtons } from './action-buttons';
import { useDependentes } from 'src/hooks/use-dependentes';
import { useDeleteModal } from 'src/hooks/use-delete-modal';
import { usePagination, paginateItems } from 'src/utils/pagination';
import { handleError } from 'src/utils/error-handler';
import { formatCPF, formatDate } from 'src/utils/format';
import { Loading } from 'src/components/loading/loading';

interface DependentesTableProps {
  year: number;
  dependentes?: Dependente[];
  onDependentesChange?: (dependentes: Dependente[]) => void;
}

export function DependentesTable({ year, dependentes: dependentesProp, onDependentesChange }: Readonly<DependentesTableProps>) {
  const {
    dependentes,
    formData,
    setFormData,
    editingId,
    loading,
    addDependente,
    updateDependente,
    deleteDependente,
    prepareEditForm,
    resetForm,
  } = useDependentes({ year, initialDependentes: dependentesProp, onDependentesChange });

  const { isOpen, itemToDelete, openModal, closeModal } = useDeleteModal<Dependente>();
  const [modalOpen, setModalOpen] = useState(false);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination({ totalItems: dependentes.length });

  const handleOpenModal = (dependente?: Dependente) => {
    if (dependente) {
      prepareEditForm(dependente);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const paginatedDependentes = paginateItems(dependentes, page, rowsPerPage);

  const handleSubmit = async (dependente: Dependente) => {
    try {
      if (editingId) {
        await updateDependente(editingId, dependente);
      } else {
        await addDependente(dependente);
      }
      handleCloseModal();
    } catch (error) {
      handleError(error, 'Erro ao salvar dependente. Tente novamente.');
    }
  };

  const handleOpenDeleteModal = (dependente: Dependente) => {
    openModal(dependente);
  };

  const handleConfirmDelete = async () => {
    try {
      if (itemToDelete) {
        await deleteDependente(itemToDelete.id);
      }
    } catch (error) {
      handleError(error, 'Erro ao deletar dependente. Tente novamente.');
    }
  };


  return (
    <>
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, position: 'relative' }}>
        {loading && dependentes.length > 0 && <Loading overlay />}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={2}
          spacing={2}
        >
          <Box sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Ficha de Dependentes
            </Typography>
            <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Cadastre os dependentes para incluir na declaração de imposto de renda.
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
            Adicionar Dependente
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
                  Nome Completo
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  CPF
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Data de Nascimento
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Grau de Parentesco
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Nome da Mãe
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Nacionalidade
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Sexo
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && dependentes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : dependentes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color={COLORS.grey600}>
                      Nenhum dependente cadastrado. Clique em &quot;Adicionar Dependente&quot; para começar.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDependentes.map((dependente) => (
                  <TableRow key={dependente.id} hover>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      <Typography fontWeight={600}>{dependente.nomeCompleto}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {formatCPF(dependente.cpf)}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {formatDate(dependente.dataNascimento)}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {dependente.grauParentesco}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {dependente.nomeMae || '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {dependente.nacionalidade || '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {dependente.sexo || '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <ActionButtons onEdit={() => handleOpenModal(dependente)} onDelete={() => handleOpenDeleteModal(dependente)} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        
        {dependentes.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={dependentes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              '& .MuiTablePagination-toolbar': {
                flexWrap: 'wrap',
                px: { xs: 1, sm: 2 },
                justifyContent: 'flex-end',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: { xs: 1, sm: 0 },
              },
              '& .MuiTablePagination-select': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
          />
        )}
      </Card>

      <ModalDependente
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
        title="Confirmar Exclusão de Dependente"
        message="Tem certeza que deseja excluir este dependente?"
        itemName={itemToDelete?.nomeCompleto}
      />
    </>
  );
}

