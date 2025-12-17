import 'src/global.css';

import { SnackbarProvider } from 'notistack';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import ProgressBar from 'src/components/progress-bar/progress-bar';
import { ContadorProvider } from 'src/hooks/use-contador-context';

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={4000}
      >
        <ContadorProvider>
          <ProgressBar />
          <Router />
        </ContadorProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

