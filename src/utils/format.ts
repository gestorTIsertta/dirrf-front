/**
 * Utilitários centralizados para formatação de dados
 */

/**
 * Formata CPF (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // Se já estiver formatado, retorna como está
  if (cpf.includes('.') || cpf.includes('-')) {
    return cpf;
  }
  
  return cleaned;
}

/**
 * Formata CNPJ (00.000.000/0000-00)
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Se já estiver formatado, retorna como está
  if (cnpj.includes('.') || cnpj.includes('/') || cnpj.includes('-')) {
    return cnpj;
  }
  
  return cleaned;
}

/**
 * Formata CPF ou CNPJ automaticamente baseado no tamanho
 */
export function formatCPFCNPJ(value: string): string {
  if (!value) return '';
  
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return formatCPF(cleaned);
  } else if (cleaned.length === 14) {
    return formatCNPJ(cleaned);
  }
  
  // Se já estiver formatado, retorna como está
  if (value.includes('.') || value.includes('/') || value.includes('-')) {
    return value;
  }
  
  return cleaned;
}

/**
 * Remove formatação de CPF/CNPJ (deixa apenas números)
 */
export function unformatCPFCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata valor monetário (R$ 1.000,50)
 */
export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === '') return 'R$ 0,00';
  
  let numValue: number;
  
  if (typeof value === 'string') {
    // Remove R$, espaços e pontos (separadores de milhar)
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


/**
 * Remove formatação de valor monetário (retorna número)
 */
export function unformatCurrency(value: string): number {
  if (!value) return 0;
  
  const cleaned = value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(/,/g, '.').trim();
  const numValue = parseFloat(cleaned);
  
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      // Se não for uma data válida, verifica se já está no formato DD/MM/YYYY
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

/**
 * Formata data para input (YYYY-MM-DD)
 */
export function formatDateInput(date: string | Date): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      // Se já estiver no formato YYYY-MM-DD, retorna como está
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      // Se estiver no formato DD/MM/YYYY, converte
      if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
      }
      return '';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Formata número com separadores de milhar (1.000)
 */
export function formatNumber(value: string | number): string {
  if (value === null || value === undefined || value === '') return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(numValue);
}

/**
 * Formata número de telefone (00) 00000-0000 ou (00) 0000-0000
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    // Telefone fixo: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) {
    // Celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return cleaned;
}

/**
 * Formata CEP (00000-000)
 */
export function formatCEP(cep: string): string {
  if (!cep) return '';
  
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cleaned;
}

