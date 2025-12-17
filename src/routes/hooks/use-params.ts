import { useParams as useRouterParams } from 'react-router-dom';

export function useParams<T extends Record<string, string>>(): T {
  return useRouterParams() as T;
}

