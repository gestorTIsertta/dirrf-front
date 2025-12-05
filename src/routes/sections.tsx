import { Navigate, useRoutes } from 'react-router-dom';

import LoginPage from 'src/pages/login';
import DeclaracaoPage from 'src/pages/declaracao';
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
      path: paths.declaracao,
      element: <DeclaracaoPage />,
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

