import { useState, useEffect, useCallback } from 'react';
import { ItemDeclarado, FormDataCompraVenda } from 'src/types/declaracao';
import * as transactionsApi from 'src/api/requests/transactions';
import {
  convertCategoriaToBackend,
  convertCategoriaFromBackend,
  convertTipoOperacaoToBackend,
  convertTipoOperacaoFromBackend,
  convertDateToBackend,
  convertDateFromBackend,
  convertValueToBackend,
  convertValueFromBackend,
} from 'src/api/utils/converters';
import { formatDateToInput } from 'src/utils/date-format';

const initialFormData: FormDataCompraVenda = {
  tipo: '',
  data: '',
  valor: '',
  descricao: '',
  comprovante: null,
  comprovantesAnexados: [],
  bancoId: '',
};

interface UseItensOptions {
  year: number;
}

const transactionIdMap = new Map<number, string>();

export function useItens({ year }: UseItensOptions) {
  const [itens, setItens] = useState<ItemDeclarado[]>([]);
  const [formData, setFormData] = useState<FormDataCompraVenda>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsApi.listTransactions(year);
      transactionIdMap.clear();
      
      const itensConvertidos: ItemDeclarado[] = response.transactions.map((transaction, index) => {
        const frontendId = index + 1;
        transactionIdMap.set(frontendId, transaction.id);
        
        return {
          id: frontendId,
          categoria: convertCategoriaFromBackend(transaction.categoria),
          tipo: transaction.descricao || 'Outro',
          operacao: convertTipoOperacaoFromBackend(transaction.tipo),
          data: convertDateFromBackend(transaction.data),
          valor: convertValueFromBackend(transaction.valor),
          comprovante: transaction.comprovantes.length > 0,
          comprovanteFile: null,
          comprovantes: transaction.comprovantes,
          status: 'Pendente',
          bancoId: transaction.bancoId,
        };
      });
      setItens(itensConvertidos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens');
      console.error('Erro ao carregar itens:', err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    loadItens();
  }, [loadItens]);

  const updateItem = async (itemAtualizado: ItemDeclarado, comprovantesParaDeletar?: string[], novosComprovantes?: File[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const transactionId = transactionIdMap.get(itemAtualizado.id);
      if (!transactionId) {
        throw new Error('Item não encontrado');
      }
      
      await transactionsApi.updateTransaction(year, transactionId, {
        categoria: convertCategoriaToBackend(itemAtualizado.categoria),
        tipo: convertTipoOperacaoToBackend(itemAtualizado.operacao as 'Compra' | 'Venda'),
        data: convertDateToBackend(itemAtualizado.data),
        valor: convertValueToBackend(itemAtualizado.valor),
        descricao: itemAtualizado.tipo,
        bancoId: itemAtualizado.bancoId || undefined,
      });

      if (comprovantesParaDeletar && comprovantesParaDeletar.length > 0) {
        await Promise.all(
          comprovantesParaDeletar.map((storagePath) =>
            transactionsApi.deleteComprovante(year, transactionId, storagePath)
          )
        );
      }

      if (novosComprovantes && novosComprovantes.length > 0) {
        await transactionsApi.uploadComprovantes(year, transactionId, novosComprovantes);
      }

      await loadItens();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar item');
      console.error('Erro ao atualizar item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const transactionId = transactionIdMap.get(id);
      if (!transactionId) {
        throw new Error('Item não encontrado');
      }
      
      await transactionsApi.deleteTransaction(year, transactionId);
      await loadItens();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar item');
      console.error('Erro ao deletar item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const prepareEditForm = (item: ItemDeclarado) => {
    const comprovantesExistentes = item.comprovantes && item.comprovantes.length > 0 
      ? item.comprovantes.map(comp => ({
          fileName: comp.fileName,
          storagePath: comp.storagePath,
          uploadedAt: comp.uploadedAt,
        }))
      : [];
    
    setFormData({
      tipo: item.tipo,
      data: formatDateToInput(item.data),
      valor: item.valor,
      descricao: '',
      comprovante: null,
      comprovantesAnexados: item.comprovanteFile ? [item.comprovanteFile] : [],
      comprovantesExistentes,
      bancoId: item.bancoId || '',
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    itens,
    formData,
    setFormData,
    loading,
    error,
    updateItem,
    deleteItem,
    prepareEditForm,
    resetForm,
    loadItens,
  };
}

