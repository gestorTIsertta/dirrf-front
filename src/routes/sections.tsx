import { Navigate, useRoutes } from 'react-router-dom';

import LoginPage from 'src/pages/login';
import ForgotPasswordPage from 'src/pages/forgot-password';
import DeclaracaoPage from 'src/pages/declaracao';
import ContadorLoginPage from 'src/pages/contador-login';
import ContadorDashboardPage from 'src/pages/contador-dashboard';
import ContadorClientePage from 'src/pages/contador-cliente';
import NotFoundPage from 'src/pages/404';
import { paths } from './paths';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={paths.auth.login} replace />,
    },
    {
      path: paths.auth.login,
      element: <LoginPage />,
    },
    {
      path: paths.auth.forgotPassword,
      element: <ForgotPasswordPage />,
    },
    {
      path: paths.declaracao,
      element: <DeclaracaoPage />,
    },
    {
      path: paths.contador.login,
      element: <ContadorLoginPage />,
    },
    {
      path: paths.contador.dashboard,
      element: <ContadorDashboardPage />,
    },
    {
      path: '/contador/cliente/:clientId',
      element: <ContadorClientePage />,
    },
    {
      path: paths.page404,
      element: <NotFoundPage />,
    },
    {
      path: '*',
      element: <Navigate to={paths.page404} replace />,
    },
  ]);
}

