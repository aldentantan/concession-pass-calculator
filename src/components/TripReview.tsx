import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import JourneyList from './JourneyList';
import ConcessionComparerPanel from './ConcessionComparerPanel';
import type { Journey } from '../types';

interface TripReviewProps {
  journeys: Journey[];
  fares: {
    totalFareExcludingBus: number;
    totalFareExcludingMrt: number;
  };
  onNext: () => void;
  onBack: () => void;
}

export default function TripReview({ journeys, fares, onNext, onBack }: TripReviewProps) {
  const totalFare = journeys.reduce((sum, journey) => sum + journey.totalFare, 0);
  const numTrips = journeys.reduce((sum) => sum + 1, 0);
  const busDistance = journeys.reduce((sum, journey) => sum + journey.busDistance, 0);
  const mrtDistance = journeys.reduce((sum, journey) => sum + journey.mrtDistance, 0);

  return (
    <Box sx={{ maxWidth: '80vw', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#03045E', mb: 2 }}>
        Review Extracted Trips
      </Typography>

      {/* Summary + Trip List */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', p: 2, justifyContent: 'center' }}>
          <Grid container spacing={7}>
            <Grid size={3} direction="row">
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                  ${totalFare.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#03045E' }}>
                  Total Fare
                </Typography>
              </Paper>
            </Grid>
            <Grid size={3}>
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                  {numTrips}
                </Typography>
                <Typography variant="body2" sx={{ color: '#03045E' }}>
                  Public Transport Journeys
                </Typography>
              </Paper>
            </Grid>
            <Grid size={3}>
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                  {busDistance.toFixed(0)} km
                </Typography>
                <Typography variant="body2" sx={{ color: '#03045E' }}>
                  Distance travelled by Bus
                </Typography>
              </Paper>
            </Grid>
            <Grid size={3}>
              <Paper sx={{ p: 2, bgcolor: '#CAF0F8' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
                  {mrtDistance.toFixed(0)} km
                </Typography>
                <Typography variant="body2" sx={{ color: '#03045E' }}>
                  Distance travelled by MRT
                </Typography>
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

      {/* Concession Pass Savings Panel */}
      <ConcessionComparerPanel totalFare={totalFare} fares={fares} />

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
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
