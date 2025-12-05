import { Helmet } from 'react-helmet-async';

import LoginView from 'src/sections/auth/login-view';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Login - IRFF</title>
      </Helmet>

      <LoginView />
    </>
  );
}

