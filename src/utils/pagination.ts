import { useState, useEffect, useCallback } from 'react';

interface UsePaginationOptions {
  defaultRowsPerPage?: number;
  totalItems: number;
}

interface UsePaginationReturn {
  page: number;
  rowsPerPage: number;
  handleChangePage: (_event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetPage: () => void;
}

export function usePagination({ defaultRowsPerPage = 10, totalItems }: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= totalItems) {
      setPage(0);
    }
  }, [totalItems, page, rowsPerPage]);

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  };
}

export function paginateItems<T>(items: T[], page: number, rowsPerPage: number): T[] {
  return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

