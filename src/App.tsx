import { ThemeProvider } from '@mui/material/styles';
import './App.css'
import Home from './pages/Home';
import { theme } from './theme';
import AppLayout from './AppLayout';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <AppLayout>
        <Home />
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
