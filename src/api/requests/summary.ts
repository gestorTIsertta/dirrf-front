import * as transactionsApi from './transactions';
import * as servicesTakenApi from './services-taken';

export interface SummaryResponse {
  rendimentos: {
    tributaveis: number;
    isentos: number;
    exclusivos: number;
    variacaoPercentual?: number;
  };
  bensEDireitos: {
    valorTotal: number;
    itensDeclarados: number;
    variacaoPercentual?: number;
  };
  dividasEOnus: {
    totalDividas: number;
    obrigacoes: number;
    variacaoPercentual?: number;
  };
  restituicao: {
    valor: number;
    previsao?: string;
  };
}

export async function getSummary(year: number): Promise<SummaryResponse> {
  try {
    const [transactionsResponse, servicesResponse] = await Promise.all([
      transactionsApi.listTransactions(year),
      servicesTakenApi.listServicesTaken(year),
    ]);

    const transactions = transactionsResponse.transactions;
    const services = servicesResponse.services;

    const bensEDireitos = {
      valorTotal: transactions.reduce((sum, t) => {
        if (t.tipo === 'compra') {
          return sum + t.valor;
        }
        return sum;
      }, 0),
      itensDeclarados: transactions.length,
      variacaoPercentual: undefined,
    };

    const dividasEOnus = {
      totalDividas: services.reduce((sum, s) => sum + (s.valorTotal - (s.valorReembolsado || 0)), 0),
      obrigacoes: services.length,
      variacaoPercentual: undefined,
    };

    return {
      rendimentos: {
        tributaveis: 0,
        isentos: 0,
        exclusivos: 0,
        variacaoPercentual: undefined,
      },
      bensEDireitos,
      dividasEOnus,
      restituicao: {
        valor: 0,
        previsao: undefined,
      },
    };
  } catch (error) {
    console.error('Erro ao calcular resumo:', error);
    return {
      rendimentos: {
        tributaveis: 0,
        isentos: 0,
        exclusivos: 0,
        variacaoPercentual: undefined,
      },
      bensEDireitos: {
        valorTotal: 0,
        itensDeclarados: 0,
        variacaoPercentual: undefined,
      },
      dividasEOnus: {
        totalDividas: 0,
        obrigacoes: 0,
        variacaoPercentual: undefined,
      },
      restituicao: {
        valor: 0,
        previsao: undefined,
      },
    };
  }
}

