import { Box, Typography, IconButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

interface HeaderProps {
  toggleDrawer: () => void;
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
  const { session } = useAuth();
  const location = useLocation();
  const isResetPasswordPage = location.pathname === '/reset-password';
  const isMobile = useIsMobile();

  const showDrawer = session && !isResetPasswordPage;
  const desktopDrawerWidth = 300;

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
      justifyContent: 'center',
      borderBottom: '2px solid #e5e7eb',
      zIndex: 1200,
    }}>
      {isMobile && showDrawer && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: 'absolute', left: 8 }}
        >
          <MenuRoundedIcon sx={{ fontSize: '24px', color: 'black' }} />
        </IconButton>
      )}
      <Typography
        variant="h1"
        sx={{
          marginLeft: {
            xs: 0,
            md: showDrawer ? `${desktopDrawerWidth}px` : 0
          }
        }}
      >
        Concession Pass Calculator
      </Typography>
    </Box>
  );
}