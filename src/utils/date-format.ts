export function formatDateToInput(date: string): string {
  const parts = date.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return date;
}

export function formatDateFromInput(date: string): string {
  const parts = date.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date;
}

