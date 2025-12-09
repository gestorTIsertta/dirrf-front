import { useState } from 'react';
import { ItemDeclarado, FormDataCompraVenda } from 'src/types/declaracao';
import { itensMock } from 'src/constants/declaracao';
import { formatDateToInput } from 'src/utils/date-format';

const initialFormData: FormDataCompraVenda = {
  tipo: '',
  data: '',
  valor: '',
  descricao: '',
  comprovante: null,
  bancoId: '',
};

export function useItens() {
  const [itens, setItens] = useState<ItemDeclarado[]>(itensMock);
  const [formData, setFormData] = useState<FormDataCompraVenda>(initialFormData);

  const updateItem = (itemAtualizado: ItemDeclarado) => {
    setItens((prev) => prev.map((i) => (i.id === itemAtualizado.id ? itemAtualizado : i)));
  };

  const deleteItem = (id: number) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const prepareEditForm = (item: ItemDeclarado) => {
    setFormData({
      tipo: item.tipo,
      data: formatDateToInput(item.data),
      valor: item.valor,
      descricao: '',
      comprovante: null,
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
    updateItem,
    deleteItem,
    prepareEditForm,
    resetForm,
  };
}

