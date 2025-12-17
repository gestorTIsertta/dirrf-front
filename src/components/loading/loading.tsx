import { Box, CircularProgress } from '@mui/material';
import { COLORS } from 'src/constants/declaracao';

interface LoadingProps {
  size?: number;
  fullScreen?: boolean;
  overlay?: boolean;
}

export function Loading({ size = 40, fullScreen = false, overlay = false }: LoadingProps) {
  const loadingContent = (
    <CircularProgress
      size={size}
      sx={{
        color: COLORS.primary,
      }}
    />
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        {loadingContent}
      </Box>
    );
  }

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 10,
          borderRadius: 1,
        }}
      >
        {loadingContent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {loadingContent}
    </Box>
  );
}



