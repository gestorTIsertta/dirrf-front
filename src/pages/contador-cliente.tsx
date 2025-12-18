import { Helmet } from 'react-helmet-async';

import ClienteDetalhesView from 'src/sections/contador/cliente-detalhes-view';

export default function ContadorClientePage() {
  return (
    <>
      <Helmet>
        <title>Cliente - Contador | IRFF</title>
      </Helmet>

      <ClienteDetalhesView />
    </>
  );
}




