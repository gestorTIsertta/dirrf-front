import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Banco, FormDataBanco } from 'src/types/declaracao';
import { getCodigoCompeByNome } from 'src/constants/bancos';
import * as banksApi from 'src/api/requests/banks';
import {
  convertTipoContaToBackend,
  convertTipoContaFromBackend,
  convertDateToBackend,
  convertDateFromBackend,
} from 'src/api/utils/converters';
import { getDocument, base64ToBlob } from 'src/api/requests/documents';
import { formatDateToInput } from 'src/utils/date-format';

const initialFormData: FormDataBanco = {
  nome: '',
  conta: '',
  agencia: '',
  tipo: 'Corrente',
  dataAbertura: '',
  informeRendimentos: null,
  informesAnexados: [],
  informeExistente: null,
};

interface UseBancosOptions {
  year: number;
  initialBancos?: Banco[];
  onBancosChange?: (bancos: Banco[]) => void;
}

export function useBancos({ year, initialBancos, onBancosChange }: UseBancosOptions) {
  const [bancos, setBancos] = useState<Banco[]>(initialBancos || []);
  const [formData, setFormData] = useState<FormDataBanco>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBancos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await banksApi.listBanks(year);
      const bancosConvertidos: Banco[] = response.banks.map((bank) => ({
        id: bank.id,
        nome: bank.nome,
        conta: bank.conta,
        agencia: bank.agencia,
        tipo: convertTipoContaFromBackend(bank.tipoConta),
        dataAbertura: convertDateFromBackend(bank.dataAbertura),
        informeRendimentos: null,
        informeRendimentoMetadata: bank.informeRendimento || null,
      }));
      setBancos(bancosConvertidos);
      onBancosChange?.(bancosConvertidos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar bancos');
      console.error('Erro ao carregar bancos:', err);
    } finally {
      setLoading(false);
    }
  }, [year, onBancosChange]);

  useEffect(() => {
    loadBancos();
  }, [loadBancos]);

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

  const addBanco = async (banco: Banco) => {
    try {
      setLoading(true);
      setError(null);
      const response = await banksApi.createBank(year, {
        nome: banco.nome,
        conta: banco.conta,
        agencia: banco.agencia,
        tipoConta: convertTipoContaToBackend(banco.tipo),
        dataAbertura: convertDateToBackend(banco.dataAbertura),
      });

      const novoBanco: Banco = {
        id: response.bank.id,
        nome: response.bank.nome,
        conta: response.bank.conta,
        agencia: response.bank.agencia,
        tipo: convertTipoContaFromBackend(response.bank.tipoConta),
        dataAbertura: convertDateFromBackend(response.bank.dataAbertura),
        informeRendimentos: null,
        informeRendimentoMetadata: response.bank.informeRendimento || null,
      };

      if (banco.informeRendimentos) {
        await uploadInforme(response.bank.id, banco.informeRendimentos);
      }

      setBancos((prev) => [...prev, novoBanco]);
      onBancosChange?.([...bancos, novoBanco]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar banco');
      console.error('Erro ao criar banco:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBanco = async (id: string, bancoAtualizado: Banco) => {
    try {
      setLoading(true);
      setError(null);
      
      await banksApi.updateBank(year, id, {
        nome: bancoAtualizado.nome,
        conta: bancoAtualizado.conta,
        agencia: bancoAtualizado.agencia,
        tipoConta: convertTipoContaToBackend(bancoAtualizado.tipo),
        dataAbertura: convertDateToBackend(bancoAtualizado.dataAbertura),
      });

      if (bancoAtualizado.informeRendimentos) {
        await uploadInforme(id, bancoAtualizado.informeRendimentos);
      } else if (bancoAtualizado.informeRemovido && bancoAtualizado.informeRendimentoMetadata?.storagePath) {
        try {
          const { removeIncomeDocument } = await import('src/api/requests/income-documents');
          await removeIncomeDocument(year, bancoAtualizado.informeRendimentoMetadata.storagePath);
        } catch (err) {
          console.error('Erro ao remover informe:', err);
        }
      }

      await loadBancos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar banco');
      console.error('Erro ao atualizar banco:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBanco = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await banksApi.deleteBank(year, id);
      const bancosAtualizados = bancos.filter((b) => b.id !== id);
      setBancos(bancosAtualizados);
      onBancosChange?.(bancosAtualizados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar banco');
      console.error('Erro ao deletar banco:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadInforme = async (bankId: string, file: File) => {
    try {
      await banksApi.uploadInforme(year, bankId, file);
      await loadBancos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do informe');
      console.error('Erro ao fazer upload do informe:', err);
      throw err;
    }
  };

  const loadInformeRendimento = async (bank: Banco, storagePath: string) => {
    try {
      const document = await getDocument(storagePath);
      const blob = base64ToBlob(document.base64, document.mimeType);
      const file = new File([blob], document.fileName, { type: document.mimeType });
      return file;
    } catch (err) {
      console.error('Erro ao carregar informe de rendimento:', err);
      return null;
    }
  };

  const prepareEditForm = async (banco: Banco) => {
    let informeExistente = null;
    let informesAnexados: File[] = [];

    if (banco.informeRendimentoMetadata?.storagePath) {
      try {
        const file = await loadInformeRendimento(banco, banco.informeRendimentoMetadata.storagePath);
        if (file) {
          informeExistente = {
            fileName: banco.informeRendimentoMetadata.fileName,
            storagePath: banco.informeRendimentoMetadata.storagePath,
            uploadedAt: banco.informeRendimentoMetadata.uploadedAt,
            file: file,
          };
        }
      } catch (err) {
        console.error('Erro ao carregar informe existente:', err);
      }
    }

    if (banco.informeRendimentos) {
      informesAnexados = [banco.informeRendimentos];
    }

    setFormData({
      nome: banco.nome,
      conta: banco.conta,
      agencia: banco.agencia,
      tipo: banco.tipo,
      dataAbertura: formatDateToInput(banco.dataAbertura),
      informeRendimentos: informeExistente?.file || null,
      informesAnexados,
      informeExistente,
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
    loading,
    error,
    updateBancos,
    addBanco,
    updateBanco,
    deleteBanco,
    prepareEditForm,
    resetForm,
    loadBancos,
    uploadInforme,
    loadInformeRendimento,
  };
}

