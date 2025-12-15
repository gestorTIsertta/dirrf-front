import { useState, useCallback } from 'react';

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

