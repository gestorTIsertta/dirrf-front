import { COLORS } from 'src/constants/declaracao';

export type StatusType = 'Aprovado' | 'Em análise' | 'Enviado' | 'Completo' | 'Faltando info' | 'Em análise';

export interface StatusColors {
  bgcolor: string;
  color: string;
}

export function getStatusColors(status: string): StatusColors {
  switch (status) {
    case 'Aprovado':
    case 'Completo':
      return {
        bgcolor: COLORS.successLight,
        color: COLORS.success,
      };
    case 'Em análise':
      return {
        bgcolor: COLORS.warningLight,
        color: COLORS.warning,
      };
    case 'Faltando info':
      return {
        bgcolor: COLORS.errorLight,
        color: COLORS.error,
      };
    default:
      return {
        bgcolor: COLORS.grey200,
        color: COLORS.grey800,
      };
  }
}

export function getOperacaoColors(operacao: string): StatusColors {
  switch (operacao) {
    case 'Compra':
      return {
        bgcolor: COLORS.successLight,
        color: COLORS.success,
      };
    case 'Venda':
      return {
        bgcolor: COLORS.errorLight,
        color: COLORS.error,
      };
    default:
      return {
        bgcolor: COLORS.primary + '20',
        color: COLORS.primary,
      };
  }
}

