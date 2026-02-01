import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { NavigationBar } from './components/NavigationBar';

function AppLayout() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            bgcolor: '#ffffff',
        }}>
            <NavigationBar />
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Box sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    bgcolor: '#ffffff',
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AppLayout;