import api from '../config/api';
import { incomeDocumentsEndpoints } from '../config/endpoints';

export interface IncomeDocumentResponse {
  fileName: string;
  storagePath: string;
  uploadedAt: string;
  categoria?: string;
}

export interface ListIncomeDocumentsResponse {
  documents: IncomeDocumentResponse[];
}

export interface UploadIncomeDocumentRequest {
  file: File;
  categoria?: string;
  bankId?: string;
}

export interface UploadIncomeDocumentResponse {
  success: boolean;
  message: string;
}

export interface RemoveIncomeDocumentResponse {
  success: boolean;
  message: string;
}

export async function listIncomeDocuments(
  year: number,
  bankId?: string,
  cpf?: string | null
): Promise<ListIncomeDocumentsResponse> {
  let url = incomeDocumentsEndpoints.list(year, bankId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}cpf=${cleanCpf}`;
  }
  const response = await api.get<ListIncomeDocumentsResponse>(url);
  return response.data;
}

export async function uploadIncomeDocument(
  year: number,
  data: UploadIncomeDocumentRequest,
  cpf?: string | null
): Promise<UploadIncomeDocumentResponse> {
  const formData = new FormData();
  formData.append('file', data.file);
  if (data.categoria) {
    formData.append('categoria', data.categoria);
  }
  if (data.bankId) {
    formData.append('bankId', data.bankId);
  }

  let url = incomeDocumentsEndpoints.upload(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }

  const response = await api.post<UploadIncomeDocumentResponse>(url, formData);
  return response.data;
}

export async function removeIncomeDocument(
  year: number,
  storagePath: string,
  cpf?: string | null
): Promise<RemoveIncomeDocumentResponse> {
  let url = incomeDocumentsEndpoints.remove(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<RemoveIncomeDocumentResponse>(url, {
    data: { storagePath },
  });
  return response.data;
}

