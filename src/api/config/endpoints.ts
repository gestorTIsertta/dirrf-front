/**
 * Configuração de endpoints da API
 * Organizados por módulo/funcionalidade
 */

const BASE_PATH = '/irpf-declarations';

/**
 * Endpoints de Bancos
 */
export const banksEndpoints = {
  list: (year: number) => `${BASE_PATH}/${year}/banks`,
  create: (year: number) => `${BASE_PATH}/${year}/banks`,
  update: (year: number, bankId: string) => `${BASE_PATH}/${year}/banks/${bankId}`,
  delete: (year: number, bankId: string) => `${BASE_PATH}/${year}/banks/${bankId}`,
  uploadInforme: (year: number, bankId: string) => `${BASE_PATH}/${year}/banks/${bankId}/informe`,
};

/**
 * Endpoints de Transações
 */
export const transactionsEndpoints = {
  list: (year: number) => `${BASE_PATH}/${year}/transactions`,
  create: (year: number) => `${BASE_PATH}/${year}/transactions`,
  update: (year: number, transactionId: string) => `${BASE_PATH}/${year}/transactions/${transactionId}`,
  delete: (year: number, transactionId: string) => `${BASE_PATH}/${year}/transactions/${transactionId}`,
  uploadComprovantes: (year: number, transactionId: string) =>
    `${BASE_PATH}/${year}/transactions/${transactionId}/comprovantes`,
  deleteComprovante: (year: number, transactionId: string) =>
    `${BASE_PATH}/${year}/transactions/${transactionId}/comprovantes`,
};

/**
 * Endpoints de Documentos
 */
export const documentsEndpoints = {
  get: () => `${BASE_PATH}/documents/get`,
};

/**
 * Endpoints de Me (Cliente autenticado)
 */
export const meEndpoints = {
  profile: () => '/me',
  invoices: () => '/me/invoices',
  irpf: () => '/me/irpf-upload',
};

