/**
 * Requests para dados do cliente autenticado (/me)
 */

import api from '../config/api';
import { meEndpoints } from '../config/endpoints';

/**
 * Tipos de dados
 */
export interface MeProfileResponse {
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

export interface InvoiceResponse {
  id: string;
  number: string;
  type: string;
  issueDate: string;
  emitterName: string;
  totalValue: number;
  status: string;
}

export interface ListInvoicesQuery {
  page?: number;
  limit?: number;
  status?: string;
}

export interface ListInvoicesResponse {
  invoices: InvoiceResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Contributor {
  cpf: string;
  name: string;
  birthDate: string;
  hasSpouse: boolean;
  address: Address;
  phone?: string;
  cellphone?: string;
  email?: string;
  occupationCode?: string;
  occupationDescription?: string;
  hasSeriousDisease?: boolean;
  wasResidentAbroad?: boolean;
  declarationType?: string;
  previousReceiptNumber?: string;
}

export interface TaxSummary {
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
}

export interface BankInfo {
  automaticDebit: boolean;
  bankCode?: string;
  bankName?: string;
  agency?: string;
  accountNumber?: string;
  accountType?: string;
}

export interface PatrimonyEvolution {
  currentYear: number;
  previousYear?: number;
  currentYearAssets: number;
  currentYearDebts: number;
  currentYearNetWorth: number;
  previousYearAssets?: number;
  previousYearDebts?: number;
  previousYearNetWorth?: number;
}

export interface IRPFDependent {
  code: string;
  name: string;
  birthDate: string;
  cpf: string;
  email?: string;
  cellphone?: string;
  livesWithContributor: boolean;
}

export interface AlimonyRecipient {
  name: string;
  cpf: string;
  value: number;
}

export interface TaxableIncomeFromPJ {
  payerName: string;
  payerDocument: string;
  incomeReceived: number;
  officialSocialSecurityContribution: number;
  taxWithheld: number;
  thirteenthSalary: number;
  irrfOnThirteenthSalary: number;
  beneficiary: 'Titular' | 'Dependente';
  beneficiaryCPF?: string;
}

export interface TaxableIncomeFromPF {
  payerName: string;
  payerDocument?: string;
  incomeReceived: number;
  taxWithheld: number;
  beneficiary: 'Titular' | 'Dependente';
  beneficiaryCPF?: string;
}

export interface ExemptIncome {
  category: string;
  payerCNPJ?: string;
  payerName: string;
  beneficiary: 'Titular' | 'Dependente';
  beneficiaryCPF?: string;
  value: number;
}

export interface ExclusiveTaxIncome {
  category: string;
  payerCNPJ?: string;
  payerName: string;
  beneficiary: 'Titular' | 'Dependente';
  beneficiaryCPF?: string;
  value: number;
}

export interface IRPFAsset {
  code: string;
  description: string;
  acquisitionDate?: string;
  acquisitionValue: number;
  currentValue: number;
  location?: string;
  registrationNumber?: string;
}

export interface IRPFBankAccount {
  bankCode?: string;
  bankName: string;
  agency?: string;
  accountNumber?: string;
  accountType?: string;
  balance: number;
  income: number;
}

export interface IRPFDebt {
  description: string;
  creditorName?: string;
  creditorDocument?: string;
  value: number;
  dueDate?: string;
}

export interface IRPFDeduction {
  type: string;
  description: string;
  value: number;
}

export interface IRPFResponse {
  id: string;
  cpf: string;
  calendarYear: number;
  exerciseYear: number;
  contributor: Contributor;
  dependents?: IRPFDependent[];
  alimonyRecipients?: AlimonyRecipient[];
  taxableIncomeFromPJ?: TaxableIncomeFromPJ[];
  taxableIncomeFromPF?: TaxableIncomeFromPF[];
  exemptIncome?: ExemptIncome[];
  exclusiveTaxIncome?: ExclusiveTaxIncome[];
  assets?: IRPFAsset[];
  bankAccounts?: IRPFBankAccount[];
  debts?: IRPFDebt[];
  deductions?: IRPFDeduction[];
  taxSummary: TaxSummary;
  bankInfo?: BankInfo;
  patrimonyEvolution?: PatrimonyEvolution;
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

/**
 * Obtém o perfil do cliente autenticado
 */
export async function getMeProfile(): Promise<MeProfileResponse> {
  const response = await api.get<MeProfileResponse>(meEndpoints.profile());
  return response.data;
}

/**
 * Lista as invoices do cliente autenticado
 */
export async function getMeInvoices(
  query?: ListInvoicesQuery
): Promise<ListInvoicesResponse> {
  const response = await api.get<ListInvoicesResponse>(meEndpoints.invoices(), {
    params: query,
  });
  return response.data;
}

/**
 * Obtém a declaração de IRPF mais recente do cliente autenticado
 */
export async function getMeIRPF(): Promise<IRPFResponse> {
  const response = await api.get<IRPFResponse>(meEndpoints.irpf());
  return response.data;
}

