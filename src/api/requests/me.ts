import api from 'src/api/config/api';

export interface MeProfile {
  id: string;
  type: 'PF' | 'PJ';
  name: string;
  document: string;
  documentFormatted: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalInvoices: number;
  totalValue: number;
  lastInvoiceDate?: string;
  createdAt: string;
  active: boolean;
  archived: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  type: string;
  issueDate: string;
  emitterName: string;
  totalValue: number;
  status: string;
}

export interface MeInvoicesResponse {
  invoices: Invoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IRPFDeclaration {
  id: string;
  cpf: string;
  calendarYear: number;
  exerciseYear: number;
  contributor: {
    cpf: string;
    name: string;
    birthDate: string;
    hasSpouse: boolean;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    phone?: string;
    cellphone?: string;
    email?: string;
    occupationCode?: string;
    occupationDescription?: string;
    hasSeriousDisease?: boolean;
    wasResidentAbroad?: boolean;
    declarationType?: string;
    previousReceiptNumber?: string;
  };
  dependents?: unknown[];
  alimonyRecipients?: unknown[];
  taxableIncomeFromPJ?: unknown[];
  taxableIncomeFromPF?: unknown[];
  exemptIncome?: unknown[];
  exclusiveTaxIncome?: unknown[];
  assets?: unknown[];
  bankAccounts?: unknown[];
  debts?: unknown[];
  deductions?: unknown[];
  taxSummary: {
    taxableIncome: number;
    exemptIncome: number;
    exclusiveTaxIncome: number;
    totalDeductions: number;
    dependentDeductions: number;
    taxDue: number;
    taxPaid: number;
    taxWithheld: number;
    taxToRefund: number;
    taxToPay: number;
    installmentValue?: number;
    installmentNumber?: number;
  };
  bankInfo?: {
    automaticDebit: boolean;
    bankCode?: string;
    bankName?: string;
    agency?: string;
    accountNumber?: string;
    accountType?: string;
  };
  patrimonyEvolution?: {
    currentYear: number;
    previousYear?: number;
    currentYearAssets: number;
    currentYearDebts: number;
    currentYearNetWorth: number;
    previousYearAssets?: number;
    previousYearDebts?: number;
    previousYearNetWorth?: number;
  };
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export async function getMeProfile(): Promise<MeProfile> {
  const response = await api.get<MeProfile>('/me');
  return response.data;
}

export async function getMeInvoices(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<MeInvoicesResponse> {
  const response = await api.get<MeInvoicesResponse>('/me/invoices', { params });
  return response.data;
}

export async function getMeIRPF(): Promise<IRPFDeclaration> {
  const response = await api.get<IRPFDeclaration>('/me/irpf-upload');
  return response.data;
}

