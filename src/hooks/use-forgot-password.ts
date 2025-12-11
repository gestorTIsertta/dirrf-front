import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { enqueueSnackbar } from 'notistack';
import { auth } from 'src/config-firebase';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email) {
      enqueueSnackbar('Por favor, informe seu email', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      enqueueSnackbar('Email de recuperação enviado! Verifique sua caixa de entrada.', { variant: 'success' });
    } catch (error) {
      let errorMessage = 'Erro ao enviar email de recuperação. Tente novamente.';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado. Verifique o email informado.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        }
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    handleSendResetEmail,
    loading,
    emailSent,
  };
}

