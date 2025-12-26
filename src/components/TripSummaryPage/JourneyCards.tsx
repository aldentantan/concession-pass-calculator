import type { Journey } from '../../types';
import { Paper, Box, Typography } from '@mui/material';
import { TripRows } from './TripRows';

interface JourneyCardsProps {
  journeys: Journey[];
}

export const JourneyCards = ({ journeys }: JourneyCardsProps) => {
  return (
    <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column', overflow: 'auto', height: '70vh', border: '1px solid #e5e7eb', p: 2, borderRadius: '6px' }}>
      {journeys.map((journey, index) => (
        <Paper key={index} elevation={0} sx={{ border: '1px solid #c0c0c0ff', overflow: 'hidden', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ml: 3, mr: 3, mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant='h3' sx={{ fontWeight: 400, mb: 1 }}>
                {journey.date} ({journey.day})
              </Typography>
              <Typography variant='body2'>{journey.startLocation} → {journey.endLocation}</Typography>
            </Box>
            <Box>
              <Typography variant='h3' sx={{ textDecoration: 'underline' }}>
                ${journey.totalFare.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <TripRows trips={journey.trips} tripIssues={journey.tripIssues}/>
        </Paper>
      ))}
    </Box>
  );
};