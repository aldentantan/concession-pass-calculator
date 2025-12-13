import { Box } from '@mui/material';
import { Header } from './components/Header';
import { Outlet } from 'react-router-dom';

function AppLayout() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center'
        }}>
            <Header />
            <Box sx={{
                width: '80%',
                p: 2
            }}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout;