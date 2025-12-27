export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  if (cpf.includes('.') || cpf.includes('-')) {
    return cpf;
  }
  
  return cleaned;
}

export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  if (cnpj.includes('.') || cnpj.includes('/') || cnpj.includes('-')) {
    return cnpj;
  }
  
  return cleaned;
}

export function formatCPFCNPJ(value: string): string {
  if (!value) return '';
  
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return formatCPF(cleaned);
  } else if (cleaned.length === 14) {
    return formatCNPJ(cleaned);
  }
  
  if (value.includes('.') || value.includes('/') || value.includes('-')) {
    return value;
  }
  
  return cleaned;
}

export function unformatCPFCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

export function parseCurrencyValue(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  
  if (typeof value === 'number') {
    return Math.round(value * 100) / 100;
  }
  
  let cleaned = value.replace(/R\$\s?/g, '').trim();
  
  if (!cleaned.includes(',') && !cleaned.includes('.')) {
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
  }
  
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (!(parts.length === 2 && /^\d{2}$/.test(parts[1]))) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }
  
  const numValue = parseFloat(cleaned);
  
  if (isNaN(numValue)) return 0;
  
  return Math.round(numValue * 100) / 100;
}

export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'R$ 0,00';
  
  const numValue = parseCurrencyValue(value);
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return date;
      }
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

