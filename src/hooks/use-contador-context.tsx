import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ContadorContextType {
  isContador: boolean;
  selectedClientCpf: string | null;
  setSelectedClientCpf: (cpf: string | null) => void;
}

const ContadorContext = createContext<ContadorContextType | undefined>(undefined);

export function ContadorProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isContador = location.pathname.startsWith('/contador');
  
  const getCpfFromQuery = (pathname: string, search: string): string | null => {
    if (pathname === '/declaracao') {
      const searchParams = new URLSearchParams(search);
      const cpfFromQuery = searchParams.get('cpf');
      if (cpfFromQuery) {
        const cleanCpf = cpfFromQuery.replace(/\D/g, '');
        if (cleanCpf.length >= 11) {
          return cleanCpf;
        }
      }
    }
    return null;
  };
  
  const [selectedClientCpf, setSelectedClientCpf] = useState<string | null>(() => {
    return getCpfFromQuery(location.pathname, location.search);
  });
  
  const queryCpfRef = useRef<string | null>(getCpfFromQuery(location.pathname, location.search));

  useEffect(() => {
    const newCpf = getCpfFromQuery(location.pathname, location.search);
    
    if (location.pathname === '/declaracao') {
      if (newCpf) {
        queryCpfRef.current = newCpf;
        
        if (selectedClientCpf !== newCpf) {
          setSelectedClientCpf(null);
          
          requestAnimationFrame(() => {
            if (queryCpfRef.current === newCpf) {
              setSelectedClientCpf(newCpf);
            }
          });
        }
      } else {
        queryCpfRef.current = null;
        setSelectedClientCpf(null);
      }
    } else if (location.pathname.startsWith('/contador')) {
      if (selectedClientCpf) {
        queryCpfRef.current = null;
        setSelectedClientCpf(null);
      }
    } else {
      if (!location.search.includes('cpf=') && selectedClientCpf) {
        queryCpfRef.current = null;
        setSelectedClientCpf(null);
      }
    }
  }, [location.pathname, location.search, selectedClientCpf]);

  return (
    <ContadorContext.Provider value={{ isContador, selectedClientCpf, setSelectedClientCpf }}>
      {children}
    </ContadorContext.Provider>
  );
}

export function useContadorContext() {
  const context = useContext(ContadorContext);
  if (context === undefined) {
    throw new Error('useContadorContext must be used within a ContadorProvider');
  }
  return context;
}

export function useClientCpf(): string | null {
  const { selectedClientCpf } = useContadorContext();
  return selectedClientCpf;
}

