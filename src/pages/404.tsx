import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <Helmet>
        <title>404 - Página não encontrada</title>
      </Helmet>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 3,
          px: 2,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: { xs: '3rem', sm: '4rem', md: '5rem' } }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, textAlign: 'center' }}>
          Página não encontrada
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push(paths.auth.login)}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Voltar ao início
        </Button>
      </Box>
    </>
  );
}

