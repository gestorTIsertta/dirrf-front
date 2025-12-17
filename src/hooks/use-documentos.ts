import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Documento } from 'src/types/declaracao';
import * as incomeDocumentsApi from 'src/api/requests/income-documents';
import * as documentsApi from 'src/api/requests/documents';
import { useClientCpf } from 'src/hooks/use-contador-context';

interface UseDocumentosOptions {
  year: number;
}

export function useDocumentos({ year }: UseDocumentosOptions) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientCpf = useClientCpf();
  const location = useLocation();

  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Enviado hoje';
    if (diffInDays === 1) return 'Enviado há 1 dia';
    if (diffInDays < 7) return `Enviado há ${diffInDays} dias`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Enviado há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    const months = Math.floor(diffInDays / 30);
    return `Enviado há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  };

  const loadDocumentos = useCallback(async () => {
    const currentCpf = clientCpf;
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const response = await incomeDocumentsApi.listIncomeDocuments(year, undefined, currentCpf);
      
      if (currentCpf !== clientCpf) {
        return;
      }
      
      const documentosConvertidos: Documento[] = response.documents.map((doc, index) => ({
        id: doc.storagePath || `doc-${index}`,
        nome: doc.fileName,
        categoria: doc.categoria || 'Outros',
        tamanho: 'N/A',
        status: 'Enviado',
        info: formatRelativeDate(doc.uploadedAt),
        storagePath: doc.storagePath,
        uploadedAt: doc.uploadedAt,
      }));
      
      setDocumentos(documentosConvertidos);
    } catch (err) {
      if (currentCpf === clientCpf) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
        setDocumentos([]);
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
    
    loadDocumentos();
  }, [loadDocumentos, clientCpf, location.pathname, location.search]);

  const deleteDocumento = async (id: number | string) => {
    try {
      setLoading(true);
      setError(null);
      
      const documento = documentos.find((d) => d.id === id);
      if (documento?.storagePath) {
        await incomeDocumentsApi.removeIncomeDocument(year, documento.storagePath, clientCpf);
        setDocumentos((prev) => prev.filter((d) => d.id !== id));
      } else {
        setDocumentos((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar documento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const visualizarDocumento = async (doc: Documento) => {
    try {
      if (doc.storagePath) {
        const documentData = await documentsApi.getDocument(doc.storagePath);
        const blob = documentsApi.base64ToBlob(documentData.base64, documentData.mimeType);
        const blobUrl = URL.createObjectURL(blob);
        
        window.open(blobUrl, '_blank');
        
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } else {
        const url = `#/documento/${doc.id}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      alert('Erro ao carregar o documento. Tente novamente.');
    }
  };

  return {
    documentos,
    setDocumentos,
    deleteDocumento,
    visualizarDocumento,
    loading,
    error,
    reload: loadDocumentos,
  };
}

