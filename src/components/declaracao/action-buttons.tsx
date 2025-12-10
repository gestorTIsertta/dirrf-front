import { IconButton, Tooltip, Stack } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
import { COLORS } from 'src/constants/declaracao';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  size?: 'small' | 'medium';
}

export function ActionButtons({ onEdit, onDelete, onView, size = 'small' }: Readonly<ActionButtonsProps>) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {onView && (
        <Tooltip title="Visualizar">
          <IconButton size={size} onClick={onView}>
            <Iconify icon="solar:eye-bold" width={20} />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="Editar">
          <IconButton size={size} onClick={onEdit}>
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Deletar">
          <IconButton 
            size={size} 
            onClick={onDelete}
            sx={{
              color: COLORS.primary,
              '&:hover': {
                bgcolor: `${COLORS.primary}15`,
                color: COLORS.primary,
              },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

