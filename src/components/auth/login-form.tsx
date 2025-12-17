import React from 'react';
import {
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify/iconify';

interface LoginFormProps {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  showForgotPassword?: boolean;
  onForgotPassword?: () => void;
}

export function LoginForm({
  title,
  subtitle,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  showForgotPassword = false,
  onForgotPassword,
}: LoginFormProps) {
  const passwordVisible = useBoolean();

  return (
    <Stack spacing={3}>
      <Stack sx={{ mb: 2 }}>
        <Typography variant="h4" textAlign="center" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          {title}
        </Typography>
        <Typography textAlign="center" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {subtitle}
        </Typography>
      </Stack>

      <TextField
        fullWidth
        name="email"
        label="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        type="email"
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !loading) {
            onSubmit();
          }
        }}
      />

      <TextField
        fullWidth
        name="password"
        label="Senha"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        type={passwordVisible.value ? 'text' : 'password'}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={passwordVisible.onToggle} edge="end" disabled={loading}>
                <Iconify icon={passwordVisible.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !loading) {
            onSubmit();
          }
        }}
      />

      {showForgotPassword && onForgotPassword && (
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onForgotPassword}
          sx={{ alignSelf: 'flex-end', textDecoration: 'none' }}
          disabled={loading}
        >
          Esqueci minha senha
        </Link>
      )}

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={onSubmit}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </Stack>
  );
}

