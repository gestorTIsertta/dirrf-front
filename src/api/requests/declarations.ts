import api from 'src/api/config/api';

export type DeclarationStatus = 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'concluida';

export interface UpdateDeclarationStatusRequest {
  status: DeclarationStatus;
}

export interface Declaration {
  id: string;
  cpf: string;
  anoExercicio: number;
  status: DeclarationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeclarationStatusResponse {
  success: boolean;
  message: string;
  declaration: Declaration;
}

export async function updateDeclarationStatus(
  year: number,
  status: DeclarationStatus,
  cpf?: string | null
): Promise<UpdateDeclarationStatusResponse> {
  const params = cpf ? { cpf } : {};
  const response = await api.patch<UpdateDeclarationStatusResponse>(
    `/irpf-declarations/${year}/status`,
    { status },
    { params }
  );
  return response.data;
}

