import type { Journey } from '../../types';
import { Paper, Box, Typography } from '@mui/material';
import { TripRowsMobile } from './TripRowsMobile';

interface JourneyCardsMobileProps {
  journeys: Journey[];
}

export const JourneyCardsMobile = ({ journeys }: JourneyCardsMobileProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto',  gap: 2 }}>
      {journeys.map((journey, index) => (
        <Paper key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'space-between', border: '1px solid #e5e7eb', borderRadius: '6px', borderBottom: '1px solid #e0e0e0', px: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant='h3' sx={{ fontWeight: 400, mb: 1 }}>
                {index + 1}. {journey.date} ({journey.day})
              </Typography>
              <Typography variant='body2'>{journey.startLocation}</Typography>
              <Typography variant='body2'>→ {journey.endLocation}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant='h3' sx={{ textDecoration: 'underline' }}>
                ${journey.totalFare.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <TripRowsMobile trips={journey.trips} tripIssues={journey.tripIssues}/>
        </Paper>
      ))}

    </Box>
  );
};