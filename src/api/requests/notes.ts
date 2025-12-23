import api from 'src/api/config/api';

export interface Note {
  id: string;
  cpf: string;
  anoExercicio: number;
  anotacoes: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  anotacoes: string;
}

export interface UpdateNoteRequest {
  anotacoes: string;
}

export interface ListNotesResponse {
  success: boolean;
  notes: Note[];
}

export interface GetNoteResponse {
  success: boolean;
  note: Note;
}

export interface CreateNoteResponse {
  success: boolean;
  message: string;
  note: Note;
}

export interface UpdateNoteResponse {
  success: boolean;
  message: string;
  note: Note;
}

export interface DeleteNoteResponse {
  success: boolean;
  message: string;
}

/**
 * Lista todas as notas de uma declaração IR
 */
export async function listNotes(year: number, cpf?: string | null): Promise<Note[]> {
  const params = cpf ? { cpf } : {};
  const response = await api.get<ListNotesResponse>(`/irpf-declarations/${year}/notes`, { params });
  return response.data.notes;
}

/**
 * Busca uma nota específica por ID
 */
export async function getNote(year: number, noteId: string, cpf?: string | null): Promise<Note> {
  const params = cpf ? { cpf } : {};
  const response = await api.get<GetNoteResponse>(`/irpf-declarations/${year}/notes/${noteId}`, { params });
  return response.data.note;
}

/**
 * Cria uma nova nota
 */
export async function createNote(
  year: number,
  data: CreateNoteRequest,
  cpf?: string | null
): Promise<CreateNoteResponse> {
  const params = cpf ? { cpf } : {};
  const response = await api.post<CreateNoteResponse>(`/irpf-declarations/${year}/notes`, data, { params });
  return response.data;
}

/**
 * Atualiza uma nota existente
 */
export async function updateNote(
  year: number,
  noteId: string,
  data: UpdateNoteRequest,
  cpf?: string | null
): Promise<UpdateNoteResponse> {
  const params = cpf ? { cpf } : {};
  const response = await api.patch<UpdateNoteResponse>(
    `/irpf-declarations/${year}/notes/${noteId}`,
    data,
    { params }
  );
  return response.data;
}

/**
 * Deleta uma nota
 */
export async function deleteNote(year: number, noteId: string, cpf?: string | null): Promise<DeleteNoteResponse> {
  const params = cpf ? { cpf } : {};
  const response = await api.delete<DeleteNoteResponse>(`/irpf-declarations/${year}/notes/${noteId}`, { params });
  return response.data;
}

