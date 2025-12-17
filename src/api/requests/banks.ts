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
  dataAbertura?: string;
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

export async function listBanks(
  year: number,
  cpf?: string | null
): Promise<ListBanksResponse> {
  let url = banksEndpoints.list(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.get<ListBanksResponse>(url);
  return response.data;
}

export async function createBank(
  year: number,
  data: CreateBankRequest,
  cpf?: string | null
): Promise<CreateBankResponse> {
  let url = banksEndpoints.create(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.post<CreateBankResponse>(url, data);
  return response.data;
}

export async function updateBank(
  year: number,
  bankId: string,
  data: UpdateBankRequest,
  cpf?: string | null
): Promise<UpdateBankResponse> {
  let url = banksEndpoints.update(year, bankId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.patch<UpdateBankResponse>(url, data);
  return response.data;
}

export async function deleteBank(
  year: number,
  bankId: string,
  cpf?: string | null
): Promise<DeleteBankResponse> {
  let url = banksEndpoints.delete(year, bankId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<DeleteBankResponse>(url);
  return response.data;
}

export async function uploadInforme(
  year: number,
  bankId: string,
  file: File,
  cpf?: string | null
): Promise<UploadInformeResponse> {
  if (!file || !(file instanceof File)) {
    throw new Error('Arquivo inválido. Por favor, selecione um arquivo válido.');
  }

  if (file.size === 0) {
    throw new Error('O arquivo está vazio. Por favor, selecione um arquivo válido.');
  }

  const formData = new FormData();
  formData.append('file', file);

  let url = banksEndpoints.uploadInforme(year, bankId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }

  const response = await api.post<UploadInformeResponse>(url, formData);
  return response.data;
}

