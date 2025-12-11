import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';
import { useLogin } from 'src/hooks/use-login';
import Iconify from 'src/components/iconify/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

export default function LoginView() {
  const router = useRouter();
  const password = useBoolean();
  const { email, password: passwordValue, setEmail, setPassword, handleLogin, loading } = useLogin();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        px: 2,
      }}
    >
      <Card
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          width: 1,
          maxWidth: 420,
        }}
      >
        <Stack spacing={3}>
          <Stack sx={{ mb: 2 }}>
            <Typography variant="h4" textAlign="center" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
              Olá, seja bem-vindo!
            </Typography>
            <Typography textAlign="center" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Faça login para acessar sua conta
            </Typography>
          </Stack>

          <TextField
            fullWidth
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleLogin();
              }
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Senha"
            value={passwordValue}
            onChange={(e) => setPassword(e.target.value)}
            type={password.value ? 'text' : 'password'}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end" disabled={loading}>
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleLogin();
              }
            }}
          />

          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => router.push(paths.auth.forgotPassword)}
            sx={{ alignSelf: 'flex-end', textDecoration: 'none' }}
            disabled={loading}
          >
            Esqueci minha senha
          </Link>

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
