import {
  Card,
  Stack,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { COLORS } from 'src/constants/declaracao';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

export function DeclaracaoHeader() {
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
