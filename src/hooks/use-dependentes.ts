import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Dependente, FormDataDependente } from 'src/types/declaracao';
import { formatDateToInput } from 'src/utils/date-format';
import { convertDateFromBackend, convertDateToBackend } from 'src/api/utils/converters';
import * as dependentsApi from 'src/api/requests/dependents';
import { useClientCpf } from 'src/hooks/use-contador-context';

const initialFormData: FormDataDependente = {
  nomeCompleto: '',
  cpf: '',
  dataNascimento: '',
  grauParentesco: '',
  nomeMae: '',
  nacionalidade: '',
  sexo: '',
};

interface UseDependentesOptions {
  year: number;
  initialDependentes?: Dependente[];
  onDependentesChange?: (dependentes: Dependente[]) => void;
}

export function useDependentes({ year, initialDependentes, onDependentesChange }: UseDependentesOptions) {
  const [dependentes, setDependentes] = useState<Dependente[]>(initialDependentes || []);
  const [formData, setFormData] = useState<FormDataDependente>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientCpf = useClientCpf();
  const location = useLocation();

  const loadDependentes = useCallback(async () => {
    const currentCpf = clientCpf;
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const response = await dependentsApi.listDependents(year, currentCpf);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const dependentesConvertidos: Dependente[] = response.dependents.map((dependent) => ({
        id: dependent.id,
        nomeCompleto: dependent.nomeCompleto,
        cpf: dependent.cpf,
        dataNascimento: convertDateFromBackend(dependent.dataNascimento),
        grauParentesco: dependent.grauParentesco,
        nomeMae: dependent.nomeMae,
        nacionalidade: dependent.nacionalidade,
        sexo: dependent.sexo as 'Masculino' | 'Feminino' | 'Outro' | undefined,
      }));
      
      setDependentes(dependentesConvertidos);
    } catch (err) {
      if (currentCpf === clientCpf) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dependentes');
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
    
    loadDependentes();
  }, [loadDependentes, clientCpf, location.pathname, location.search]);

  useEffect(() => {
    if (initialDependentes) {
      setDependentes(initialDependentes);
    }
  }, [initialDependentes]);

  const updateDependentes = (newDependentes: Dependente[]) => {
    setDependentes(newDependentes);
    onDependentesChange?.(newDependentes);
  };

  const addDependente = async (dependente: Dependente) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dependentsApi.createDependent(year, {
        nomeCompleto: dependente.nomeCompleto,
        cpf: dependente.cpf,
        dataNascimento: convertDateToBackend(dependente.dataNascimento),
        grauParentesco: dependente.grauParentesco,
        nomeMae: dependente.nomeMae,
        nacionalidade: dependente.nacionalidade,
        sexo: dependente.sexo,
      }, clientCpf);

      const novoDependente: Dependente = {
        id: response.dependent.id,
        nomeCompleto: response.dependent.nomeCompleto,
        cpf: response.dependent.cpf,
        dataNascimento: convertDateFromBackend(response.dependent.dataNascimento),
        grauParentesco: response.dependent.grauParentesco,
        nomeMae: response.dependent.nomeMae,
        nacionalidade: response.dependent.nacionalidade,
        sexo: response.dependent.sexo as 'Masculino' | 'Feminino' | 'Outro' | undefined,
      };

      setDependentes((prev) => [...prev, novoDependente]);
      onDependentesChange?.([...dependentes, novoDependente]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar dependente');
      console.error('Erro ao criar dependente:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDependente = async (id: string, dependenteAtualizado: Dependente) => {
    try {
      setLoading(true);
      setError(null);
      
      await dependentsApi.updateDependent(year, id, {
        nomeCompleto: dependenteAtualizado.nomeCompleto,
        cpf: dependenteAtualizado.cpf,
        dataNascimento: convertDateToBackend(dependenteAtualizado.dataNascimento),
        grauParentesco: dependenteAtualizado.grauParentesco,
        nomeMae: dependenteAtualizado.nomeMae,
        nacionalidade: dependenteAtualizado.nacionalidade,
        sexo: dependenteAtualizado.sexo,
      }, clientCpf);

      setDependentes((prev) => prev.map((d) => (d.id === id ? dependenteAtualizado : d)));
      onDependentesChange?.(dependentes.map((d) => (d.id === id ? dependenteAtualizado : d)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dependente');
      console.error('Erro ao atualizar dependente:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDependente = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await dependentsApi.deleteDependent(year, id, clientCpf);
      
      setDependentes((prev) => prev.filter((d) => d.id !== id));
      onDependentesChange?.(dependentes.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar dependente');
      console.error('Erro ao deletar dependente:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const prepareEditForm = (dependente: Dependente) => {
    setFormData({
      nomeCompleto: dependente.nomeCompleto,
      cpf: dependente.cpf,
      dataNascimento: formatDateToInput(dependente.dataNascimento),
      grauParentesco: dependente.grauParentesco,
      nomeMae: dependente.nomeMae || '',
      nacionalidade: dependente.nacionalidade || '',
      sexo: dependente.sexo || '',
    });
    setEditingId(dependente.id);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  return {
    dependentes,
    formData,
    setFormData,
    editingId,
    loading,
    error,
    updateDependentes,
    addDependente,
    updateDependente,
    deleteDependente,
    prepareEditForm,
    resetForm,
    reload: loadDependentes,
  };
}

