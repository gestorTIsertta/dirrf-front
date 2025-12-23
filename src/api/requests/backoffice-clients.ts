import api from 'src/api/config/api';
import { backofficeClientsEndpoints } from 'src/api/config/endpoints';

export type ClientStatus = 'Em Preenchimento' | 'Em análise' | 'Aprovado';

export interface Client {
  id: string; // CPF ou CNPJ sem formatação
  type: 'PF' | 'PJ';
  name: string;
  document: string; // CPF ou CNPJ sem formatação
  documentFormatted: string; // CPF ou CNPJ formatado
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: ClientStatus;
  totalInvoices: number;
  totalValue: number;
  lastInvoiceDate?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  archived: boolean;
}

export interface ListClientsResponse {
  clients: Client[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListClientsParams {
  page?: number;
  limit?: number;
  type?: 'PF' | 'PJ';
  archived?: boolean;
  anoExercicio?: number;
}

export type GetClientResponse = Client;

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  responsibleEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: ClientStatus;
  active?: boolean;
}

export interface UpdateClientResponse {
  success: boolean;
  message: string;
}

export async function listClients(params?: ListClientsParams): Promise<ListClientsResponse> {
  const response = await api.get<ListClientsResponse>(backofficeClientsEndpoints.list(), { params });
  return response.data;
}

export async function listClientsByResponsible(params?: ListClientsParams): Promise<ListClientsResponse> {
  // Remove valores undefined para evitar problemas no backend
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
      )
    : {};
  const response = await api.get<ListClientsResponse>(backofficeClientsEndpoints.listByResponsible(), { params: cleanParams });
  return response.data;
}

export async function getClient(clientId: string): Promise<Client> {
  const response = await api.get<Client>(backofficeClientsEndpoints.get(clientId));
  return response.data;
}

export async function updateClient(
  clientId: string,
  data: UpdateClientRequest
): Promise<UpdateClientResponse> {
  const response = await api.patch<UpdateClientResponse>(backofficeClientsEndpoints.update(clientId), data);
  return response.data;
}

export async function archiveClient(clientId: string): Promise<void> {
  await api.delete(backofficeClientsEndpoints.archive(clientId));
}

export interface CreateClientAccessRequest {
  email: string;
  password: string;
  cpf: string;
  name: string;
  responsibleEmail?: string;
}

export interface CreateClientAccessResponse {
  success: boolean;
  message: string;
  uid: string;
  email: string;
  cpf: string;
}

export async function createClientAccess(
  data: CreateClientAccessRequest
): Promise<CreateClientAccessResponse> {
  const response = await api.post<CreateClientAccessResponse>(
    backofficeClientsEndpoints.createAccess(),
    data
  );
  return response.data;
}


