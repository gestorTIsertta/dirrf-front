import api from '../config/api';
import { servicesTakenEndpoints } from '../config/endpoints';

export interface CreateServiceTakenRequest {
  nomePrestador: string;
  cpfCnpj: string;
  tipoServico: string;
  valorTotal: number;
  valorReembolsado?: number;
}

export interface UpdateServiceTakenRequest {
  nomePrestador?: string;
  cpfCnpj?: string;
  tipoServico?: string;
  valorTotal?: number;
  valorReembolsado?: number;
}

export interface ServiceDocument {
  fileName: string;
  storagePath: string;
  uploadedAt: string;
}

export interface ServiceTakenResponse {
  id: string;
  nomePrestador: string;
  cpfCnpj: string;
  tipoServico: string;
  valorTotal: number;
  valorReembolsado?: number;
  documentos: ServiceDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface ListServicesTakenResponse {
  services: ServiceTakenResponse[];
}

export interface CreateServiceTakenResponse {
  success: boolean;
  message: string;
  service: ServiceTakenResponse;
}

export interface UpdateServiceTakenResponse {
  success: boolean;
  message: string;
}

export interface DeleteServiceTakenResponse {
  success: boolean;
  message: string;
}

export interface UploadDocumentsResponse {
  success: boolean;
  message: string;
  filesUploaded: number;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

export async function listServicesTaken(
  year: number,
  cpf?: string | null
): Promise<ListServicesTakenResponse> {
  let url = servicesTakenEndpoints.list(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.get<ListServicesTakenResponse>(url);
  return response.data;
}

export async function createServiceTaken(
  year: number,
  data: CreateServiceTakenRequest,
  cpf?: string | null
): Promise<CreateServiceTakenResponse> {
  let url = servicesTakenEndpoints.create(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.post<CreateServiceTakenResponse>(url, data);
  return response.data;
}

export async function updateServiceTaken(
  year: number,
  serviceId: string,
  data: UpdateServiceTakenRequest,
  cpf?: string | null
): Promise<UpdateServiceTakenResponse> {
  let url = servicesTakenEndpoints.update(year, serviceId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.patch<UpdateServiceTakenResponse>(url, data);
  return response.data;
}

export async function deleteServiceTaken(
  year: number,
  serviceId: string,
  cpf?: string | null
): Promise<DeleteServiceTakenResponse> {
  let url = servicesTakenEndpoints.delete(year, serviceId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<DeleteServiceTakenResponse>(url);
  return response.data;
}

export async function uploadServiceDocuments(
  year: number,
  serviceId: string,
  files: File[],
  cpf?: string | null
): Promise<UploadDocumentsResponse> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('file', file);
  });

  let url = servicesTakenEndpoints.uploadDocuments(year, serviceId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }

  const response = await api.post<UploadDocumentsResponse>(url, formData);
  
  return response.data;
}

export async function deleteServiceDocument(
  year: number,
  serviceId: string,
  storagePath: string,
  cpf?: string | null
): Promise<DeleteDocumentResponse> {
  let url = servicesTakenEndpoints.deleteDocument(year, serviceId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<DeleteDocumentResponse>(url, {
    data: { storagePath },
  });
  return response.data;
}

