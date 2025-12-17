import { Helmet } from 'react-helmet-async';

import BackofficeDeclaracoesView from 'src/sections/contador/backoffice-declaracoes-view';

export default function ContadorDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Contador | IRFF</title>
      </Helmet>

      <BackofficeDeclaracoesView />
    </>
  );
}



