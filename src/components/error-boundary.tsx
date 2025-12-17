import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h4" gutterBottom color="error">
              Oops! Algo deu errado
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: 'error.light',
                  borderRadius: 1,
                  textAlign: 'left',
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </Typography>
              </Box>
            )}
            <Button variant="contained" onClick={this.handleReload}>
              Recarregar Página
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

