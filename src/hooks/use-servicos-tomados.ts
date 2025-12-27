import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ServicoTomado, FormDataServicoTomado } from 'src/types/declaracao';
import { convertValueFromBackend } from 'src/api/utils/converters';
import { parseCurrencyValue } from 'src/utils/format';
import * as servicesTakenApi from 'src/api/requests/services-taken';
import { useClientCpf } from 'src/hooks/use-contador-context';

const initialFormData: FormDataServicoTomado = {
  nomePrestador: '',
  cpfCnpj: '',
  tipoServico: '',
  valorTotal: '',
  valorReembolsado: '',
  observacoes: '',
};

interface UseServicosTomadosOptions {
  year: number;
  initialServicosTomados?: ServicoTomado[];
  onServicosTomadosChange?: (servicosTomados: ServicoTomado[]) => void;
}

export function useServicosTomados({ year, initialServicosTomados, onServicosTomadosChange }: UseServicosTomadosOptions) {
  const [servicosTomados, setServicosTomados] = useState<ServicoTomado[]>(initialServicosTomados || []);
  const [formData, setFormData] = useState<FormDataServicoTomado>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientCpf = useClientCpf();
  const location = useLocation();

  const loadServicosTomados = useCallback(async () => {
    const currentCpf = clientCpf;
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const response = await servicesTakenApi.listServicesTaken(year, currentCpf);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const servicosConvertidos: ServicoTomado[] = response.services.map((service) => ({
        id: service.id,
        nomePrestador: service.nomePrestador,
        cpfCnpj: service.cpfCnpj,
        tipoServico: service.tipoServico,
        valorTotal: convertValueFromBackend(service.valorTotal),
        valorReembolsado: service.valorReembolsado ? convertValueFromBackend(service.valorReembolsado) : undefined,
        observacoes: '',
      }));
      
      setServicosTomados(servicosConvertidos);
    } catch (err) {
      if (currentCpf === clientCpf) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar serviços tomados');
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
    
    loadServicosTomados();
  }, [loadServicosTomados, clientCpf, location.pathname, location.search]);

  useEffect(() => {
    if (initialServicosTomados) {
      setServicosTomados(initialServicosTomados);
    }
  }, [initialServicosTomados]);

  const updateServicosTomados = (newServicosTomados: ServicoTomado[]) => {
    setServicosTomados(newServicosTomados);
    onServicosTomadosChange?.(newServicosTomados);
  };

  const addServicoTomado = async (servicoTomado: ServicoTomado) => {
    try {
      setLoading(true);
      setError(null);
      
      const valorTotal = parseCurrencyValue(servicoTomado.valorTotal);
      const valorReembolsado = servicoTomado.valorReembolsado
        ? parseCurrencyValue(servicoTomado.valorReembolsado)
        : undefined;

      const response = await servicesTakenApi.createServiceTaken(year, {
        nomePrestador: servicoTomado.nomePrestador,
        cpfCnpj: servicoTomado.cpfCnpj,
        tipoServico: servicoTomado.tipoServico,
        valorTotal,
        valorReembolsado,
      }, clientCpf);

      const novoServico: ServicoTomado = {
        id: response.service.id,
        nomePrestador: response.service.nomePrestador,
        cpfCnpj: response.service.cpfCnpj,
        tipoServico: response.service.tipoServico,
        valorTotal: convertValueFromBackend(response.service.valorTotal),
        valorReembolsado: response.service.valorReembolsado
          ? convertValueFromBackend(response.service.valorReembolsado)
          : undefined,
        observacoes: '',
      };

      setServicosTomados((prev) => [...prev, novoServico]);
      onServicosTomadosChange?.([...servicosTomados, novoServico]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar serviço tomado');
      console.error('Erro ao criar serviço tomado:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServicoTomado = async (id: string, servicoTomadoAtualizado: ServicoTomado) => {
    try {
      setLoading(true);
      setError(null);
      
      const valorTotal = parseCurrencyValue(servicoTomadoAtualizado.valorTotal);
      const valorReembolsado = servicoTomadoAtualizado.valorReembolsado
        ? parseCurrencyValue(servicoTomadoAtualizado.valorReembolsado)
        : undefined;

      await servicesTakenApi.updateServiceTaken(year, id, {
        nomePrestador: servicoTomadoAtualizado.nomePrestador,
        cpfCnpj: servicoTomadoAtualizado.cpfCnpj,
        tipoServico: servicoTomadoAtualizado.tipoServico,
        valorTotal,
        valorReembolsado,
      }, clientCpf);

      setServicosTomados((prev) => prev.map((s) => (s.id === id ? servicoTomadoAtualizado : s)));
      onServicosTomadosChange?.(servicosTomados.map((s) => (s.id === id ? servicoTomadoAtualizado : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar serviço tomado');
      console.error('Erro ao atualizar serviço tomado:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteServicoTomado = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await servicesTakenApi.deleteServiceTaken(year, id, clientCpf);
      
      setServicosTomados((prev) => prev.filter((s) => s.id !== id));
      onServicosTomadosChange?.(servicosTomados.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar serviço tomado');
      console.error('Erro ao deletar serviço tomado:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const prepareEditForm = (servicoTomado: ServicoTomado) => {
    setFormData({
      nomePrestador: servicoTomado.nomePrestador,
      cpfCnpj: servicoTomado.cpfCnpj,
      tipoServico: servicoTomado.tipoServico,
      valorTotal: servicoTomado.valorTotal,
      valorReembolsado: servicoTomado.valorReembolsado || '',
      observacoes: servicoTomado.observacoes || '',
    });
    setEditingId(servicoTomado.id);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  return {
    servicosTomados,
    formData,
    setFormData,
    editingId,
    loading,
    error,
    updateServicosTomados,
    addServicoTomado,
    updateServicoTomado,
    deleteServicoTomado,
    prepareEditForm,
    resetForm,
    reload: loadServicosTomados,
  };
}

