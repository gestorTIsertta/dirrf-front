import { Box, Paper, Stack, Typography, Button, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import { CloudUpload as CloudUploadIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify/iconify';
import { documentosMock, COLORS } from 'src/constants/declaracao';

interface DocumentosListProps {
  onAnexarClick: () => void;
}

export function DocumentosList({ onAnexarClick }: DocumentosListProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={2}
        spacing={2}
      >
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Comprovantes de Compra e Venda
          </Typography>
          <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Envie notas fiscais, contratos, extratos bancários ou outros documentos que comprovem suas operações.
          </Typography>
        </Box>
        <Button
          startIcon={<FilterListIcon />}
          variant="outlined"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: 'auto', sm: 160, md: 180 },
            borderColor: COLORS.grey200,
            color: COLORS.grey800,
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: 'transparent',
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            Filtrar por categoria
          </Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'none' } }}>
            Filtrar categoria
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Filtrar
          </Box>
        </Button>
      </Stack>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={onAnexarClick}
          sx={{
            bgcolor: COLORS.primary,
            '&:hover': { bgcolor: COLORS.primaryDark },
            px: 4,
            py: 1.5,
          }}
        >
          Anexar Comprovante
        </Button>
      </Box>

      <Stack spacing={1}>
        {documentosMock.map((doc) => (
          <Paper
            key={doc.id}
            sx={{
              p: { xs: 1, sm: 1.5 },
              display: 'flex',
              alignItems: 'center',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Avatar
              sx={{
                bgcolor: COLORS.error,
                mr: { xs: 1, sm: 2 },
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              {doc.nome.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box flex={1} sx={{ minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, wordBreak: 'break-word' }}>
                {doc.nome}
              </Typography>
              <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {doc.tamanho} • {doc.categoria} • {doc.info}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}
            >
              <Chip
                label={doc.status}
                size="small"
                sx={{
                  mr: { xs: 0, sm: 2 },
                  bgcolor:
                    doc.status === 'Aprovado'
                      ? COLORS.successLight
                      : doc.status === 'Em análise'
                      ? COLORS.warningLight
                      : COLORS.grey200,
                  color:
                    doc.status === 'Aprovado'
                      ? COLORS.success
                      : doc.status === 'Em análise'
                      ? COLORS.warning
                      : COLORS.grey800,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              />
              <Tooltip title="Visualizar">
                <IconButton size="small">
                  <Iconify icon="solar:eye-bold" width={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar">
                <IconButton size="small" color="error">
                  <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mt={2}
        spacing={1}
      >
        <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
          15 documentos enviados • 18,4 MB de espaço utilizado
        </Typography>
        <Button size="small" sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Ver todos os documentos →
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Ver todos →
          </Box>
        </Button>
      </Stack>
    </Paper>
  );
}

