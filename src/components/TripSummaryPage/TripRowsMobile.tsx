import { Box, Typography, Tooltip } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import type { Trip, TripIssue } from '../../types';

interface TripRowsMobileProps {
  trips: Trip[];
  tripIssues: TripIssue[];
}

export const TripRowsMobile = ({ trips, tripIssues }: TripRowsMobileProps) => {
  const getTripIssue = (tripIndex: number): TripIssue | undefined => {
    return tripIssues.find(issue => issue.tripIndex === tripIndex);
  };

  return (
    <>
      {trips.map((trip, tripIndex) => {
        const issue = getTripIssue(tripIndex);

        return (
          <Box key={tripIndex} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography variant='body1'>{trip.time} · {trip.type === 'bus' ? `Bus ${trip.busService}` : 'MRT'}</Typography>
              <Box>
                {issue && (
                  <Tooltip title={issue.message + ". Distance and fare for this trip will not be included in the comparison below."} placement="top" arrow>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'warning.light', borderRadius: 1.5, px: 1, py: 0.2, gap: 1 }}>
                      <WarningAmberRoundedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography>Incomplete Data</Typography>
                    </Box>
                  </Tooltip>
                )}
                <Typography variant='h3' sx={{ fontWeight: 400 }}>
                  ${trip.fare.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Typography variant='body2' textAlign='left'>
              {trip.startLocation} → {trip.endLocation}
            </Typography>
          </Box>
        )
      })}
    </>
  )
}