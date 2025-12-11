import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar o ano da declaração
 * O ano é usado em todas as requisições de bancos e transações
 */
export function useDeclaracaoYear() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  const changeYear = useCallback((newYear: number) => {
    if (newYear >= 2000 && newYear <= 2100) {
      setYear(newYear);
    }
  }, []);

  return {
    year,
    setYear: changeYear,
  };
}

