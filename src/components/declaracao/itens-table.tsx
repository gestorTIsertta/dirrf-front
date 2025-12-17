import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Card, Stack, Typography, TextField, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, IconButton, Tooltip, TablePagination } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify/iconify';
import { COLORS } from 'src/constants/declaracao';
import { ModalDeleteConfirm } from './modal-delete-confirm';
import { ModalEditItem } from './modal-edit-item';
import { ModalDocumentos } from './modal-documentos';
import { StatusChip } from './status-chip';
import { OperacaoChip } from './operacao-chip';
import { ActionButtons } from './action-buttons';
import { useItens } from 'src/hooks/use-itens';
import { useDeleteModal } from 'src/hooks/use-delete-modal';
import { usePagination, paginateItems } from 'src/utils/pagination';
import { handleError } from 'src/utils/error-handler';
import { ItemDeclarado, Banco } from 'src/types/declaracao';
import { formatDate, formatCurrency } from 'src/utils/format';
import { Loading } from 'src/components/loading/loading';

interface ItensTableProps {
  year: number;
  bancos: Banco[];
}

export interface ItensTableRef {
  reload: () => void;
}

export const ItensTable = forwardRef<ItensTableRef, ItensTableProps>(({ year, bancos }, ref) => {
  const { itens, formData, setFormData, loading, updateItem, deleteItem, prepareEditForm, resetForm, loadItens } = useItens({ year });
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination({ totalItems: itens.length });
  
  useImperativeHandle(ref, () => ({
    reload: () => {
      loadItens();
    },
  }));

  const { isOpen, itemToDelete, openModal, closeModal, confirmDelete } = useDeleteModal<ItemDeclarado>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemDeclarado | null>(null);
  const [modalDocumentosOpen, setModalDocumentosOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemDeclarado | null>(null);

  const handleOpenEditModal = (item: ItemDeclarado) => {
    setItemToEdit(item);
    prepareEditForm(item);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setItemToEdit(null);
    resetForm();
  };

  const handleSubmitEdit = async (itemAtualizado: ItemDeclarado, comprovantesParaDeletar?: string[], novosComprovantes?: File[]) => {
    try {
      await updateItem(itemAtualizado, comprovantesParaDeletar, novosComprovantes);
      handleCloseEditModal();
    } catch (err) {
      handleError(err, 'Erro ao atualizar item. Tente novamente.');
    }
  };

  const handleOpenDeleteModal = (item: ItemDeclarado) => {
    openModal(item);
  };

  const handleConfirmDelete = () => {
    confirmDelete(async (item) => {
      try {
        await deleteItem(item.id);
      } catch (err) {
        handleError(err, 'Erro ao deletar item. Tente novamente.');
      }
    });
  };

  const handleOpenDocumentos = (item: ItemDeclarado) => {
    setItemSelecionado(item);
    setModalDocumentosOpen(true);
  };

  const handleCloseDocumentos = () => {
    setModalDocumentosOpen(false);
    setItemSelecionado(null);
  };

  const paginatedItens = paginateItems(itens, page, rowsPerPage);

  const getDocumentosItem = () => {
    if (!itemSelecionado || !itemSelecionado.comprovante) {
      return [];
    }
    
    if (itemSelecionado.comprovantes && itemSelecionado.comprovantes.length > 0) {
      return itemSelecionado.comprovantes.map((comp, index) => ({
        id: `${itemSelecionado.id}-${index}`,
        nome: comp.fileName || `Comprovante - ${itemSelecionado.tipo}`,
        storagePath: comp.storagePath,
      }));
    }
    
    if (itemSelecionado.comprovanteFile) {
      return [
        {
          id: itemSelecionado.id.toString(),
          nome: itemSelecionado.comprovanteFile.name || `Comprovante - ${itemSelecionado.tipo}`,
          arquivo: itemSelecionado.comprovanteFile,
        },
      ];
    }
    
    return [];
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, position: 'relative' }}>
      {loading && itens.length > 0 && <Loading overlay />}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={2}
        spacing={2}
      >
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Resumo dos Itens Declarados
        </Typography>
        <TextField
          size="small"
          placeholder="Buscar itens..."
          disabled={loading}
          sx={{
            width: { xs: '100%', sm: 220, md: 260 },
            minWidth: { xs: '100%', sm: 220, md: 260 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: COLORS.grey600, fontSize: { xs: 18, sm: 20 } }} />
              </InputAdornment>
            ),
          }}
        />
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
                Categoria
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>Tipo</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                Operação
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>Data</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                Valor (R$)
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                Comprovante
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>Status</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && itens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Loading />
                </TableCell>
              </TableRow>
            ) : itens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color={COLORS.grey600}>
                    Nenhum item declarado. Use as categorias acima para adicionar itens.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItens.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {item.categoria}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {item.tipo}
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <OperacaoChip operacao={item.operacao} />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {formatDate(item.data)}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {formatCurrency(item.valor)}
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  {item.comprovante && ((item.comprovantes && item.comprovantes.length > 0) || item.comprovanteFile) ? (
                    <Tooltip title="Visualizar documentos">
                      <IconButton
                        size="small"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleOpenDocumentos(item);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <Iconify icon="solar:eye-bold" width={18} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Typography color={COLORS.primary} variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      Não anexado
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <StatusChip status={item.status} />
                </TableCell>
                <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <ActionButtons onEdit={() => handleOpenEditModal(item)} onDelete={() => handleOpenDeleteModal(item)} />
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </Box>
      
      {itens.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={itens.length}
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

      <ModalEditItem
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
        item={itemToEdit}
        formData={formData}
        onFormDataChange={setFormData}
        bancos={bancos}
      />

      <ModalDeleteConfirm
        open={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Item"
        message="Tem certeza que deseja excluir este item da declaração?"
        itemName={itemToDelete ? `${itemToDelete.categoria} - ${itemToDelete.tipo}` : undefined}
      />

      <ModalDocumentos
        open={modalDocumentosOpen}
        onClose={handleCloseDocumentos}
        documentos={getDocumentosItem()}
        titulo={`Comprovantes - ${itemSelecionado?.categoria || ''} - ${itemSelecionado?.tipo || ''}`}
      />
    </Card>
  );
});

ItensTable.displayName = 'ItensTable';

