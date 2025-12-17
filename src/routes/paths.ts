export const paths = {
  auth: {
    login: '/login',
    forgotPassword: '/esqueci-minha-senha',
  },
  contador: {
    login: '/contador/login',
    dashboard: '/contador/dashboard',
    cliente: (clientId: string) => `/contador/cliente/${clientId}`,
  },
  declaracao: '/declaracao',
  page404: '/404',
};

