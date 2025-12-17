import { enqueueSnackbar } from 'notistack';

export function handleError(error: unknown, defaultMessage: string): void {
  const message = error instanceof Error ? error.message : defaultMessage;
  enqueueSnackbar(message, { variant: 'error' });
}

export function handleSuccess(message: string): void {
  enqueueSnackbar(message, { variant: 'success' });
}

export function handleWarning(message: string): void {
  enqueueSnackbar(message, { variant: 'warning' });
}

export function handleInfo(message: string): void {
  enqueueSnackbar(message, { variant: 'info' });
}

