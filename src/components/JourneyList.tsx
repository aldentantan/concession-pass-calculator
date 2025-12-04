import { Box, Chip, Paper, Typography } from '@mui/material';
import React from 'react';
import type { Journey } from '../types';

interface JourneyListProps {
  journeys: Journey[];
}

const JourneyList: React.FC<JourneyListProps> = ({ journeys }) => {
  if (!journeys || !Array.isArray(journeys)) {
    console.error('Invalid journeys data:', journeys);
    return (
      <Typography variant="body1" color="error">
        No journeys data available
      </Typography>
    );
  }

  if (journeys.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No journeys found
      </Typography>
    );
  }

  return (
    <Box>
      {journeys.map((journey, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: '#F8F9FA',
            border: '1px solid #E9ECEF'
          }}
        >
          {/* Journey Header */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pl: 1, pr: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#03045E' }}>
              {journey.date} ({journey.day})
            </Typography>
            <Typography variant="body2" sx={{ color: '#6C757D', mt: 0.5, fontWeight: 'bold' }}>
              {journey.startLocation} → {journey.endLocation}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#0077B6', mt: 0.5 }}>
              Total: ${journey.totalFare.toFixed(2)}
            </Typography>
          </Box>

          {/* Trips List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {journey.trips.map((trip, tripIndex) => (
              <Box
                key={tripIndex}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1,
                  bgcolor: '#fff',
                  borderRadius: 1,
                  border: '1px solid #DEE2E6'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ minWidth: '70px', color: '#495057', fontWeight: 600 }}
                >
                  {trip.time}
                </Typography>

                <Chip
                  label={trip.type === 'bus' ? `Bus ${trip.busService}` : 'MRT'}
                  size="small"
                  sx={{
                    bgcolor: trip.type === 'bus' ? '#90E0EF' : '#0077B6',
                    color: '#fff',
                    fontWeight: 600,
                    minWidth: '80px'
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ flex: 1, color: '#495057', fontSize: '0.875rem' }}
                >
                  {trip.startLocation} → {trip.endLocation}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: '#0077B6', minWidth: '60px', textAlign: 'right' }}
                >
                  ${trip.fare.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default JourneyList;