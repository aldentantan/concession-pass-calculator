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
        <IconButton onClick={toggleDrawer}>
          <MenuRoundedIcon sx={{ fontSize: '24px', color: 'black' }} />
        </IconButton>
      }
      <Typography variant="h1" sx={{ position: 'absolute', left: '50%', transform: { xs: 'translateX(-50%)', md: 'translateX(calc(-50% + 150px))' }, width: 'max-content' }}>
        Concession Pass Calculator
      </Typography>
    </Box>
  )
}