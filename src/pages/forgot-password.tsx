import { Helmet } from 'react-helmet-async';

import ForgotPasswordView from 'src/sections/auth/forgot-password-view';

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Esqueci minha senha - IRFF</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}

