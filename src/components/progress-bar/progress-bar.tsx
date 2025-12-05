import { useEffect } from 'react';
import NProgress from 'nprogress';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';

export default function ProgressBar() {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return (
    <Box
      sx={{
        '& #nprogress': {
          pointerEvents: 'none',
          '& .bar': {
            top: 0,
            left: 0,
            height: 2,
            width: '100%',
            position: 'fixed',
            zIndex: (theme) => theme.zIndex.snackbar,
            backgroundColor: (theme) => theme.palette.primary.main,
            boxShadow: (theme) => `0 0 2px ${theme.palette.primary.main}`,
          },
          '& .peg': {
            right: 0,
            opacity: 1,
            width: 100,
            height: '100%',
            display: 'block',
            position: 'absolute',
            transform: 'rotate(3deg) translate(0px, -4px)',
            boxShadow: (theme) =>
              `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
          },
        },
      }}
    />
  );
}

