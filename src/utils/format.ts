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

export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === '') return 'R$ 0,00';
  
  let numValue: number;
  
  if (typeof value === 'string') {
    const cleaned = value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(/,/g, '.').trim();
    numValue = parseFloat(cleaned);
  } else {
    numValue = value;
  }
  
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
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

