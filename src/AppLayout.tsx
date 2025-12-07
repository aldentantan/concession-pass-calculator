import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './components/Header';

interface AppLayoutProps {
    children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: '100vh',
            alignItems: 'center'
        }}>
            <Header />
            <Box sx={{
                display: 'flex',
                width: '70%',
            }}>
                {children}
            </Box>
        </Box>
    );
}

export default AppLayout;