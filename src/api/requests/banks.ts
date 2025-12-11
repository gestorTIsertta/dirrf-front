import api from '../config/api';
import { banksEndpoints } from '../config/endpoints';
export interface CreateBankRequest {
  nome: string;
  conta: string;
  agencia: string;
  tipoConta: 'corrente' | 'poupanca' | 'salario' | 'investimento' | 'outro';
  dataAbertura: string;
}

export interface UpdateBankRequest {
  nome?: string;
  conta?: string;
  agencia?: string;
  tipoConta?: 'corrente' | 'poupanca' | 'salario' | 'investimento' | 'outro';
  dataAbertura?: string; // ISO datetime string
}

export interface BankResponse {
  id: string;
  nome: string;
  conta: string;
  agencia: string;
  tipoConta: 'corrente' | 'poupanca' | 'salario' | 'investimento' | 'outro';
  dataAbertura: string;
  informeRendimento?: {
    fileName: string;
    storagePath: string;
    uploadedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ListBanksResponse {
  banks: BankResponse[];
}

export interface CreateBankResponse {
  success: boolean;
  message: string;
  bank: BankResponse;
}

export interface UpdateBankResponse {
  success: boolean;
  message: string;
}

export interface DeleteBankResponse {
  success: boolean;
  message: string;
}

export interface UploadInformeResponse {
  success: boolean;
  message: string;
}

export async function listBanks(year: number): Promise<ListBanksResponse> {
  const response = await api.get<ListBanksResponse>(banksEndpoints.list(year));
  return response.data;
}

export async function createBank(year: number, data: CreateBankRequest): Promise<CreateBankResponse> {
  const response = await api.post<CreateBankResponse>(banksEndpoints.create(year), data);
  return response.data;
}

export async function updateBank(
  year: number,
  bankId: string,
  data: UpdateBankRequest
): Promise<UpdateBankResponse> {
  const response = await api.patch<UpdateBankResponse>(banksEndpoints.update(year, bankId), data);
  return response.data;
}

export async function deleteBank(year: number, bankId: string): Promise<DeleteBankResponse> {
  const response = await api.delete<DeleteBankResponse>(banksEndpoints.delete(year, bankId));
  return response.data;
}

export async function uploadInforme(
  year: number,
  bankId: string,
  file: File
): Promise<UploadInformeResponse> {
  if (!file || !(file instanceof File)) {
    throw new Error('Arquivo inválido. Por favor, selecione um arquivo válido.');
  }

  if (file.size === 0) {
    throw new Error('O arquivo está vazio. Por favor, selecione um arquivo válido.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadInformeResponse>(
    banksEndpoints.uploadInforme(year, bankId),
    formData
  );
  return response.data;
}

