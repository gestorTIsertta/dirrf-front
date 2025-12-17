import api from '../config/api';
import { dependentsEndpoints } from '../config/endpoints';

export interface CreateDependentRequest {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  grauParentesco: string;
  nomeMae?: string;
  nacionalidade?: string;
  sexo?: string;
}

export interface UpdateDependentRequest {
  nomeCompleto?: string;
  cpf?: string;
  dataNascimento?: string;
  grauParentesco?: string;
  nomeMae?: string;
  nacionalidade?: string;
  sexo?: string;
}

export interface DependentResponse {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  grauParentesco: string;
  nomeMae?: string;
  nacionalidade?: string;
  sexo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListDependentsResponse {
  dependents: DependentResponse[];
}

export interface CreateDependentResponse {
  success: boolean;
  message: string;
  dependent: DependentResponse;
}

export interface UpdateDependentResponse {
  success: boolean;
  message: string;
}

export interface DeleteDependentResponse {
  success: boolean;
  message: string;
}

export async function listDependents(
  year: number,
  cpf?: string | null
): Promise<ListDependentsResponse> {
  let url = dependentsEndpoints.list(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.get<ListDependentsResponse>(url);
  return response.data;
}

export async function createDependent(
  year: number,
  data: CreateDependentRequest,
  cpf?: string | null
): Promise<CreateDependentResponse> {
  let url = dependentsEndpoints.create(year);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.post<CreateDependentResponse>(url, data);
  return response.data;
}

export async function updateDependent(
  year: number,
  dependentId: string,
  data: UpdateDependentRequest,
  cpf?: string | null
): Promise<UpdateDependentResponse> {
  let url = dependentsEndpoints.update(year, dependentId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.patch<UpdateDependentResponse>(url, data);
  return response.data;
}

export async function deleteDependent(
  year: number,
  dependentId: string,
  cpf?: string | null
): Promise<DeleteDependentResponse> {
  let url = dependentsEndpoints.delete(year, dependentId);
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    url = `${url}?cpf=${cleanCpf}`;
  }
  const response = await api.delete<DeleteDependentResponse>(url);
  return response.data;
}


