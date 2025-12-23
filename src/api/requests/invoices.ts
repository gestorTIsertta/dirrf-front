import api from 'src/api/config/api';

export interface Invoice {
  id: string;
  number: string;
  type: string;
  issueDate: string;
  emitterName: string;
  totalValue: number;
  status: string;
}

export interface ListInvoicesResponse {
  invoices: Invoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListInvoicesParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface IRPFDeclaration {
  id: string;
  cpf: string;
  calendarYear: number;
  exerciseYear: number;
  [key: string]: unknown; // Estrutura complexa, usando unknown para flexibilidade
}

export interface GetInvoiceDetailsResponse {
  id: string;
  clientId: string;
  number: string;
  type: string;
  [key: string]: unknown; // Estrutura complexa do invoice
}

export interface ListIRPFDeclarationsResponse {
  cpf: string;
  declarations: IRPFDeclaration[];
}

/**
 * Lista invoices de um cliente (requer autenticação de backoffice)
 */
export async function listInvoices(
  clientId: string,
  params?: ListInvoicesParams
): Promise<ListInvoicesResponse> {
  const response = await api.get<ListInvoicesResponse>(`/invoices/clients/${clientId}`, { params });
  return response.data;
}

/**
 * Busca detalhes de uma invoice específica (requer autenticação de backoffice)
 */
export async function getInvoiceDetails(clientId: string, invoiceId: string): Promise<GetInvoiceDetailsResponse> {
  const response = await api.get<GetInvoiceDetailsResponse>(`/irpf-uploads/clients/${clientId}/${invoiceId}`);
  return response.data;
}

/**
 * Lista declarações de IRPF de um cliente por CPF (requer autenticação de backoffice)
 */
export async function listIRPFDeclarations(cpf: string): Promise<IRPFDeclaration[]> {
  const response = await api.get<ListIRPFDeclarationsResponse>(`/irpf-uploads/clients/${cpf}`);
  return response.data.declarations;
}

export interface UploadInvoiceResponse {
  success: boolean;
  message: string;
  client: {
    id: string;
    name: string;
    document: string;
    type: 'PF' | 'PJ';
  };
  invoice: {
    id: string;
    number: string;
    type: string;
    totalValue: number;
    status: string;
  };
}

/**
 * Faz upload de uma invoice (arquivo PDF) - Requer autenticação de backoffice
 */
export async function uploadInvoice(file: File): Promise<UploadInvoiceResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadInvoiceResponse>('/irpf-uploads/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

