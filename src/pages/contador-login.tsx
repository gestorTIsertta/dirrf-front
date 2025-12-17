import { Helmet } from 'react-helmet-async';

import ContadorLoginView from 'src/sections/auth/contador-login-view';

export default function ContadorLoginPage() {
  return (
    <>
      <Helmet>
        <title>Login - Contador | IRFF</title>
      </Helmet>

      <ContadorLoginView />
    </>
  );
}



