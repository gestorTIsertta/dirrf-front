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

export async function listTransactions(year: number): Promise<ListTransactionsResponse> {
  const response = await api.get<ListTransactionsResponse>(transactionsEndpoints.list(year));
  return response.data;
}

export async function createTransaction(
  year: number,
  data: CreateTransactionRequest
): Promise<CreateTransactionResponse> {
  const response = await api.post<CreateTransactionResponse>(
    transactionsEndpoints.create(year),
    data
  );
  return response.data;
}

export async function updateTransaction(
  year: number,
  transactionId: string,
  data: UpdateTransactionRequest
): Promise<UpdateTransactionResponse> {
  const response = await api.patch<UpdateTransactionResponse>(
    transactionsEndpoints.update(year, transactionId),
    data
  );
  return response.data;
}

export async function deleteTransaction(
  year: number,
  transactionId: string
): Promise<DeleteTransactionResponse> {
  const response = await api.delete<DeleteTransactionResponse>(
    transactionsEndpoints.delete(year, transactionId)
  );
  return response.data;
}

export async function uploadComprovantes(
  year: number,
  transactionId: string,
  files: File[]
): Promise<UploadComprovantesResponse> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('file', file);
  });

  const response = await api.post<UploadComprovantesResponse>(
    transactionsEndpoints.uploadComprovantes(year, transactionId),
    formData
  );
  
  return response.data;
}

export async function deleteComprovante(
  year: number,
  transactionId: string,
  storagePath: string
): Promise<DeleteComprovanteResponse> {
  const response = await api.delete<DeleteComprovanteResponse>(
    transactionsEndpoints.deleteComprovante(year, transactionId),
    {
      data: { storagePath },
    }
  );
  return response.data;
}

