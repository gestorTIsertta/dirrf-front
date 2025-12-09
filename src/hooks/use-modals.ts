import { useState } from 'react';

export function useModals() {
  const [modalCompraVendaOpen, setModalCompraVendaOpen] = useState(false);
  const [modalComprovanteOpen, setModalComprovanteOpen] = useState(false);
  const [modalEmprestimoOpen, setModalEmprestimoOpen] = useState(false);
  const [modalParticipacaoOpen, setModalParticipacaoOpen] = useState(false);
  const [modalAtividadeRuralOpen, setModalAtividadeRuralOpen] = useState(false);
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

  const openEmprestimo = () => {
    setModalEmprestimoOpen(true);
  };

  const closeEmprestimo = () => {
    setModalEmprestimoOpen(false);
  };

  const openParticipacao = () => {
    setModalParticipacaoOpen(true);
  };

  const closeParticipacao = () => {
    setModalParticipacaoOpen(false);
  };

  const openAtividadeRural = () => {
    setModalAtividadeRuralOpen(true);
  };

  const closeAtividadeRural = () => {
    setModalAtividadeRuralOpen(false);
  };

  return {
    modalCompraVendaOpen,
    modalComprovanteOpen,
    modalEmprestimoOpen,
    modalParticipacaoOpen,
    modalAtividadeRuralOpen,
    operacaoAtual,
    categoriaAtual,
    openCompraVenda,
    closeCompraVenda,
    openComprovante,
    closeComprovante,
    openEmprestimo,
    closeEmprestimo,
    openParticipacao,
    closeParticipacao,
    openAtividadeRural,
    closeAtividadeRural,
  };
}

