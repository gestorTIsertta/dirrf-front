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

// Mapa para armazenar a relação entre ID do frontend e transactionId do backend
const transactionIdMap = new Map<number, string>();

export function useItens({ year }: UseItensOptions) {
  const [itens, setItens] = useState<ItemDeclarado[]>([]);
  const [formData, setFormData] = useState<FormDataCompraVenda>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações do backend
  const loadItens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsApi.listTransactions(year);
      transactionIdMap.clear(); // Limpar mapa ao recarregar
      
      const itensConvertidos: ItemDeclarado[] = response.transactions.map((transaction, index) => {
        const frontendId = index + 1;
        transactionIdMap.set(frontendId, transaction.id); // Mapear ID frontend -> backend
        
        return {
          id: frontendId,
          categoria: convertCategoriaFromBackend(transaction.categoria),
          tipo: transaction.descricao || 'Outro',
          operacao: convertTipoOperacaoFromBackend(transaction.tipo),
          data: convertDateFromBackend(transaction.data),
          valor: convertValueFromBackend(transaction.valor),
          comprovante: transaction.comprovantes.length > 0,
          comprovanteFile: null, // Será carregado sob demanda quando necessário
          status: 'Pendente', // Status padrão (pode ser melhorado com lógica de negócio)
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

  // Carregar itens quando o ano mudar
  useEffect(() => {
    loadItens();
  }, [loadItens]);

  const updateItem = async (itemAtualizado: ItemDeclarado) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter transactionId do mapa
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

      // Se houver novos comprovantes, fazer upload
      if (itemAtualizado.comprovanteFile) {
        await transactionsApi.uploadComprovantes(year, transactionId, [itemAtualizado.comprovanteFile]);
      }

      // Recarregar itens
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
      
      // Obter transactionId do mapa
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
    setFormData({
      tipo: item.tipo,
      data: formatDateToInput(item.data),
      valor: item.valor,
      descricao: '',
      comprovante: null,
      comprovantesAnexados: item.comprovanteFile ? [item.comprovanteFile] : [],
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

