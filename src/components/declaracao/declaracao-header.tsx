import { Box, Paper, Stack, Typography, Button, Chip, FormControl, MenuItem, Select } from '@mui/material';
import { Save as SaveIcon, Send as SendIcon } from '@mui/icons-material';
import { COLORS } from 'src/constants/declaracao';

interface DeclaracaoHeaderProps {
  onSave?: () => void;
  onSend?: () => void;
}

export function DeclaracaoHeader({ onSave, onSend }: DeclaracaoHeaderProps) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
      >
        <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Typography variant="caption" color={COLORS.grey600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Imposto de Renda &gt; Declaração
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } }}>
            Declaração de Imposto de Renda
          </Typography>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 1.5, md: 2 }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', md: 'auto' }, flexWrap: { sm: 'wrap', md: 'nowrap' } }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Typography variant="caption" color={COLORS.grey600} sx={{ whiteSpace: 'nowrap', pt: { xs: 0, sm: 0.5 } }}>
              Ano-calendário:
            </Typography>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120, md: 140 }, width: { xs: '100%', sm: 'auto' } }}>
              <Select defaultValue="2024">
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Chip
            label="Em preenchimento"
            color="warning"
            variant="outlined"
            sx={{
              fontWeight: 600,
              alignSelf: { xs: 'flex-start', sm: 'center' },
              width: { xs: 'fit-content', sm: 'auto' },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={onSave}
            sx={{
              width: { xs: '100%', sm: 'auto', md: 'auto' },
              minWidth: { xs: 'auto', sm: 120 },
              '& .MuiButton-startIcon': { mr: { xs: 1, sm: 0.5 } },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Salvar rascunho
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Salvar
            </Box>
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={onSend}
            sx={{
              width: { xs: '100%', sm: 'auto', md: 'auto' },
              minWidth: { xs: 'auto', sm: 140 },
              bgcolor: COLORS.primary,
              '&:hover': { bgcolor: COLORS.primaryDark },
              '& .MuiButton-startIcon': { mr: { xs: 1, sm: 0.5 } },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              Enviar para contabilidade
            </Box>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'none' } }}>
              Enviar
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Enviar
            </Box>
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

