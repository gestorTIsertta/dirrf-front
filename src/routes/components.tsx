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
          if (isMounted) {
            loadingState = false;
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } else {
        if (isMounted) {
          loadingState = false;
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    auth.authStateReady().then(() => {
      if (!isMounted) return;
      const currentUser = auth.currentUser;
      checkAuth(currentUser);
    }).catch(() => {
      if (isMounted) {
        loadingState = false;
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted) {
        await checkAuth(user);
      }
    });

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
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />;
  }

  return <>{children}</>;
}

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
          if (isMounted) {
            loadingState = false;
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } else {
        if (isMounted) {
          loadingState = false;
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    authBackoffice.authStateReady().then(() => {
      if (!isMounted) return;
      const currentUser = authBackoffice.currentUser;
      checkAuth(currentUser);
    }).catch(() => {
      if (isMounted) {
        loadingState = false;
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    unsubscribe = onAuthStateChanged(authBackoffice, async (user) => {
      if (isMounted) {
        await checkAuth(user);
      }
    });

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
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.contador.login} replace />;
  }

  return <>{children}</>;
}
