import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { JourneyList } from './JourneyList';

import type { Journey } from '../types';

interface TripReviewProps {
  journeys: Journey[];
  onNext: () => void;
  onBack: () => void;
}

export default function TripReview({ journeys, onNext, onBack }: TripReviewProps) {
  const totalFare = journeys.reduce((sum, journey) => sum + journey.totalFare, 0);
  const numTrips = journeys.reduce((sum) => sum + 1, 0);
  const busDistance = journeys.reduce((sum, journey) => sum + journey.busDistance, 0);
  // const mrtTrips = trips.filter((trip) => trip.type === 'mrt').length;
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#03045E', mb: 2 }}>
        Review Extracted Trips
      </Typography>

      {/* Trip List */}
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '45vw', p: 5 }}>
          <Grid container spacing={5}>
            <Grid size={6} direction='row'>
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                ${totalFare.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#03045E' }}>Total Fare</Typography>
              </Paper>
            </Grid>
            <Grid size={6}>
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                {numTrips}
              </Typography>
              <Typography variant="body2" sx={{ color: '#03045E' }}>Public Transport Journeys</Typography>
              </Paper>
            </Grid>
            <Grid size={6}>
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                {busDistance.toFixed(2)} km
              </Typography>
              <Typography variant="body2" sx={{ color: '#03045E' }}>Distance travelled by Bus</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1, bgcolor: '#CAF0F8' }}>
            <JourneyList journeys={journeys} />
          </Paper>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button onClick={onBack} sx={{ bgcolor: '#90E0EF' }}>
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="contained"
          sx={{ bgcolor: '#0077B6', flex: 1 }}
        >
          Calculate Best Pass
        </Button>
      </Box>
    </Box>
  );
}