import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
  Typography,
  Box,
  Card,
  Button,
} from '@mui/material';
import { Description as DescriptionIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { COLORS } from 'src/constants/declaracao';

interface DocumentoAnexado {
  id: string;
  nome: string;
  arquivo?: File | string;
  storagePath?: string;
}

interface ModalDocumentosProps {
  open: boolean;
  onClose: () => void;
  documentos: DocumentoAnexado[];
  titulo?: string;
}

export function ModalDocumentos({ open, onClose, documentos, titulo = 'Documentos Anexados' }: Readonly<ModalDocumentosProps>) {
  const handleOpenDocument = async (documento: DocumentoAnexado) => {
    if (documento.storagePath) {
      try {
        const { getDocument, base64ToBlob } = await import('src/api/requests/documents');
        const documentData = await getDocument(documento.storagePath);
        
        const blob = base64ToBlob(documentData.base64, documentData.mimeType);
        const blobUrl = URL.createObjectURL(blob);
        
        const newWindow = window.open(blobUrl, '_blank');
        
        setTimeout(() => {
          if (newWindow) {
            URL.revokeObjectURL(blobUrl);
          } else {
            URL.revokeObjectURL(blobUrl);
          }
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar documento:', error);
        alert('Erro ao carregar o documento. Tente novamente.');
      }
      return;
    }
    
    if (documento.arquivo) {
      if (typeof documento.arquivo === 'string') {
        window.open(documento.arquivo, '_blank');
      } else {
        const url = URL.createObjectURL(documento.arquivo);
        const newWindow = window.open(url, '_blank');
        setTimeout(() => {
          if (newWindow) {
            URL.revokeObjectURL(url);
          } else {
            URL.revokeObjectURL(url);
          }
        }, 1000);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          {titulo}
        </Typography>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5 }}>
          {documentos.length === 0 ? 'Nenhum documento anexado' : `${documentos.length} documento(s) anexado(s)`}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        {documentos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color={COLORS.grey600}>
              Nenhum documento foi anexado ainda.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {documentos.map((documento) => (
              <Card
                key={documento.id}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: COLORS.grey100,
                    borderColor: COLORS.primary,
                  },
                  border: `1px solid ${COLORS.grey200}`,
                }}
                onClick={() => handleOpenDocument(documento)}
              >
                <DescriptionIcon sx={{ color: COLORS.primary, fontSize: 32 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    {documento.nome}
                  </Typography>
                  <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Clique para abrir em nova aba
                  </Typography>
                </Box>
                <OpenInNewIcon sx={{ color: COLORS.grey600, fontSize: 20 }} />
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
      <Divider />
      <Box sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}>
          Fechar
        </Button>
      </Box>
    </Dialog>
  );
}

