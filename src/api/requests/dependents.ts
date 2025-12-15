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

export async function listDependents(year: number): Promise<ListDependentsResponse> {
  const response = await api.get<ListDependentsResponse>(dependentsEndpoints.list(year));
  return response.data;
}

export async function createDependent(
  year: number,
  data: CreateDependentRequest
): Promise<CreateDependentResponse> {
  const response = await api.post<CreateDependentResponse>(dependentsEndpoints.create(year), data);
  return response.data;
}

export async function updateDependent(
  year: number,
  dependentId: string,
  data: UpdateDependentRequest
): Promise<UpdateDependentResponse> {
  const response = await api.patch<UpdateDependentResponse>(
    dependentsEndpoints.update(year, dependentId),
    data
  );
  return response.data;
}

export async function deleteDependent(
  year: number,
  dependentId: string
): Promise<DeleteDependentResponse> {
  const response = await api.delete<DeleteDependentResponse>(
    dependentsEndpoints.delete(year, dependentId)
  );
  return response.data;
}

