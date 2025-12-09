import { useState } from 'react';

export function useDeleteModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const openModal = (item: T) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = (onConfirm: (item: T) => void) => {
    if (itemToDelete) {
      onConfirm(itemToDelete);
      closeModal();
    }
  };

  return {
    isOpen,
    itemToDelete,
    openModal,
    closeModal,
    confirmDelete,
  };
}

