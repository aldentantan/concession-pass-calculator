import { Section } from '../Section';
import type { Journey } from '../../types';
import { JourneyCardsMobile } from './JourneyCardsMobile';
import { Box, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface TripReviewSectionMobileProps {
  journeys: Journey[];
}

export const TripReviewSectionMobile = ({ journeys }: TripReviewSectionMobileProps) => {
  const numTripsWithIssues = journeys.reduce((count, journey) => {
    return count + journey.tripIssues.length;
  }, 0);

  return (
    <Section>
      {numTripsWithIssues > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: 'warning.light', borderRadius: 1 }}>
          <WarningAmberRoundedIcon sx={{ color: 'warning.main', fontSize: 24, verticalAlign: 'middle', mr: 1 }} />
          <Typography variant='body1' >
            Note: {numTripsWithIssues} trip{numTripsWithIssues > 1 ? 's have' : ' has'} incomplete data and were excluded from distance and fare calculations.
          </Typography>
        </Box>
      )}
      <JourneyCardsMobile journeys={journeys} />
    </Section>
  )
};