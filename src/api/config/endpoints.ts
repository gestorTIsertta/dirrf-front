const BASE_PATH = '/irpf-declarations';

export const banksEndpoints = {
  list: (year: number) => `${BASE_PATH}/${year}/banks`,
  create: (year: number) => `${BASE_PATH}/${year}/banks`,
  update: (year: number, bankId: string) => `${BASE_PATH}/${year}/banks/${bankId}`,
  delete: (year: number, bankId: string) => `${BASE_PATH}/${year}/banks/${bankId}`,
  uploadInforme: (year: number, bankId: string) => `${BASE_PATH}/${year}/banks/${bankId}/informe`,
};

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

export const documentsEndpoints = {
  get: () => `${BASE_PATH}/documents/get`,
};

export const dependentsEndpoints = {
  list: (year: number) => `${BASE_PATH}/${year}/dependents`,
  create: (year: number) => `${BASE_PATH}/${year}/dependents`,
  update: (year: number, dependentId: string) => `${BASE_PATH}/${year}/dependents/${dependentId}`,
  delete: (year: number, dependentId: string) => `${BASE_PATH}/${year}/dependents/${dependentId}`,
};

export const servicesTakenEndpoints = {
  list: (year: number) => `${BASE_PATH}/${year}/services-taken`,
  create: (year: number) => `${BASE_PATH}/${year}/services-taken`,
  update: (year: number, serviceId: string) => `${BASE_PATH}/${year}/services-taken/${serviceId}`,
  delete: (year: number, serviceId: string) => `${BASE_PATH}/${year}/services-taken/${serviceId}`,
  uploadDocuments: (year: number, serviceId: string) =>
    `${BASE_PATH}/${year}/services-taken/${serviceId}/documents`,
  deleteDocument: (year: number, serviceId: string) =>
    `${BASE_PATH}/${year}/services-taken/${serviceId}/documents`,
};

export const incomeDocumentsEndpoints = {
  list: (year: number, bankId?: string) => {
    const base = `${BASE_PATH}/${year}/income-documents`;
    return bankId ? `${base}?bankId=${bankId}` : base;
  },
  upload: (year: number) => `${BASE_PATH}/${year}/income-documents`,
  remove: (year: number) => `${BASE_PATH}/${year}/income-documents`,
};

export const backofficeClientsEndpoints = {
  list: () => '/clients',
  listByResponsible: () => '/clients/by-responsible',
  get: (clientId: string) => `/clients/${clientId}`,
  update: (clientId: string) => `/clients/${clientId}`,
  archive: (clientId: string) => `/clients/${clientId}`,
  createAccess: () => '/clients/access',
};

export const notesEndpoints = {
  list: (year: number) => `${BASE_PATH}/${year}/notes`,
  get: (year: number, noteId: string) => `${BASE_PATH}/${year}/notes/${noteId}`,
  create: (year: number) => `${BASE_PATH}/${year}/notes`,
  update: (year: number, noteId: string) => `${BASE_PATH}/${year}/notes/${noteId}`,
  delete: (year: number, noteId: string) => `${BASE_PATH}/${year}/notes/${noteId}`,
};

export const declarationsEndpoints = {
  updateStatus: (year: number) => `${BASE_PATH}/${year}/status`,
};

export const invoicesEndpoints = {
  list: (clientId: string) => `/invoices/clients/${clientId}`,
  get: (clientId: string, invoiceId: string) => `/irpf-uploads/clients/${clientId}/${invoiceId}`,
  upload: () => '/irpf-uploads/upload',
  listIRPF: (cpf: string) => `/irpf-uploads/clients/${cpf}`,
};

export const meEndpoints = {
  profile: () => '/me',
  invoices: () => '/me/invoices',
  irpf: () => '/me/irpf-upload',
};

export const authEndpoints = {
  authenticateWithPassword: () => '/sessions/password',
  authenticateWithPhone: () => '/sessions/phone',
  refreshToken: () => '/sessions/refresh',
  checkEmail: () => '/auth/check-email',
};

