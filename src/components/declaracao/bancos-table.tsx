import { useState } from 'react';
import { Box, Card, Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add as AddIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Banco } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { getBancoByCompe, getCodigoCompeByNome, getBancoImagem } from 'src/constants/bancos';
import { ModalDeleteConfirm } from './modal-delete-confirm';
import { ModalBanco } from './modal-banco';
import { ActionButtons } from './action-buttons';
import { useBancos } from 'src/hooks/use-bancos';
import { useDeleteModal } from 'src/hooks/use-delete-modal';

interface BancosTableProps {
  bancos?: Banco[];
  onBancosChange?: (bancos: Banco[]) => void;
}

export function BancosTable({ bancos: bancosProp, onBancosChange }: BancosTableProps) {
  const {
    bancos,
    formData,
    setFormData,
    editingId,
    fileInputRef,
    updateBancos,
    addBanco,
    updateBanco,
    deleteBanco,
    prepareEditForm,
    resetForm,
  } = useBancos({ initialBancos: bancosProp, onBancosChange });

  const { isOpen, itemToDelete, openModal, closeModal, confirmDelete } = useDeleteModal<Banco>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (banco?: Banco) => {
    if (banco) {
      prepareEditForm(banco);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = (banco: Banco) => {
    if (editingId) {
      updateBanco(editingId, banco);
      const updatedBancos = bancos.map((b) => (b.id === editingId ? banco : b));
      updateBancos(updatedBancos);
    } else {
      addBanco(banco);
      updateBancos([...bancos, banco]);
    }
    handleCloseModal();
  };

  const handleOpenDeleteModal = (banco: Banco) => {
    openModal(banco);
  };

  const handleConfirmDelete = () => {
    confirmDelete((banco) => {
      deleteBanco(banco.id);
      const updatedBancos = bancos.filter((b) => b.id !== banco.id);
      updateBancos(updatedBancos);
    });
  };

  return (
    <>
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
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
              {bancos.map((banco) => {
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
                      {banco.dataAbertura}
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      {banco.informeRendimentos ? (
                        <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: COLORS.success }} />
                      ) : (
                        <Typography color={COLORS.error} variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          Não anexado
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <ActionButtons onEdit={() => handleOpenModal(banco)} onDelete={() => handleOpenDeleteModal(banco)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <ModalBanco
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onFormDataChange={setFormData}
        editingId={editingId}
        fileInputRef={fileInputRef}
      />

      <ModalDeleteConfirm
        open={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Banco"
        message="Tem certeza que deseja excluir este banco?"
        itemName={itemToDelete?.nome}
      />
    </>
  );
}
