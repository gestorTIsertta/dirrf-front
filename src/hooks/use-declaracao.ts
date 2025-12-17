import { useState } from 'react';
import {
  FormDataCompraVenda,
  ComprovanteData,
  FormDataEmprestimo,
  FormDataParticipacao,
  FormDataAtividadeRural,
} from 'src/types/declaracao';

const initialFormData: FormDataCompraVenda = {
  tipo: '',
  data: '',
  valor: '',
  descricao: '',
  comprovante: null,
  comprovantesAnexados: [],
  comprovantesExistentes: [],
  bancoId: '',
};

const initialComprovanteData: ComprovanteData = {
  bancoId: '',
  arquivo: null,
};

const initialEmprestimoData: FormDataEmprestimo = {
  data: '',
  bancoId: '',
  valor: '',
};

const initialParticipacaoData: FormDataParticipacao = {
  cnpj: '',
  razaoSocial: '',
  percentual: '',
};

const initialAtividadeRuralData: FormDataAtividadeRural = {
  emprestimoRuralBancoId: '',
  emprestimoRuralValor: '',
  bensAtividadeRural: '',
  fichaSanitaria: null,
  fichasAnexadas: [],
};

export function useDeclaracao() {
  const [formData, setFormData] = useState<FormDataCompraVenda>(initialFormData);
  const [comprovanteData, setComprovanteData] = useState<ComprovanteData>(initialComprovanteData);
  const [emprestimoData, setEmprestimoData] = useState<FormDataEmprestimo>(initialEmprestimoData);
  const [participacaoData, setParticipacaoData] = useState<FormDataParticipacao>(initialParticipacaoData);
  const [atividadeRuralData, setAtividadeRuralData] = useState<FormDataAtividadeRural>(initialAtividadeRuralData);

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const resetComprovanteData = () => {
    setComprovanteData(initialComprovanteData);
  };

  const resetEmprestimoData = () => {
    setEmprestimoData(initialEmprestimoData);
  };

  const resetParticipacaoData = () => {
    setParticipacaoData(initialParticipacaoData);
  };

  const resetAtividadeRuralData = () => {
    setAtividadeRuralData(initialAtividadeRuralData);
  };

  return {
    formData,
    comprovanteData,
    emprestimoData,
    participacaoData,
    atividadeRuralData,
    setFormData,
    setComprovanteData,
    setEmprestimoData,
    setParticipacaoData,
    setAtividadeRuralData,
    resetFormData,
    resetComprovanteData,
    resetEmprestimoData,
    resetParticipacaoData,
    resetAtividadeRuralData,
  };
}

