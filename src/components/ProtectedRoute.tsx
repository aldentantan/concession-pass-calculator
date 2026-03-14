import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageNames: Record<string, string> = {
    '/reset-password': 'Reset Password',
    '/statements': 'Statements page',
};

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { session, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !session) {
            const pageName = pageNames[location.pathname] ?? location.pathname;
            alert(`You need to be logged in to access ${pageName}.`);
        }
    }, [loading, session, location.pathname]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    if (!session) return <Navigate to="/" replace />;

    return <>{children}</>;
};