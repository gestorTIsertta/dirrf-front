import { useState } from 'react';
import { Box, Card, Stack, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, IconButton, Tooltip } from '@mui/material';
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
import { ItemDeclarado, Banco } from 'src/types/declaracao';
import { formatDate, formatCurrency } from 'src/utils/format';

interface ItensTableProps {
  year: number;
  bancos: Banco[];
}

export function ItensTable({ year, bancos }: Readonly<ItensTableProps>) {
  const { itens, formData, setFormData, updateItem, deleteItem, prepareEditForm, resetForm } = useItens({ year });
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

  const handleSubmitEdit = async (itemAtualizado: ItemDeclarado) => {
    try {
      await updateItem(itemAtualizado);
      handleCloseEditModal();
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
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
        console.error('Erro ao deletar item:', err);
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

  const getDocumentosItem = () => {
    if (!itemSelecionado || !itemSelecionado.comprovante || !itemSelecionado.comprovanteFile) {
      return [];
    }
    return [
      {
        id: itemSelecionado.id.toString(),
        nome: itemSelecionado.comprovanteFile.name || `Comprovante - ${itemSelecionado.tipo}`,
        arquivo: itemSelecionado.comprovanteFile,
      },
    ];
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
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
            {itens.map((item) => (
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
                  {item.comprovante && item.comprovanteFile ? (
                    <Tooltip title="Visualizar documento">
                      <IconButton
                        size="small"
                        onClick={(e) => {
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
            ))}
          </TableBody>
        </Table>
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        mt={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
          Mostrando 6 de 18 itens
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            sx={{ bgcolor: COLORS.primary, minWidth: { xs: 28, sm: 32 }, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
          >
            1
          </Button>
          <Button size="small" variant="outlined" sx={{ minWidth: { xs: 28, sm: 32 }, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
            2
          </Button>
          <Button size="small" variant="outlined" sx={{ minWidth: { xs: 28, sm: 32 }, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
            3
          </Button>
        </Stack>
      </Stack>

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
}

