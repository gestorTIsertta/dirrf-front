import {
  Box,
  Card,
  Stack,
  Button,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { Save as SaveIcon, Send as SendIcon } from '@mui/icons-material';
import { COLORS } from 'src/constants/declaracao';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

interface DeclaracaoHeaderProps {
  onSave?: () => void;
  onSend?: () => void;
}

export function DeclaracaoHeader({ onSave, onSend }: Readonly<DeclaracaoHeaderProps>) {
  const breadcrumbsAction = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1.5, sm: 1.5, md: 2 }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ width: { xs: '100%', md: 'auto' }, flexWrap: { sm: 'wrap', md: 'nowrap' } }}
    >
      <FormControl
        size="small"
        sx={{ minWidth: { xs: '100%', sm: 120, md: 140 }, width: { xs: '100%', sm: 'auto' } }}
      >
        <Select defaultValue={new Date().getFullYear().toString()}>
          <MenuItem value={new Date().getFullYear().toString()}>
            {new Date().getFullYear()}
          </MenuItem>
          <MenuItem value={(new Date().getFullYear() - 1).toString()}>
            {new Date().getFullYear() - 1}
          </MenuItem>
          <MenuItem value={(new Date().getFullYear() - 2).toString()}>
            {new Date().getFullYear() - 2}
          </MenuItem>
        </Select>
      </FormControl>
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
  );

  return (
    <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
      <CustomBreadcrumbs
        heading="Declaração de Imposto de Renda"
        headingProps={{
          variant: 'h5',
          fontWeight: 700,
          sx: { fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } },
        }}
        links={[{ name: 'Imposto de Renda' }, { name: 'Declaração' }]}
        action={breadcrumbsAction}
        sx={{
          mb: 0,
          '& .MuiBreadcrumbs-root': {
            mb: 0.5,
          },
          '& .MuiBreadcrumbs-ol .MuiTypography-body2': {
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: COLORS.grey600,
          },
        }}
      />
    </Card>
  );
}
