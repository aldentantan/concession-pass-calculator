import { Box } from '@mui/material';
import { Header } from './components/Header';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { DrawerSidebar } from './components/DrawerSidebar';

function AppLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
        }}>
            <Header toggleDrawer={toggleDrawer} />
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <DrawerSidebar mobileDrawerOpen={drawerOpen} handleDrawerClose={toggleDrawer} />
                <Box sx={{
                    flexGrow: 1,
                    width: { xs: '100%', md: '80%' },
                    paddingY: { xs: 2, md: 4 },
                    paddingX: { xs: 2, md: 8 },
                    overflow: 'auto',
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AppLayout;