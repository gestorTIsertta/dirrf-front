import { useState } from 'react';

export function useModals() {
  const [modalCompraVendaOpen, setModalCompraVendaOpen] = useState(false);
  const [modalComprovanteOpen, setModalComprovanteOpen] = useState(false);
  const [operacaoAtual, setOperacaoAtual] = useState<'Compra' | 'Venda' | null>(null);
  const [categoriaAtual, setCategoriaAtual] = useState<string | null>(null);

  const openCompraVenda = (operacao: 'Compra' | 'Venda', categoria: string) => {
    setOperacaoAtual(operacao);
    setCategoriaAtual(categoria);
    setModalCompraVendaOpen(true);
  };

  const closeCompraVenda = () => {
    setModalCompraVendaOpen(false);
    setOperacaoAtual(null);
    setCategoriaAtual(null);
  };

  const openComprovante = () => {
    setModalComprovanteOpen(true);
  };

  const closeComprovante = () => {
    setModalComprovanteOpen(false);
  };

  return {
    modalCompraVendaOpen,
    modalComprovanteOpen,
    operacaoAtual,
    categoriaAtual,
    openCompraVenda,
    closeCompraVenda,
    openComprovante,
    closeComprovante,
  };
}

