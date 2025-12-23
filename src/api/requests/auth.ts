import api from 'src/api/config/api';

export interface AuthenticateWithPasswordRequest {
  email: string;
  password: string;
}

export interface AuthenticateWithPasswordResponse {
  token: string;
}

export interface AuthenticateWithPhoneRequest {
  phone_number: string;
}

export interface AuthenticateWithPhoneResponse {
  token: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    uid: string;
    name: string;
    email: string;
    phone_number: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: string;
}

export interface CheckEmailExistsParams {
  email: string;
}

export interface CheckEmailExistsResponse {
  exists: boolean;
  message: string;
}

/**
 * Autentica com email e senha
 */
export async function authenticateWithPassword(
  data: AuthenticateWithPasswordRequest
): Promise<AuthenticateWithPasswordResponse> {
  const response = await api.post<AuthenticateWithPasswordResponse>('/sessions/password', data);
  return response.data;
}

/**
 * Autentica com número de telefone
 */
export async function authenticateWithPhone(
  data: AuthenticateWithPhoneRequest
): Promise<AuthenticateWithPhoneResponse> {
  const response = await api.post<AuthenticateWithPhoneResponse>('/sessions/phone', data);
  return response.data;
}

/**
 * Renova o token de autenticação
 */
export async function refreshToken(
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>('/sessions/refresh', data);
  return response.data;
}

/**
 * Verifica se um email existe no Firebase Authentication
 */
export async function checkEmailExists(
  params: CheckEmailExistsParams
): Promise<CheckEmailExistsResponse> {
  const response = await api.get<CheckEmailExistsResponse>('/auth/check-email', { params });
  return response.data;
}

