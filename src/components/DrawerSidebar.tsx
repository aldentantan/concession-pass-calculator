import { Box, Drawer, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

interface DrawerSidebarProps {
  mobileDrawerOpen: boolean;
  handleDrawerClose: () => void;
}

export const DrawerSidebar = ({ mobileDrawerOpen, handleDrawerClose }: DrawerSidebarProps) => {
  const { session, signOut } = useAuth();

  const mobileDrawerWidth = 240;
  const desktopDrawerWidth = 300;

  const drawerListItems = [
    { text: 'Upload PDF', link: '/upload', icon: <FileUploadRoundedIcon /> },
    { text: 'Your PDFs', link: '/statements', icon: <FolderCopyRoundedIcon /> },
    { text: 'Sign Out', link: '/', action: signOut, icon: <LogoutRoundedIcon /> },
  ]

  const drawerContents = (
    <Box sx={{ width: { xs: mobileDrawerWidth, sm: desktopDrawerWidth }, p: 2 }} role="presentation" onClick={handleDrawerClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2, borderBottom: '3px solid #e5e7eb', mb: 2 }}>
        <AccountCircleRoundedIcon sx={{ fontSize: 48, color: 'grey' }} />
        <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {session?.user.email}
        </Typography>
      </Box>
      {drawerListItems.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2 }}>
          {item.icon}
          <Link to={item.link} onClick={() => { if (item.action) item.action(); handleDrawerClose(); }}>
            <Typography variant="body1" sx={{ color: 'black' }}>{item.text}</Typography>
          </Link>
        </Box>
      ))}
    </Box>
  )
  if (!session) return null;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: mobileDrawerWidth, md: desktopDrawerWidth }, flexShrink: { sm: 0, md: 0 } }}
      aria-label="navigation menu"
    >
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerClose}
        anchor="left"
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: mobileDrawerWidth },
        }}
        slotProps={{
          root: {
            keepMounted: true,
          },
        }}
      >
        {drawerContents}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: desktopDrawerWidth, bgcolor: '#FAFAFA' },
        }}
        open
      >
        {drawerContents}
      </Drawer>
    </Box>
  );
}