import 'src/global.css';

import { SnackbarProvider } from 'notistack';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import ProgressBar from 'src/components/progress-bar/progress-bar';

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
        <ProgressBar />
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

