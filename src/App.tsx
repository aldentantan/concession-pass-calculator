import { ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './App.css';
import AppLayout from './AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { theme } from './theme';

import ForgetPasswordPage from './pages/ForgetPasswordPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import SignUpSuccessPage from './pages/SignUpSuccessPage';
import StatementsPage from './pages/StatementsPage';
import TripSummaryPage from './pages/TripSummaryPage';
import UploadPage from './pages/UploadPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <LoginPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "signup-success", element: <SignUpSuccessPage /> },
        { path: "forget-password", element: <ForgetPasswordPage /> },
        { path: "reset-password", element: <ProtectedRoute><ResetPasswordPage /></ProtectedRoute> },
        { path: "upload", element: <ProtectedRoute><UploadPage /></ProtectedRoute> },
        { path: "trip-summary", element: <ProtectedRoute><TripSummaryPage /></ProtectedRoute> },
        { path: "statements", element: <ProtectedRoute><StatementsPage /></ProtectedRoute> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <TripProvider>
          <RouterProvider router={router} />
        </TripProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
