import { Box, Card, Stack, Typography } from '@mui/material';
import { Documento } from 'src/types/declaracao';
import { COLORS } from 'src/constants/declaracao';
import { StatusChip } from './status-chip';
import { ActionButtons } from './action-buttons';

interface DocumentCardProps {
  documento: Documento;
  onView?: (doc: Documento) => void;
  onDelete?: (doc: Documento) => void;
}

export function DocumentCard({ documento, onView, onDelete }: DocumentCardProps) {
  return (
    <Card
      sx={{
        p: { xs: 1, sm: 1.5 },
        display: 'flex',
        alignItems: 'center',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 1, sm: 0 },
      }}
    >
      <Box flex={1} sx={{ minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
        <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, wordBreak: 'break-word' }}>
          {documento.nome}
        </Typography>
        <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
          {documento.tamanho} • {documento.categoria} • {documento.info}
        </Typography>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}
      >
        <Box sx={{ mr: { xs: 0, sm: 2 } }}>
          <StatusChip status={documento.status} />
        </Box>
        <ActionButtons onView={onView ? () => onView(documento) : undefined} onDelete={onDelete ? () => onDelete(documento) : undefined} />
      </Stack>
    </Card>
  );
}

