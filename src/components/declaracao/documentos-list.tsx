import { forwardRef, useImperativeHandle } from 'react';
import { Box, Card, Stack, Typography, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { COLORS } from 'src/constants/declaracao';
import { ModalDeleteConfirm } from './modal-delete-confirm';
import { DocumentCard } from './document-card';
import { useDocumentos } from 'src/hooks/use-documentos';
import { useDeleteModal } from 'src/hooks/use-delete-modal';
import { Documento } from 'src/types/declaracao';
import { Loading } from 'src/components/loading/loading';

interface DocumentosListProps {
  year: number;
  onAnexarClick: () => void;
}

export interface DocumentosListRef {
  reload: () => void;
}

export const DocumentosList = forwardRef<DocumentosListRef, DocumentosListProps>(({ year, onAnexarClick }, ref) => {
  const { documentos, deleteDocumento, visualizarDocumento, loading, reload } = useDocumentos({ year });
  
  useImperativeHandle(ref, () => ({
    reload: () => {
      reload();
    },
  }));
  const { isOpen, itemToDelete, openModal, closeModal, confirmDelete } = useDeleteModal<Documento>();

  const handleDelete = (doc: Documento) => {
    openModal(doc);
  };

  const handleConfirmDelete = () => {
    confirmDelete((doc) => {
      deleteDocumento(doc.id);
    });
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, position: 'relative' }}>
      {loading && documentos.length > 0 && <Loading overlay />}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={2}
        spacing={2}
      >
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Informe de Renda
          </Typography>
          <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Envie os comprovantes de renda necessários para sua declaração.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={onAnexarClick}
          disabled={loading}
          sx={{
            bgcolor: COLORS.primary,
            '&:hover': { bgcolor: COLORS.primaryDark },
            px: { xs: 2, sm: 4 },
            py: 1.5,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Anexar Comprovante de Renda
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Anexar
          </Box>
        </Button>
      </Stack>

      {loading && documentos.length === 0 ? (
        <Box sx={{ py: 4 }}>
          <Loading />
        </Box>
      ) : (
        <Stack spacing={1}>
          {documentos.map((doc) => (
            <DocumentCard key={doc.id} documento={doc} onView={visualizarDocumento} onDelete={handleDelete} />
          ))}
        </Stack>
      )}

      <Box mt={2}>
        <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
          15 documentos enviados • 18,4 MB de espaço utilizado
        </Typography>
      </Box>

      <ModalDeleteConfirm
        open={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Documento"
        message="Tem certeza que deseja excluir este documento?"
        itemName={itemToDelete?.nome}
      />
    </Card>
  );
});

DocumentosList.displayName = 'DocumentosList';

