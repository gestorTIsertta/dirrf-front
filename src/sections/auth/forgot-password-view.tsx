import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { useForgotPassword } from 'src/hooks/use-forgot-password';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

export default function ForgotPasswordView() {
  const router = useRouter();
  const { email, setEmail, handleSendResetEmail, loading, emailSent } = useForgotPassword();

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
              Esqueci minha senha
            </Typography>
            <Typography textAlign="center" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {emailSent
                ? 'Verifique sua caixa de entrada para redefinir sua senha'
                : 'Informe seu email para receber o link de recuperação'}
            </Typography>
          </Stack>

          {emailSent ? (
            <>
              <Alert severity="success">
                Um email foi enviado para <strong>{email}</strong> com as instruções para redefinir sua senha.
              </Alert>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={() => router.push(paths.auth.login)}
              >
                Voltar para o login
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                disabled={loading}
                placeholder="seu@email.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleSendResetEmail();
                  }
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSendResetEmail}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Enviando...' : 'Enviar email de recuperação'}
              </Button>

              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => router.push(paths.auth.login)}
                sx={{ alignSelf: 'center', textDecoration: 'none' }}
                disabled={loading}
              >
                Voltar para o login
              </Link>
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

