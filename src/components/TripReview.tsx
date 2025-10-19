import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Chip, IconButton, Paper, Typography } from '@mui/material';

import type { ParsedTrip } from '../types';

interface TripReviewProps {
  trips: ParsedTrip[];
  onNext: () => void;
  onBack: () => void;
  onTripsUpdate: (trips: ParsedTrip[]) => void;
}

export default function TripReview({ trips, onNext, onBack, onTripsUpdate }: TripReviewProps) {
  const totalFare = trips.reduce((sum, trip) => sum + trip.fare, 0);
  const busTrips = trips.filter(t => t.type === 'bus').length;
  const mrtTrips = trips.filter(t => t.type === 'mrt').length;

  const handleDelete = (index: number) => {
    onTripsUpdate(trips.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#03045E', mb: 2 }}>
        Review Extracted Trips
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, bgcolor: '#CAF0F8' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
            ${totalFare.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ color: '#03045E' }}>Total Fare</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, bgcolor: '#CAF0F8' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0077B6' }}>
            {trips.length}
          </Typography>
          <Typography variant="body2" sx={{ color: '#03045E' }}>Total Trips</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, bgcolor: '#CAF0F8' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#0077B6' }}>
            {busTrips} Bus | {mrtTrips} MRT
          </Typography>
          <Typography variant="body2" sx={{ color: '#03045E' }}>Trip Breakdown</Typography>
        </Paper>
      </Box>

      {/* Trip List */}
      <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 3 }}>
        {trips.map((trip, index) => (
          <Paper key={index} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={trip.type.toUpperCase()}
              sx={{
                bgcolor: trip.type === 'bus' ? '#90E0EF' : '#0077B6',
                color: '#fff',
                fontWeight: 600
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {trip.startLocation} → {trip.endLocation}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {trip.date} {trip.busService ? `• Bus ${trip.busService}` : ''}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#0077B6' }}>
              ${trip.fare.toFixed(2)}
            </Typography>
            <IconButton size="small" onClick={() => handleDelete(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
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