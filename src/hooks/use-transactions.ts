import { useCallback, useRef } from 'react';
import { useClientCpf } from 'src/hooks/use-contador-context';
import * as transactionsApi from 'src/api/requests/transactions';
import * as incomeDocumentsApi from 'src/api/requests/income-documents';
import {
  convertCategoriaToBackend,
  convertTipoOperacaoToBackend,
  convertDateToBackend,
  convertValueToBackend,
} from 'src/api/utils/converters';
import { handleError } from 'src/utils/error-handler';
import type { CompraVenda, FormDataEmprestimo, FormDataParticipacao, FormDataAtividadeRural } from 'src/types/declaracao';

interface UseTransactionsOptions {
  year: number;
  onSuccess?: () => void;
}

interface TransactionRefs {
  itensTable?: { reload: () => void } | null;
  documentosList?: { reload: () => void } | null;
}

export function useTransactions({ year, onSuccess }: UseTransactionsOptions) {
  const clientCpf = useClientCpf();
  const refs = useRef<TransactionRefs>({});

  const setItensTableRef = useCallback((ref: { reload: () => void } | null) => {
    refs.current.itensTable = ref;
  }, []);

  const setDocumentosListRef = useCallback((ref: { reload: () => void } | null) => {
    refs.current.documentosList = ref;
  }, []);

  const updateRefs = useCallback((itensRef: { reload: () => void } | null, docsRef: { reload: () => void } | null) => {
    refs.current.itensTable = itensRef;
    refs.current.documentosList = docsRef;
  }, []);

  const reloadItensTable = useCallback(() => {
    refs.current.itensTable?.reload();
  }, []);

  const reloadDocumentosList = useCallback(() => {
    refs.current.documentosList?.reload();
  }, []);

  const submitCompraVenda = useCallback(async (compraVenda: CompraVenda) => {
    try {
      const transactionData = {
        categoria: convertCategoriaToBackend(compraVenda.categoria),
        tipo: convertTipoOperacaoToBackend(compraVenda.operacao),
        data: convertDateToBackend(compraVenda.data),
        valor: convertValueToBackend(compraVenda.valor),
        descricao: compraVenda.tipo,
        bancoId: compraVenda.bancoId || undefined,
      };

      const response = await transactionsApi.createTransaction(year, transactionData, clientCpf);

      if (response.transaction?.id) {
        const arquivosParaUpload = compraVenda.comprovantesAnexados && compraVenda.comprovantesAnexados.length > 0
          ? compraVenda.comprovantesAnexados
          : (compraVenda.comprovante ? [compraVenda.comprovante] : []);

        if (arquivosParaUpload.length > 0) {
          await transactionsApi.uploadComprovantes(year, response.transaction.id, arquivosParaUpload, clientCpf);
        }
      }

      reloadItensTable();
      onSuccess?.();
    } catch (error) {
      handleError(error, 'Erro ao salvar transação. Tente novamente.');
      throw error;
    }
  }, [year, clientCpf, reloadItensTable, onSuccess]);

  const submitComprovante = useCallback(async (bancoId: string, arquivo: File) => {
    try {
      await incomeDocumentsApi.uploadIncomeDocument(year, {
        file: arquivo,
        bankId: bancoId,
      }, clientCpf);

      reloadDocumentosList();
      onSuccess?.();
    } catch (error) {
      handleError(error, 'Erro ao anexar comprovante. Tente novamente.');
      throw error;
    }
  }, [year, clientCpf, reloadDocumentosList, onSuccess]);

  const submitEmprestimo = useCallback(async (data: FormDataEmprestimo) => {
    try {
      const transactionData = {
        categoria: convertCategoriaToBackend('Empréstimos'),
        tipo: 'compra' as const,
        data: convertDateToBackend(data.data || ''),
        valor: convertValueToBackend(data.valor || ''),
        descricao: 'Empréstimo',
        bancoId: data.bancoId || undefined,
      };

      await transactionsApi.createTransaction(year, transactionData, clientCpf);
      reloadItensTable();
      onSuccess?.();
    } catch (error) {
      handleError(error, 'Erro ao salvar empréstimo. Tente novamente.');
      throw error;
    }
  }, [year, clientCpf, reloadItensTable, onSuccess]);

  const submitParticipacao = useCallback(async (data: FormDataParticipacao) => {
    try {
      const transactionData = {
        categoria: convertCategoriaToBackend('Participações em Empresas'),
        tipo: 'compra' as const,
        data: new Date().toISOString(),
        valor: 0,
        descricao: `Participação: ${data.razaoSocial || ''} - CNPJ: ${data.cnpj || ''} - ${data.percentual || ''}%`,
        bancoId: undefined,
      };

      await transactionsApi.createTransaction(year, transactionData, clientCpf);
      reloadItensTable();
      onSuccess?.();
    } catch (error) {
      handleError(error, 'Erro ao salvar participação. Tente novamente.');
      throw error;
    }
  }, [year, clientCpf, reloadItensTable, onSuccess]);

  const submitAtividadeRural = useCallback(async (data: FormDataAtividadeRural) => {
    try {
      if (data.emprestimoRuralBancoId && data.emprestimoRuralValor) {
        const transactionData = {
          categoria: convertCategoriaToBackend('Atividade Rural'),
          tipo: 'compra' as const,
          data: new Date().toISOString(),
          valor: convertValueToBackend(data.emprestimoRuralValor),
          descricao: `Atividade Rural - Empréstimo Rural: ${data.bensAtividadeRural || ''}`,
          bancoId: data.emprestimoRuralBancoId || undefined,
        };

        const response = await transactionsApi.createTransaction(year, transactionData, clientCpf);

        if (response.transaction?.id && data.fichasAnexadas && data.fichasAnexadas.length > 0) {
          await transactionsApi.uploadComprovantes(year, response.transaction.id, data.fichasAnexadas, clientCpf);
        }
      }

      reloadItensTable();
      onSuccess?.();
    } catch (error) {
      handleError(error, 'Erro ao salvar atividade rural. Tente novamente.');
      throw error;
    }
  }, [year, clientCpf, reloadItensTable, onSuccess]);

  return {
    submitCompraVenda,
    submitComprovante,
    submitEmprestimo,
    submitParticipacao,
    submitAtividadeRural,
    setItensTableRef,
    setDocumentosListRef,
    updateRefs,
  };
}

