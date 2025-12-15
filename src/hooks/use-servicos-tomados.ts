import { useState, useEffect, useCallback } from 'react';
import { ServicoTomado, FormDataServicoTomado } from 'src/types/declaracao';
import { convertValueFromBackend } from 'src/api/utils/converters';
import * as servicesTakenApi from 'src/api/requests/services-taken';

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

  const loadServicosTomados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesTakenApi.listServicesTaken(year);
      
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
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços tomados');
      console.error('Erro ao carregar serviços tomados:', err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    loadServicosTomados();
  }, [loadServicosTomados]);

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
      
      const valorTotal = parseFloat(servicoTomado.valorTotal.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const valorReembolsado = servicoTomado.valorReembolsado
        ? parseFloat(servicoTomado.valorReembolsado.replace(/[^\d,]/g, '').replace(',', '.')) || 0
        : undefined;

      const response = await servicesTakenApi.createServiceTaken(year, {
        nomePrestador: servicoTomado.nomePrestador,
        cpfCnpj: servicoTomado.cpfCnpj,
        tipoServico: servicoTomado.tipoServico,
        valorTotal,
        valorReembolsado,
      });

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
      
      const valorTotal = parseFloat(servicoTomadoAtualizado.valorTotal.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const valorReembolsado = servicoTomadoAtualizado.valorReembolsado
        ? parseFloat(servicoTomadoAtualizado.valorReembolsado.replace(/[^\d,]/g, '').replace(',', '.')) || 0
        : undefined;

      await servicesTakenApi.updateServiceTaken(year, id, {
        nomePrestador: servicoTomadoAtualizado.nomePrestador,
        cpfCnpj: servicoTomadoAtualizado.cpfCnpj,
        tipoServico: servicoTomadoAtualizado.tipoServico,
        valorTotal,
        valorReembolsado,
      });

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
      
      await servicesTakenApi.deleteServiceTaken(year, id);
      
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

