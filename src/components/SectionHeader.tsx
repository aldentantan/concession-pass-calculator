import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
    title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
        }}>
            <Typography variant='h2'>
                {title}
            </Typography>
        </Box>
    )
}