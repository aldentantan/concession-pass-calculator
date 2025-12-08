import type { ReactNode } from 'react';
import { Box } from '@mui/material'

interface SectionProps {
    children: ReactNode;
}

export const Section = ({ children }: SectionProps) => {
    return (
        <Box sx={{
            width: '100%',
            mb: 4,
            mt: 2
        }}>
            {children}
        </Box>
    )
}