import { ThemeProvider } from '@mui/material/styles';
import './App.css'
import { theme } from './theme';
import AppLayout from './AppLayout';
import { JourneyProvider } from './contexts/JourneyContext';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';

import UploadPage from './pages/UploadPage';
import TripSummaryPage from './pages/TripSummaryPage';

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <UploadPage /> },
    { path: "/trip-summary", element: <TripSummaryPage /> },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <JourneyProvider>
        <AppLayout>
          <RouterProvider router={router} />
        </AppLayout>
      </JourneyProvider>
    </ThemeProvider>
  )
}

export default App
