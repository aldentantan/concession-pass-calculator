import { Section } from '../Section';
import type { Journey } from '../../types';
import { JourneyCards } from './JourneyCards';
import { Box, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface TripReviewSectionProps {
    journeys: Journey[];
}

export const TripReviewSection = ({ journeys }: TripReviewSectionProps) => {
    const numTripsWithIssues = journeys.reduce((count, journey) => {
        return count + journey.tripIssues.length;
    }, 0);

    return (
        <Section>
            {numTripsWithIssues > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'row',mb: 2, p: 2, backgroundColor: 'warning.light', borderRadius: 1 }}>
                    <WarningAmberRoundedIcon sx={{ color: 'warning.main', fontSize: 24, verticalAlign: 'middle', mr: 1 }} />
                    <Typography variant='body1' >
                        Note: {numTripsWithIssues} trip{numTripsWithIssues > 1 ? 's have' : ' has'} incomplete data and were excluded from distance and fare calculations.
                    </Typography>
                </Box>
            )}
            <JourneyCards journeys={journeys} />
        </Section>
    )
};