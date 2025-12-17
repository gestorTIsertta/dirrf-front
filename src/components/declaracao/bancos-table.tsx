import { useState } from 'react';
import { Box, Card, Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, TablePagination } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify/iconify';
import { Banco } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { getBancoByCompe, getCodigoCompeByNome, getBancoImagem } from 'src/constants/bancos';
import { ModalDeleteConfirm } from './modal-delete-confirm';
import { ModalBanco } from './modal-banco';
import { ModalDocumentos } from './modal-documentos';
import { ActionButtons } from './action-buttons';
import { useBancos } from 'src/hooks/use-bancos';
import { useDeleteModal } from 'src/hooks/use-delete-modal';
import { usePagination, paginateItems } from 'src/utils/pagination';
import { handleError } from 'src/utils/error-handler';
import { formatDate } from 'src/utils/format';
import { Loading } from 'src/components/loading/loading';

interface BancosTableProps {
  year: number;
  bancos?: Banco[];
  onBancosChange?: (bancos: Banco[]) => void;
}

export function BancosTable({ year, bancos: bancosProp, onBancosChange }: Readonly<BancosTableProps>) {
  const {
    bancos,
    formData,
    setFormData,
    editingId,
    fileInputRef,
    loading,
    addBanco,
    updateBanco,
    deleteBanco,
    prepareEditForm,
    resetForm,
  } = useBancos({ year, initialBancos: bancosProp, onBancosChange });

  const { isOpen, itemToDelete, openModal, closeModal, confirmDelete } = useDeleteModal<Banco>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDocumentosOpen, setModalDocumentosOpen] = useState(false);
  const [bancoSelecionado, setBancoSelecionado] = useState<Banco | null>(null);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination({ totalItems: bancos.length });

  const handleOpenModal = async (banco?: Banco) => {
    if (banco) {
      await prepareEditForm(banco);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (banco: Banco) => {
    try {
      if (editingId) {
        await updateBanco(editingId, banco);
      } else {
        await addBanco(banco);
      }
      handleCloseModal();
    } catch (err) {
      handleError(err, 'Erro ao salvar banco. Tente novamente.');
    }
  };

  const handleOpenDeleteModal = (banco: Banco) => {
    openModal(banco);
  };

  const handleConfirmDelete = () => {
    confirmDelete(async (banco) => {
      try {
        await deleteBanco(banco.id);
      } catch (err) {
        handleError(err, 'Erro ao deletar banco. Tente novamente.');
      }
    });
  };

  const handleOpenDocumentos = (banco: Banco) => {
    setBancoSelecionado(banco);
    setModalDocumentosOpen(true);
  };

  const handleCloseDocumentos = () => {
    setModalDocumentosOpen(false);
    setBancoSelecionado(null);
  };

  const paginatedBancos = paginateItems(bancos, page, rowsPerPage);

  const getDocumentosBanco = () => {
    if (!bancoSelecionado) {
      return [];
    }
    
    if (bancoSelecionado.informeRendimentos) {
      return [
        {
          id: bancoSelecionado.id,
          nome: bancoSelecionado.informeRendimentos.name || 'Informe de Rendimentos',
          arquivo: bancoSelecionado.informeRendimentos,
        },
      ];
    }
    
    if (bancoSelecionado.informeRendimentoMetadata) {
      return [
        {
          id: bancoSelecionado.id,
          nome: bancoSelecionado.informeRendimentoMetadata.fileName || 'Informe de Rendimentos',
          storagePath: bancoSelecionado.informeRendimentoMetadata.storagePath,
        },
      ];
    }
    
    return [];
  };

  return (
    <>
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, position: 'relative' }}>
        {loading && bancos.length > 0 && <Loading overlay />}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={2}
          spacing={2}
        >
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Bancos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            disabled={loading}
            sx={{
              bgcolor: COLORS.primary,
              '&:hover': { bgcolor: COLORS.primaryDark },
            }}
          >
            Cadastrar Banco
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
                  Banco
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Conta
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Agência
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Tipo
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Data de Abertura
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Informe de Rendimentos
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && bancos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : bancos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color={COLORS.grey600}>
                      Nenhum banco cadastrado. Clique em &quot;Cadastrar Banco&quot; para começar.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBancos.map((banco) => {
                let codigoCompe = banco.codigoCompe;
                if (!codigoCompe && banco.nome) {
                  codigoCompe = getCodigoCompeByNome(banco.nome) || undefined;
                }

                const bancoInfo = codigoCompe ? getBancoByCompe(codigoCompe) : null;
                const imagemBanco = getBancoImagem(codigoCompe || null);
                return (
                  <TableRow key={banco.id} hover>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                          component="img"
                          src={imagemBanco || ''}
                          alt={banco.nome}
                          sx={{
                            width: { xs: 24, sm: 28 },
                            height: { xs: 24, sm: 28 },
                            objectFit: 'contain',
                            flexShrink: 0,
                          }}
                        />
                        <Box>
                          <Typography 
                            fontWeight={600} 
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              textTransform: 'uppercase',
                              letterSpacing: '0.01em',
                            }}
                          >
                            {banco.nome.toUpperCase()}
                          </Typography>
                          {bancoInfo && (
                            <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                              Código: {bancoInfo.COMPE}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {banco.conta}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {banco.agencia}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {banco.tipo}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                      {formatDate(banco.dataAbertura)}
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      {(banco.informeRendimentos || banco.informeRendimentoMetadata) ? (
                        <Tooltip title="Visualizar documento">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDocumentos(banco);
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
                    <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <ActionButtons onEdit={() => handleOpenModal(banco)} onDelete={() => handleOpenDeleteModal(banco)} />
                    </TableCell>
                  </TableRow>
                );
              })
              )}
            </TableBody>
          </Table>
        </Box>
        
        {bancos.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={bancos.length}
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

      <ModalBanco
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onFormDataChange={setFormData}
        editingId={editingId}
        fileInputRef={fileInputRef}
        loading={loading}
      />

      <ModalDeleteConfirm
        open={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Banco"
        message="Tem certeza que deseja excluir este banco?"
        itemName={itemToDelete?.nome}
      />

      <ModalDocumentos
        open={modalDocumentosOpen}
        onClose={handleCloseDocumentos}
        documentos={getDocumentosBanco()}
        titulo={`Informe de Rendimentos - ${bancoSelecionado?.nome || ''}`}
      />
    </>
  );
}
