import api from '../config/api';
import { documentsEndpoints } from '../config/endpoints';
export interface GetDocumentRequest {
  storagePath: string;
}

export interface GetDocumentResponse {
  fileName: string;
  mimeType: string;
  base64: string;
}

export async function getDocument(storagePath: string): Promise<GetDocumentResponse> {
  const response = await api.post<GetDocumentResponse>(documentsEndpoints.get(), {
    storagePath,
  });
  return response.data;
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export function base64ToDataUrl(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

