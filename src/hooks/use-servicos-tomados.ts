import { useState, useEffect } from 'react';
import { ServicoTomado, FormDataServicoTomado } from 'src/types/declaracao';

const initialFormData: FormDataServicoTomado = {
  nomePrestador: '',
  cpfCnpj: '',
  tipoServico: '',
  valorTotal: '',
  valorReembolsado: '',
  observacoes: '',
};

interface UseServicosTomadosOptions {
  initialServicosTomados?: ServicoTomado[];
  onServicosTomadosChange?: (servicosTomados: ServicoTomado[]) => void;
}

export function useServicosTomados({ initialServicosTomados, onServicosTomadosChange }: UseServicosTomadosOptions = {}) {
  const [servicosTomados, setServicosTomados] = useState<ServicoTomado[]>(initialServicosTomados || []);
  const [formData, setFormData] = useState<FormDataServicoTomado>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialServicosTomados) {
      setServicosTomados(initialServicosTomados);
    }
  }, [initialServicosTomados]);

  const updateServicosTomados = (newServicosTomados: ServicoTomado[]) => {
    setServicosTomados(newServicosTomados);
    onServicosTomadosChange?.(newServicosTomados);
  };

  const addServicoTomado = (servicoTomado: ServicoTomado) => {
    setServicosTomados((prev) => [...prev, servicoTomado]);
  };

  const updateServicoTomado = (id: string, servicoTomadoAtualizado: ServicoTomado) => {
    setServicosTomados((prev) => prev.map((s) => (s.id === id ? servicoTomadoAtualizado : s)));
  };

  const deleteServicoTomado = (id: string) => {
    setServicosTomados((prev) => prev.filter((s) => s.id !== id));
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
    updateServicosTomados,
    addServicoTomado,
    updateServicoTomado,
    deleteServicoTomado,
    prepareEditForm,
    resetForm,
  };
}

