/**
 * Converte data de DD/MM/YYYY para YYYY-MM-DD (formato input date)
 */
export function formatDateToInput(date: string): string {
  const parts = date.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return date;
}

/**
 * Converte data de YYYY-MM-DD para DD/MM/YYYY
 */
export function formatDateFromInput(date: string): string {
  const parts = date.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date;
}

