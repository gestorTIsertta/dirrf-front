import { Helmet } from 'react-helmet-async';

import DeclaracaoView from 'src/sections/declaracao/declaracao-view';

export default function DeclaracaoPage() {
  return (
    <>
      <Helmet>
        <title>Declaração de Imposto de Renda - IRFF</title>
      </Helmet>

      <DeclaracaoView />
    </>
  );
}

