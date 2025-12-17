import api from '../config/api';
import { transactionsEndpoints } from '../config/endpoints';
export type TransactionCategory =
  | 'imovel'
  | 'veiculo'
  | 'investimento'
  | 'acoes'
  | 'criptomoeda'
  | 'joia'
  | 'arte'
  | 'outro';

export type TransactionType = 'compra' | 'venda';

export interface CreateTransactionRequest {
  categoria: TransactionCategory;
  tipo: TransactionType;
  data: string;
  valor: number;
  descricao: string;
  bancoId?: string;
}

export interface UpdateTransactionRequest {
  categoria?: TransactionCategory;
  tipo?: TransactionType;
  data?: string;
  valor?: number;
  descricao?: string;
  bancoId?: string;
}

export interface TransactionComprovante {
  fileName: string;
  storagePath: string;
  uploadedAt: string;
}

export interface TransactionResponse {
  id: string;
  categoria: TransactionCategory;
  tipo: TransactionType;
  data: string;
  valor: number;
  descricao: string;
  bancoId?: string;
  comprovantes: TransactionComprovante[];
  createdAt: string;
  updatedAt: string;
}

export interface ListTransactionsResponse {
  transactions: TransactionResponse[];
}

export interface CreateTransactionResponse {
  success: boolean;
  message: string;
  transaction: TransactionResponse;
}

export interface UpdateTransactionResponse {
  success: boolean;
  message: string;
}

export interface DeleteTransactionResponse {
  success: boolean;
  message: string;
}

export interface UploadComprovantesResponse {
  success: boolean;
  message: string;
  filesUploaded: number;
}

export interface DeleteComprovanteResponse {
  success: boolean;
  message: string;
}

export async function listTransactions(
  year: number,
  cpf?: string | null
): Promise<ListTransactionsResponse> {
  let url = transactionsEndpoints.list(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.get<ListTransactionsResponse>(url);
  return response.data;
}

export async function createTransaction(
  year: number,
  data: CreateTransactionRequest,
  cpf?: string | null
): Promise<CreateTransactionResponse> {
  let url = transactionsEndpoints.create(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.post<CreateTransactionResponse>(url, data);
  return response.data;
}

export async function updateTransaction(
  year: number,
  transactionId: string,
  data: UpdateTransactionRequest,
  cpf?: string | null
): Promise<UpdateTransactionResponse> {
  let url = transactionsEndpoints.update(year, transactionId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.patch<UpdateTransactionResponse>(url, data);
  return response.data;
}

export async function deleteTransaction(
  year: number,
  transactionId: string,
  cpf?: string | null
): Promise<DeleteTransactionResponse> {
  let url = transactionsEndpoints.delete(year, transactionId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<DeleteTransactionResponse>(url);
  return response.data;
}

export async function uploadComprovantes(
  year: number,
  transactionId: string,
  files: File[],
  cpf?: string | null
): Promise<UploadComprovantesResponse> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('file', file);
  });

  let url = transactionsEndpoints.uploadComprovantes(year, transactionId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }

  const response = await api.post<UploadComprovantesResponse>(url, formData);
  
  return response.data;
}

export async function deleteComprovante(
  year: number,
  transactionId: string,
  storagePath: string,
  cpf?: string | null
): Promise<DeleteComprovanteResponse> {
  let url = transactionsEndpoints.deleteComprovante(year, transactionId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<DeleteComprovanteResponse>(url, {
    data: { storagePath },
  });
  return response.data;
}

