import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';
import { COLORS } from 'src/constants/declaracao';

interface ModalDeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export function ModalDeleteConfirm({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  message = 'Tem certeza que deseja excluir este item?',
  itemName,
}: ModalDeleteConfirmProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
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
          {title}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" color={COLORS.grey800}>
          {message}
        </Typography>
        {itemName && (
          <Typography variant="body2" color={COLORS.grey600} sx={{ mt: 1, fontWeight: 600 }}>
            {itemName}
          </Typography>
        )}
        <Typography variant="body2" color={COLORS.error} sx={{ mt: 2 }}>
          Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            bgcolor: COLORS.error,
            '&:hover': { bgcolor: '#D32F2F' },
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

