import { parseCurrencyValue } from 'src/utils/format';

export function convertTipoContaToBackend(
  tipo: 'Corrente' | 'Poupança'
): 'corrente' | 'poupanca' | 'salario' | 'investimento' | 'outro' {
  switch (tipo) {
    case 'Corrente':
      return 'corrente';
    case 'Poupança':
      return 'poupanca';
    default:
      return 'outro';
  }
}

export function convertTipoContaFromBackend(
  tipo: 'corrente' | 'poupanca' | 'salario' | 'investimento' | 'outro'
): 'Corrente' | 'Poupança' {
  switch (tipo) {
    case 'corrente':
    case 'salario':
    case 'investimento':
      return 'Corrente';
    case 'poupanca':
      return 'Poupança';
    default:
      return 'Corrente';
  }
}

export function convertDateToBackend(date: string): string {
  if (!date) return '';

  if (date.includes('T') || date.includes('Z')) {
    return date;
  }

  if (date.includes('/')) {
    const [day, month, year] = date.split('/');
    const dateObj = new Date(`${year}-${month}-${day}`);
    return dateObj.toISOString();
  }

  const dateMatch = /^\d{4}-\d{2}-\d{2}$/.exec(date);
  if (dateMatch) {
    const dateObj = new Date(date);
    return dateObj.toISOString();
  }

  return date;
}

export function convertDateFromBackend(date: string): string {
  if (!date) return '';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date;

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  } catch {
    return date;
  }
}

export function convertValueToBackend(value: string): number {
  if (!value) return 0;
  return parseCurrencyValue(value);
}

export function convertValueFromBackend(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
  const normalizedValue = Math.round(value * 100) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(normalizedValue);
}

export function convertCategoriaToBackend(
  categoria: string
): 'imovel' | 'veiculo' | 'investimento' | 'acoes' | 'criptomoeda' | 'joia' | 'arte' | 'outro' {
  const categoriaMap: Record<string, 'imovel' | 'veiculo' | 'investimento' | 'acoes' | 'criptomoeda' | 'joia' | 'arte' | 'outro'> = {
    'Imóveis': 'imovel',
    'Veículos': 'veiculo',
    'Investimentos': 'investimento',
    'Ações': 'acoes',
    'Criptomoedas': 'criptomoeda',
    'Joias': 'joia',
    'Arte': 'arte',
    'Empréstimos': 'outro',
    'Participações em Empresas': 'outro',
    'Atividade Rural': 'outro',
    'Outros': 'outro',
  };

  return categoriaMap[categoria] || 'outro';
}

export function convertCategoriaFromBackend(categoria: string): string {
  const categoriaMap: Record<string, string> = {
    imovel: 'Imóveis',
    veiculo: 'Veículos',
    investimento: 'Investimentos',
    acoes: 'Ações',
    criptomoeda: 'Criptomoedas',
    joia: 'Joias',
    arte: 'Arte',
    outro: 'Outros',
  };

  return categoriaMap[categoria] || 'Outros';
}

export function convertTipoOperacaoToBackend(operacao: 'Compra' | 'Venda'): 'compra' | 'venda' {
  return operacao.toLowerCase() as 'compra' | 'venda';
}

export function convertTipoOperacaoFromBackend(tipo: 'compra' | 'venda'): 'Compra' | 'Venda' {
  return tipo.charAt(0).toUpperCase() + tipo.slice(1) as 'Compra' | 'Venda';
}

