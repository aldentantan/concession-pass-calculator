import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
    title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            p: 4
        }}>
            <Typography variant='h3'>
                {title}
            </Typography>
        </Box>
    )
}