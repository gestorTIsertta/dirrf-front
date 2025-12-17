import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useClientCpf } from 'src/hooks/use-contador-context';

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
  const clientCpf = useClientCpf();
  const location = useLocation();

  const loadItens = useCallback(async () => {
    const currentCpf = clientCpf;
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const response = await transactionsApi.listTransactions(year, currentCpf);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
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
      if (currentCpf === clientCpf) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar itens');
      }
    } finally {
      if (currentCpf === clientCpf) {
        setLoading(false);
      }
    }
  }, [year, clientCpf]);

  useEffect(() => {
    if (location.pathname === '/declaracao') {
      const searchParams = new URLSearchParams(location.search);
      const cpfFromQuery = searchParams.get('cpf');
      
      if (cpfFromQuery && !clientCpf) {
        return;
      }
    }
    
    loadItens();
  }, [loadItens, clientCpf, location.pathname, location.search]);

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
      }, clientCpf);

      if (comprovantesParaDeletar && comprovantesParaDeletar.length > 0) {
        await Promise.all(
          comprovantesParaDeletar.map((storagePath) =>
            transactionsApi.deleteComprovante(year, transactionId, storagePath, clientCpf)
          )
        );
      }

      if (novosComprovantes && novosComprovantes.length > 0) {
        await transactionsApi.uploadComprovantes(year, transactionId, novosComprovantes, clientCpf);
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
      
      await transactionsApi.deleteTransaction(year, transactionId, clientCpf);
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

