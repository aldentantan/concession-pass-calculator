import { Box, Typography } from '@mui/material';

export const Header = () => {
    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: '64px',
            padding: '16px',
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'flex-start',
            borderBottom: '2px solid #e5e7eb',
        }}>
            <Typography variant='h1'>
                Concession Pass Calculator
            </Typography>
        </Box>
    )
}