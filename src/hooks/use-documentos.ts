import { useState } from 'react';
import { Documento } from 'src/types/declaracao';
import { documentosMock } from 'src/constants/declaracao';

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>(documentosMock);

  const deleteDocumento = (id: number) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  };

  const visualizarDocumento = (doc: Documento) => {
    const url = `#/documento/${doc.id}`;
    window.open(url, '_blank');
  };

  return {
    documentos,
    setDocumentos,
    deleteDocumento,
    visualizarDocumento,
  };
}

