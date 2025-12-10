import { useState, useRef, useEffect, useMemo } from 'react';
import { Banco, FormDataBanco } from 'src/types/declaracao';
import { getCodigoCompeByNome } from 'src/constants/bancos';

const initialFormData: FormDataBanco = {
  nome: '',
  conta: '',
  agencia: '',
  tipo: 'Corrente',
  dataAbertura: '',
  informeRendimentos: null,
};

const bancosMock: Banco[] = [
  {
    id: '1',
    nome: 'Banco do Brasil',
    conta: '12345-6',
    agencia: '1234-5',
    tipo: 'Corrente',
    dataAbertura: '15/03/2020',
  },
  {
    id: '2',
    nome: 'Itaú',
    conta: '78901-2',
    agencia: '5678-9',
    tipo: 'Poupança',
    dataAbertura: '22/05/2019',
  },
];

interface UseBancosOptions {
  initialBancos?: Banco[];
  onBancosChange?: (bancos: Banco[]) => void;
}

export function useBancos({ initialBancos, onBancosChange }: UseBancosOptions = {}) {
  const [bancos, setBancos] = useState<Banco[]>(initialBancos || bancosMock);
  const [formData, setFormData] = useState<FormDataBanco>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialBancos) {
      setBancos(initialBancos);
    }
  }, [initialBancos]);

  const bancosNomesKey = useMemo(() => bancos.map((b) => b.nome).join(','), [bancos]);

  useEffect(() => {
    const bancosComCodigo = bancos.map((banco) => {
      if (!banco.codigoCompe && banco.nome) {
        const codigoCompe = getCodigoCompeByNome(banco.nome);
        if (codigoCompe) {
          return { ...banco, codigoCompe };
        }
      }
      return banco;
    });

    const temMudancas = bancosComCodigo.some(
      (banco, index) => banco.codigoCompe !== bancos[index]?.codigoCompe
    );

    if (temMudancas) {
      setBancos(bancosComCodigo);
      onBancosChange?.(bancosComCodigo);
    }
  }, [bancos, bancosNomesKey, onBancosChange]);

  const updateBancos = (newBancos: Banco[]) => {
    setBancos(newBancos);
    onBancosChange?.(newBancos);
  };

  const addBanco = (banco: Banco) => {
    setBancos((prev) => [...prev, banco]);
  };

  const updateBanco = (id: string, bancoAtualizado: Banco) => {
    setBancos((prev) => prev.map((b) => (b.id === id ? bancoAtualizado : b)));
  };

  const deleteBanco = (id: string) => {
    setBancos((prev) => prev.filter((b) => b.id !== id));
  };

  const prepareEditForm = (banco: Banco) => {
    setFormData({
      nome: banco.nome,
      conta: banco.conta,
      agencia: banco.agencia,
      tipo: banco.tipo,
      dataAbertura: banco.dataAbertura,
      informeRendimentos: banco.informeRendimentos || null,
    });
    setEditingId(banco.id);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  return {
    bancos,
    formData,
    setFormData,
    editingId,
    fileInputRef,
    updateBancos,
    addBanco,
    updateBanco,
    deleteBanco,
    prepareEditForm,
    resetForm,
  };
}

