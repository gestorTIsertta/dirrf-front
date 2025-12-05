import { Box, Paper, Stack, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Tooltip, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify/iconify';
import { itensMock, COLORS } from 'src/constants/declaracao';

export function ItensTable() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
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
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: 120 },
              borderColor: COLORS.grey200,
              color: COLORS.grey800,
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: 'transparent',
              },
            }}
          >
            Exportar
          </Button>
        </Stack>
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
            {itensMock.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {item.categoria}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {item.tipo}
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Chip
                    label={item.operacao}
                    size="small"
                    sx={{
                      bgcolor:
                        item.operacao === 'Compra'
                          ? COLORS.successLight
                          : item.operacao === 'Venda'
                          ? COLORS.errorLight
                          : COLORS.primary + '20',
                      color:
                        item.operacao === 'Compra'
                          ? COLORS.success
                          : item.operacao === 'Venda'
                          ? COLORS.error
                          : COLORS.primary,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {item.data}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                  {item.valor}
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  {item.comprovante ? (
                    <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: COLORS.success }} />
                  ) : (
                    <Typography color={COLORS.error} variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      ✕
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      bgcolor:
                        item.status === 'Completo'
                          ? COLORS.successLight
                          : item.status === 'Faltando info'
                          ? COLORS.errorLight
                          : COLORS.warningLight,
                      color:
                        item.status === 'Completo'
                          ? COLORS.success
                          : item.status === 'Faltando info'
                          ? COLORS.error
                          : COLORS.warning,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Tooltip title="Editar">
                    <IconButton size="small">
                      <Iconify icon="solar:pen-bold" width={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deletar">
                    <IconButton size="small" color="error">
                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    </IconButton>
                  </Tooltip>
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
    </Paper>
  );
}

