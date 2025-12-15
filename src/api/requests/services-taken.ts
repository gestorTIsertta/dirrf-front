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

export async function listServicesTaken(year: number): Promise<ListServicesTakenResponse> {
  const response = await api.get<ListServicesTakenResponse>(servicesTakenEndpoints.list(year));
  return response.data;
}

export async function createServiceTaken(
  year: number,
  data: CreateServiceTakenRequest
): Promise<CreateServiceTakenResponse> {
  const response = await api.post<CreateServiceTakenResponse>(
    servicesTakenEndpoints.create(year),
    data
  );
  return response.data;
}

export async function updateServiceTaken(
  year: number,
  serviceId: string,
  data: UpdateServiceTakenRequest
): Promise<UpdateServiceTakenResponse> {
  const response = await api.patch<UpdateServiceTakenResponse>(
    servicesTakenEndpoints.update(year, serviceId),
    data
  );
  return response.data;
}

export async function deleteServiceTaken(
  year: number,
  serviceId: string
): Promise<DeleteServiceTakenResponse> {
  const response = await api.delete<DeleteServiceTakenResponse>(
    servicesTakenEndpoints.delete(year, serviceId)
  );
  return response.data;
}

export async function uploadServiceDocuments(
  year: number,
  serviceId: string,
  files: File[]
): Promise<UploadDocumentsResponse> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('file', file);
  });

  const response = await api.post<UploadDocumentsResponse>(
    servicesTakenEndpoints.uploadDocuments(year, serviceId),
    formData
  );
  
  return response.data;
}

export async function deleteServiceDocument(
  year: number,
  serviceId: string,
  storagePath: string
): Promise<DeleteDocumentResponse> {
  const response = await api.delete<DeleteDocumentResponse>(
    servicesTakenEndpoints.deleteDocument(year, serviceId),
    {
      data: { storagePath },
    }
  );
  return response.data;
}

