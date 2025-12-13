import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Header = () => {
    const { session, signOut } = useAuth();

    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: '64px',
            padding: '16px',
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #e5e7eb',
        }}>
            <Typography variant='h1'>
                Concession Pass Calculator
            </Typography>
            {session && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, p: 2 }}>
                    <Typography variant='body1'>
                        {session.user.email}
                    </Typography>
                    <Link to="/" onClick={signOut}>Sign Out</Link>
                </Box>
            )}
        </Box>
    )
}