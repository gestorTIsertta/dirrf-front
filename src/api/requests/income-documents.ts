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
  bankId?: string
): Promise<ListIncomeDocumentsResponse> {
  const response = await api.get<ListIncomeDocumentsResponse>(
    incomeDocumentsEndpoints.list(year, bankId)
  );
  return response.data;
}

export async function uploadIncomeDocument(
  year: number,
  data: UploadIncomeDocumentRequest
): Promise<UploadIncomeDocumentResponse> {
  const formData = new FormData();
  formData.append('file', data.file);
  if (data.categoria) {
    formData.append('categoria', data.categoria);
  }
  if (data.bankId) {
    formData.append('bankId', data.bankId);
  }

  const response = await api.post<UploadIncomeDocumentResponse>(
    incomeDocumentsEndpoints.upload(year),
    formData
  );
  return response.data;
}

export async function removeIncomeDocument(
  year: number,
  storagePath: string
): Promise<RemoveIncomeDocumentResponse> {
  const response = await api.delete<RemoveIncomeDocumentResponse>(
    incomeDocumentsEndpoints.remove(year),
    {
      data: { storagePath },
    }
  );
  return response.data;
}

