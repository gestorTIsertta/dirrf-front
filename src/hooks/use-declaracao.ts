import { useState } from 'react';
import { CompraVenda, FormDataCompraVenda, ComprovanteData } from 'src/types/declaracao';

const initialFormData: FormDataCompraVenda = {
  tipo: '',
  data: '',
  valor: '',
  descricao: '',
  comprovante: null,
};

const initialComprovanteData: ComprovanteData = {
  compraVendaId: '',
  arquivo: null,
};

export function useDeclaracao() {
  const [comprasVendas, setComprasVendas] = useState<CompraVenda[]>([]);
  const [formData, setFormData] = useState<FormDataCompraVenda>(initialFormData);
  const [comprovanteData, setComprovanteData] = useState<ComprovanteData>(initialComprovanteData);

  const addCompraVenda = (compraVenda: CompraVenda) => {
    setComprasVendas((prev) => [...prev, compraVenda]);
  };

  const updateComprovante = (id: string, arquivo: File) => {
    setComprasVendas((prev) =>
      prev.map((cv) => (cv.id === id ? { ...cv, comprovante: arquivo } : cv))
    );
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const resetComprovanteData = () => {
    setComprovanteData(initialComprovanteData);
  };

  return {
    comprasVendas,
    formData,
    comprovanteData,
    setFormData,
    setComprovanteData,
    addCompraVenda,
    updateComprovante,
    resetFormData,
    resetComprovanteData,
  };
}

