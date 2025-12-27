import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  Box,
  IconButton,
} from '@mui/material';
import { Lock as LockIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { COLORS } from 'src/constants/declaracao';
import type { Comentario } from 'src/types/backoffice';

interface ModalComentarioProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comentario: string) => Promise<void>;
  onEdit?: (id: string, comentario: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  comentarios?: Comentario[];
  loading?: boolean;
}

export function ModalComentario({
  open,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
  comentarios = [],
  loading = false,
}: Readonly<ModalComentarioProps>) {
  const [comentario, setComentario] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comentario.trim()) {
      return;
    }

    try {
      setLocalLoading(true);
      if (editingId && onEdit) {
        await onEdit(editingId, comentario);
        setEditingId(null);
      } else {
        await onSubmit(comentario);
      }
      setComentario('');
    } catch (error) {
      // Error submitting comment - ignore
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEdit = (coment: Comentario) => {
    if (!isOwner()) {
      return;
    }

    setComentario(coment.texto);
    setEditingId(coment.id);
    setTimeout(() => {
      const textField = document.querySelector(
        'textarea[placeholder*="anotação"]'
      ) as HTMLTextAreaElement;
      if (textField) {
        textField.focus();
        textField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setComentario('');
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (onDelete && window.confirm('Tem certeza que deseja excluir este comentário?')) {
      try {
        await onDelete(id);
      } catch (error) {
        // Error deleting comment - ignore
      }
    }
  };

  const handleClose = () => {
    if (!localLoading) {
      setComentario('');
      setEditingId(null);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOwner = () => !!(onEdit || onDelete);

  const isLoading = loading || localLoading;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Box component="span" sx={{ fontWeight: 700, fontSize: '1.25rem', display: 'block' }}>
          Adicionar anotação interna
        </Box>
        <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 0.5, fontWeight: 400 }}>
          Digite sua anotação aqui...
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              {editingId ? 'Editar anotação' : 'Adicionar anotação interna'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Digite sua anotação aqui..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
            {editingId && (
              <Button size="small" onClick={handleCancelEdit} sx={{ mt: 1 }} variant="text">
                Cancelar edição
              </Button>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : comentarios.length > 0 ? (
            <Box>
              <Typography variant="body2" fontWeight={600} mb={2}>
                Comentários anteriores
              </Typography>
              <Stack spacing={1.5}>
                {comentarios.map((coment) => (
                  <Card
                    key={coment.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: isOwner() ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      position: 'relative',
                      '&:hover': isOwner()
                        ? {
                            bgcolor: COLORS.grey100,
                            borderColor: COLORS.primary,
                            boxShadow: 1,
                          }
                        : {},
                    }}
                    onClick={() => {
                      if (isOwner() && !editingId && onEdit) {
                        handleEdit(coment);
                      }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight={600}>
                            {coment.autorNome}
                          </Typography>
                          <Typography variant="caption" color={COLORS.grey600}>
                            {formatDate(coment.data || coment.createdAt)}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color={COLORS.grey800}>
                          {coment.texto}
                        </Typography>
                      </Box>
                      {isOwner() && onDelete ? (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(coment.id);
                          }}
                          sx={{
                            color: COLORS.primary,
                            ml: 1,
                            '&:hover': {
                              bgcolor: `${COLORS.primary}15`,
                            },
                          }}
                          title="Excluir comentário"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Box sx={{ width: 40 }} />
                      )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!comentario.trim() || isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <LockIcon />
          }
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          {isLoading ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar anotação'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
