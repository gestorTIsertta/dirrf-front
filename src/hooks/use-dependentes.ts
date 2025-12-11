import { useState, useEffect } from 'react';
import { Dependente, FormDataDependente } from 'src/types/declaracao';

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
  initialDependentes?: Dependente[];
  onDependentesChange?: (dependentes: Dependente[]) => void;
}

export function useDependentes({ initialDependentes, onDependentesChange }: UseDependentesOptions = {}) {
  const [dependentes, setDependentes] = useState<Dependente[]>(initialDependentes || []);
  const [formData, setFormData] = useState<FormDataDependente>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialDependentes) {
      setDependentes(initialDependentes);
    }
  }, [initialDependentes]);

  const updateDependentes = (newDependentes: Dependente[]) => {
    setDependentes(newDependentes);
    onDependentesChange?.(newDependentes);
  };

  const addDependente = (dependente: Dependente) => {
    setDependentes((prev) => [...prev, dependente]);
  };

  const updateDependente = (id: string, dependenteAtualizado: Dependente) => {
    setDependentes((prev) => prev.map((d) => (d.id === id ? dependenteAtualizado : d)));
  };

  const deleteDependente = (id: string) => {
    setDependentes((prev) => prev.filter((d) => d.id !== id));
  };

  const prepareEditForm = (dependente: Dependente) => {
    setFormData({
      nomeCompleto: dependente.nomeCompleto,
      cpf: dependente.cpf,
      dataNascimento: dependente.dataNascimento,
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
    updateDependentes,
    addDependente,
    updateDependente,
    deleteDependente,
    prepareEditForm,
    resetForm,
  };
}

