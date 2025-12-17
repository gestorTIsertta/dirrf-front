import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useContadorLogin } from 'src/hooks/use-contador-login';
import { LoginForm } from 'src/components/auth/login-form';

export default function ContadorLoginView() {
  const { email, password, setEmail, setPassword, handleLogin, loading } = useContadorLogin();

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
        <LoginForm
          title="Área do Contador"
          subtitle="Faça login para acessar o painel administrativo"
          email={email}
          password={password}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      </Card>
    </Box>
  );
}



