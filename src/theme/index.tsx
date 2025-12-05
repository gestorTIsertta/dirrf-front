import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeOptions, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'),
      customShadows: customShadows('light'),
      shadows: shadows('light'),
      shape: { borderRadius: 8 },
      typography,
    }),
    []
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

