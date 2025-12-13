import { ThemeProvider } from '@mui/material/styles';
import './App.css'
import { theme } from './theme';
import AppLayout from './AppLayout';
import { JourneyProvider } from './contexts/JourneyContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import UploadPage from './pages/UploadPage';
import TripSummaryPage from './pages/TripSummaryPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <LoginPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "upload", element: <ProtectedRoute><UploadPage /></ProtectedRoute> },
        { path: "trip-summary", element: <ProtectedRoute><TripSummaryPage /></ProtectedRoute> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <JourneyProvider>
          <RouterProvider router={router} />
        </JourneyProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
