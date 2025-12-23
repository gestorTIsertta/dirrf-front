import React, { useState, useMemo } from 'react';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import type { DeclaracaoResumo, Comentario } from 'src/types/backoffice';
import { COLORS } from 'src/constants/declaracao';
import { ModalComentario } from './modal-comentario';
import { ModalEnviarDeclaracao } from './modal-enviar-declaracao';
import { ModalStatus } from './modal-status';
import type { ClientStatus } from 'src/api/requests/backoffice-clients';


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
  onEnviarDeclaracao?: (declaracao: DeclaracaoResumo, arquivo: File) => Promise<void>;
  onAdicionarComentario?: (declaracao: DeclaracaoResumo, comentario: string) => Promise<void>;
  onEditarComentario?: (declaracao: DeclaracaoResumo, comentarioId: string, comentario: string) => Promise<void>;
  onExcluirComentario?: (declaracao: DeclaracaoResumo, comentarioId: string) => Promise<void>;
  getComentarios?: (declaracao: DeclaracaoResumo) => Comentario[];
  onEditarStatus?: (declaracao: DeclaracaoResumo, status: ClientStatus) => Promise<void>;
  getClienteStatus?: (declaracao: DeclaracaoResumo) => ClientStatus | undefined;
  getClienteNome?: (declaracao: DeclaracaoResumo) => string | undefined;
}

export function DeclaracoesTable({
  declaracoes,
  onViewCliente,
  onEnviarDeclaracao,
  onAdicionarComentario,
  onEditarComentario,
  onExcluirComentario,
  getComentarios,
  onEditarStatus,
  getClienteStatus,
  getClienteNome,
}: Readonly<DeclaracoesTableProps>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDeclaracao, setSelectedDeclaracao] = useState<DeclaracaoResumo | null>(null);
  const [modalComentarioOpen, setModalComentarioOpen] = useState(false);
  const [modalEnviarOpen, setModalEnviarOpen] = useState(false);
  const [modalStatusOpen, setModalStatusOpen] = useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedDeclaracoes = declaracoes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, declaracao: DeclaracaoResumo) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeclaracao(declaracao);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Não reseta selectedDeclaracao aqui para manter a referência para os modais
  };

  const handleVisualizar = () => {
    if (selectedDeclaracao) {
      onViewCliente(selectedDeclaracao);
    }
    setAnchorEl(null);
    setSelectedDeclaracao(null);
  };

  const handleEnviarDeclaracao = () => {
    setModalEnviarOpen(true);
    setAnchorEl(null);
    // Mantém selectedDeclaracao para o modal
  };

  const handleAdicionarComentario = () => {
    // Garante que selectedDeclaracao está definido antes de abrir o modal
    if (selectedDeclaracao) {
      setModalComentarioOpen(true);
    }
    setAnchorEl(null);
    // Mantém selectedDeclaracao para o modal
  };

  const handleEditarStatus = () => {
    if (selectedDeclaracao) {
      setModalStatusOpen(true);
    }
    setAnchorEl(null);
    // Mantém selectedDeclaracao para o modal
  };

  const handleSubmitEnviar = async (arquivo: File) => {
    if (selectedDeclaracao && onEnviarDeclaracao) {
      await onEnviarDeclaracao(selectedDeclaracao, arquivo);
    }
  };

  const handleSubmitComentario = async (comentario: string) => {
    if (selectedDeclaracao && onAdicionarComentario) {
      await onAdicionarComentario(selectedDeclaracao, comentario);
    }
  };

  const handleEditComentario = async (id: string, comentario: string) => {
    if (selectedDeclaracao && onEditarComentario) {
      await onEditarComentario(selectedDeclaracao, id, comentario);
    }
  };

  const handleDeleteComentario = async (id: string) => {
    if (selectedDeclaracao && onExcluirComentario) {
      await onExcluirComentario(selectedDeclaracao, id);
    }
  };

  const handleSubmitStatus = async (status: ClientStatus) => {
    if (selectedDeclaracao && onEditarStatus) {
      await onEditarStatus(selectedDeclaracao, status);
    }
  };

  // Recalcula os comentários sempre que selectedDeclaracao ou modalComentarioOpen mudar
  const comentariosAtuais = useMemo(() => {
    if (selectedDeclaracao && getComentarios) {
      return getComentarios(selectedDeclaracao);
    }
    return [];
  }, [selectedDeclaracao, getComentarios]);

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
                      onClick={(e) => handleMenuOpen(e, d)}
                      sx={{
                        padding: { xs: '4px', sm: '8px' },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
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
        labelDisplayedRows={({ from, to, count }) => {
          const total = count === -1 ? `mais de ${to}` : count;
          return `${from}-${to} de ${total}`;
        }}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleVisualizar}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Visualizar</ListItemText>
        </MenuItem>
        {onEditarStatus && (
          <MenuItem onClick={handleEditarStatus}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar Status</ListItemText>
          </MenuItem>
        )}
        {onEnviarDeclaracao && (
          <MenuItem onClick={handleEnviarDeclaracao}>
            <ListItemIcon>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Enviar declaração</ListItemText>
          </MenuItem>
        )}
        {onAdicionarComentario && (
          <MenuItem onClick={handleAdicionarComentario}>
            <ListItemIcon>
              <CommentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Deixar comentário</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {onAdicionarComentario && selectedDeclaracao && (
        <ModalComentario
          open={modalComentarioOpen}
          onClose={() => {
            setModalComentarioOpen(false);
            setSelectedDeclaracao(null);
          }}
          onSubmit={handleSubmitComentario}
          onEdit={onEditarComentario ? handleEditComentario : undefined}
          onDelete={onExcluirComentario ? handleDeleteComentario : undefined}
          comentarios={comentariosAtuais}
        />
      )}

      {onEnviarDeclaracao && (
        <ModalEnviarDeclaracao
          open={modalEnviarOpen}
          onClose={() => setModalEnviarOpen(false)}
          onSubmit={handleSubmitEnviar}
        />
      )}

      {onEditarStatus && selectedDeclaracao && (
        <ModalStatus
          open={modalStatusOpen}
          onClose={() => {
            setModalStatusOpen(false);
            setSelectedDeclaracao(null);
          }}
          onSubmit={handleSubmitStatus}
          currentStatus={getClienteStatus ? getClienteStatus(selectedDeclaracao) : undefined}
          clienteNome={getClienteNome ? getClienteNome(selectedDeclaracao) : undefined}
        />
      )}
    </Paper>
  );
}

