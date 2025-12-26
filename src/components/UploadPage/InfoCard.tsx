import type { SvgIconComponent } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';

interface InfoCardProps {
    icon: SvgIconComponent;
    title: string;
    text: string;
}

export const InfoCard = ({ icon: Icon, title, text }: InfoCardProps) => {
    return (
        <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 2, md: 3 },
            backgroundColor: '#f9fafb',
            width: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
            gap: 1,
            boxShadow: 0
        }}>
            <Icon sx={{ fontSize: 32, color: 'secondary.main' }}/>
            <Typography variant='h4'>
                {title}
            </Typography>
            <Typography variant='subtitle1'>
                {text}
            </Typography>
        </Paper>
    )
};