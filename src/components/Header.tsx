import { Box, Typography, Drawer, IconButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { useState } from 'react';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export const Header = () => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const isResetPasswordPage = location.pathname === '/reset-password';
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }
  const drawerListItems = [
    { text: 'Upload PDF', link: '/upload', icon: <FileUploadRoundedIcon /> },
    { text: 'Your PDFs', link: '/statements', icon: <FolderCopyRoundedIcon /> },
    { text: 'Sign Out', link: '/', action: signOut, icon: <LogoutRoundedIcon /> },
  ]

  const drawerContents = (
    <Box sx={{ width: { xs: 300, sm: 350 }, p: 2 }} role="presentation" onClick={toggleDrawer}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2, borderBottom: '1px solid #e5e7eb', mb: 2 }}>
        <AccountCircleRoundedIcon sx={{ fontSize: 48, color: 'grey' }} />
        <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {session?.user.email}
        </Typography>
      </Box>
      {drawerListItems.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2 }}>
          {item.icon}
          <Link to={item.link} onClick={() => { if (item.action) item.action(); toggleDrawer(); }}>
            <Typography variant="body1" sx={{ color: 'black' }}>{item.text}</Typography>
          </Link>
        </Box>
      ))}
    </Box>
  )

  return (
    <Box sx={{
      position: 'sticky',
      top: 0,
      width: '100%',
      height: '64px',
      padding: '8px',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: { xs: 'flex-start', md: 'space-between' },
      borderBottom: '2px solid #e5e7eb',
    }}>
      {isMobile && session && !isResetPasswordPage &&
        <>
          <IconButton onClick={toggleDrawer}>
            <MenuRoundedIcon sx={{ fontSize: '24px', color: 'black' }} />
          </IconButton>
          <Drawer open={drawerOpen} onClose={toggleDrawer} anchor="left">
            {drawerContents}
          </Drawer>
        </>
      }
      <Typography variant="h1" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'max-content' }}>
        Concession Pass Calculator
      </Typography>
      {isMobile ? null : (
        session && !isResetPasswordPage && (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, p: 2 }}>
            <Link to="/upload">Upload</Link>
            <Link to="/statements">Statements</Link>
            <Typography variant="body1">
              {session.user.email}
            </Typography>
            <Link to="/" onClick={signOut}>Sign Out</Link>
          </Box>
        )
      )}
    </Box>
  )
}