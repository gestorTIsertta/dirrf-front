import { Grid, Paper, Stack, Typography, Button, Card, CardContent, CardActions, Box } from '@mui/material';
import { categorias, COLORS } from 'src/constants/declaracao';

interface CategoriasGridProps {
  onCompraClick: (categoria: string) => void;
  onVendaClick: (categoria: string) => void;
}

export function CategoriasGrid({ onCompraClick, onVendaClick }: CategoriasGridProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" fontWeight={700} mb={0.5} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        O que você comprou e vendeu no último ano?
      </Typography>
      <Typography variant="body2" color={COLORS.grey600} mb={2} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
        Selecione as categorias e informe as operações realizadas em 2024.
      </Typography>

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {categorias.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                component="img"
                src={cat.imagemUrl}
                alt={cat.titulo}
                sx={{ width: '100%', height: { xs: 140, sm: 160 }, objectFit: 'cover' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Box sx={{ color: cat.color, display: 'flex' }}>
                    {cat.icon}
                  </Box>
                  <Typography fontWeight={700}>{cat.titulo}</Typography>
                </Stack>
                <Typography variant="body2" color={COLORS.grey600}>
                  {cat.descricao}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button variant="outlined" size="small" onClick={() => onCompraClick(cat.titulo)}>
                  Comprei
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
                  onClick={() => onVendaClick(cat.titulo)}
                >
                  Vendi
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

