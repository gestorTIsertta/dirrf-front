import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  Chip,
  Box,
  TablePagination,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import type { DeclaracaoResumo } from 'src/types/backoffice';

const COLORS = {
  success: '#16A34A',
  error: '#DC2626',
  grey200: '#E5E7EB',
  grey600: '#4B5563',
  grey800: '#111827',
};

function chipStatus(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    'Em preenchimento': { bg: '#FEF3C7', color: '#92400E' },
    'Aguardando conferência': { bg: '#FFEDD5', color: '#C2410C' },
    'Enviado à Receita': { bg: '#DBEAFE', color: '#1D4ED8' },
    'Finalizado': { bg: '#DCFCE7', color: '#166534' },
  };
  return map[status] || { bg: COLORS.grey200, color: COLORS.grey800 };
}

interface DeclaracoesTableProps {
  declaracoes: DeclaracaoResumo[];
  onViewCliente: (declaracao: DeclaracaoResumo) => void;
}

export function DeclaracoesTable({ declaracoes, onViewCliente }: DeclaracoesTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedDeclaracoes = declaracoes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, overflow: 'hidden' }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        mb={2}
        spacing={{ xs: 1, sm: 0 }}
      >
        <Box>
          <Typography 
            variant="subtitle1" 
            fontWeight={700}
            sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
          >
            Declarações do Ano-Calendário
          </Typography>
          <Typography variant="caption" color={COLORS.grey600}>
            {declaracoes.length} declarações
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Cliente
            </TableCell>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Status
            </TableCell>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Ano-calendário
            </TableCell>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Imposto / Restituição
            </TableCell>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Data último envio
            </TableCell>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Responsável
            </TableCell>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Pendências
            </TableCell>
            <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedDeclaracoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color={COLORS.grey600}>
                  Nenhuma declaração encontrada
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedDeclaracoes.map((d) => {
              const resultColor = d.resultadoTipo === 'pagar' ? COLORS.error : COLORS.success;
              return (
                <TableRow key={d.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>{d.nome[0]}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{d.nome}</Typography>
                        <Typography variant="caption" color={COLORS.grey600}>
                          CPF: {d.cpf}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={d.status}
                      sx={{
                        bgcolor: chipStatus(d.status).bg,
                        color: chipStatus(d.status).color,
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 },
                      }}
                    />
                  </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {d.ano}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: resultColor, 
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {d.resultado}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {d.dataEnvio}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            wordBreak: 'break-word'
                          }}
                        >
                          {d.responsavel}
                        </Typography>
                      </TableCell>
                  <TableCell>
                    {d.pendencias !== '0 itens' && d.pendencias !== '0 item' ? (
                      <Chip
                        size="small"
                        label={d.pendencias}
                        sx={{
                          bgcolor: '#FEE2E2',
                          color: '#DC2626',
                          fontWeight: 600,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 20, sm: 24 },
                        }}
                      />
                    ) : (
                      <Typography 
                        variant="caption" 
                        color={COLORS.grey600}
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      >
                        {d.pendencias}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => onViewCliente(d)}
                      sx={{ 
                        padding: { xs: '4px', sm: '8px' }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      </Box>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={declaracoes.length}
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
    </Paper>
  );
}

