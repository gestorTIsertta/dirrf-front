import 'src/global.css';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import ProgressBar from 'src/components/progress-bar/progress-bar';

export default function App() {
  return (
    <ThemeProvider>
      <ProgressBar />
      <Router />
    </ThemeProvider>
  );
}

