import { forwardRef, useEffect, useState, ReactNode } from 'react';
import { Link as RouterLinkBase, LinkProps, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'src/config-firebase';
import { authBackoffice } from 'src/config-firebase-backoffice';
import { paths } from './paths';

export const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ ...other }, ref) => <RouterLinkBase ref={ref} {...other} />
);

RouterLink.displayName = 'RouterLink';

/**
 * Componente de proteção de rota para clientes (Firebase normal)
 * Verifica se há token válido antes de permitir acesso
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;
    let loadingState = true;

    const checkAuth = async (user: User | null) => {
      if (!isMounted) return;

      if (user) {
        try {
          // Verifica se o token existe e é válido (força verificação)
          const token = await user.getIdToken(false);
          if (token && isMounted) {
            loadingState = false;
            setIsAuthenticated(true);
            setIsLoading(false);
          } else if (isMounted) {
            loadingState = false;
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        } catch (error) {
          // Token inválido ou expirado
          if (isMounted) {
            loadingState = false;
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } else {
        // Não há usuário autenticado
        if (isMounted) {
          loadingState = false;
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    // Garante que o Firebase Auth está pronto antes de verificar
    auth.authStateReady().then(() => {
      if (!isMounted) return;
      
      // Verifica o usuário atual imediatamente
      const currentUser = auth.currentUser;
      checkAuth(currentUser);
    }).catch(() => {
      if (isMounted) {
        loadingState = false;
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    // onAuthStateChanged é chamado imediatamente quando registrado
    // e também sempre que o estado de autenticação muda
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted) {
        await checkAuth(user);
      }
    });

    // Timeout de segurança: se após 2 segundos ainda estiver carregando,
    // considera como não autenticado
    const timeoutId = setTimeout(() => {
      if (isMounted && loadingState) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    // Pode mostrar um loading aqui se quiser
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />;
  }

  return <>{children}</>;
}

/**
 * Componente de proteção de rota para contadores (Firebase Backoffice)
 * Verifica se há token válido antes de permitir acesso
 */
export function ProtectedRouteBackoffice({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;
    let loadingState = true;

    const checkAuth = async (user: User | null) => {
      if (!isMounted) return;

      if (user) {
        try {
          // Verifica se o token existe e é válido (força verificação)
          const token = await user.getIdToken(false);
          if (token && isMounted) {
            loadingState = false;
            setIsAuthenticated(true);
            setIsLoading(false);
          } else if (isMounted) {
            loadingState = false;
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        } catch (error) {
          // Token inválido ou expirado
          if (isMounted) {
            loadingState = false;
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } else {
        // Não há usuário autenticado
        if (isMounted) {
          loadingState = false;
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    // Garante que o Firebase Auth está pronto antes de verificar
    authBackoffice.authStateReady().then(() => {
      if (!isMounted) return;
      
      // Verifica o usuário atual imediatamente
      const currentUser = authBackoffice.currentUser;
      checkAuth(currentUser);
    }).catch(() => {
      if (isMounted) {
        loadingState = false;
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    // onAuthStateChanged é chamado imediatamente quando registrado
    // e também sempre que o estado de autenticação muda
    unsubscribe = onAuthStateChanged(authBackoffice, async (user) => {
      if (isMounted) {
        await checkAuth(user);
      }
    });

    // Timeout de segurança: se após 2 segundos ainda estiver carregando,
    // considera como não autenticado
    const timeoutId = setTimeout(() => {
      if (isMounted && loadingState) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    // Pode mostrar um loading aqui se quiser
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.contador.login} replace />;
  }

  return <>{children}</>;
}
