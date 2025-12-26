import { Box, Typography, Tooltip } from '@mui/material';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import TrainOutlinedIcon from '@mui/icons-material/TrainOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import type { Trip, TripIssue } from '../../types';

interface TripRowsProps {
  trips: Trip[];
  tripIssues: TripIssue[];
}

export const TripRows = ({ trips, tripIssues }: TripRowsProps) => {
  const getTripIssue = (tripIndex: number): TripIssue | undefined => {
    return tripIssues.find(issue => issue.tripIndex === tripIndex);
  };

  return (
    <>
      {trips.map((trip, tripIndex) => {
        const issue = getTripIssue(tripIndex);

        return (
          <Box key={tripIndex} sx={{ display: 'flex', flexDirection: 'row', backgroundColor: '#f9fafb', pt: 1, pb: 1, pl: 3, pr: 3, borderTop: '1px solid #e5e7eb', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '9%' }}>
              <Typography variant='body1'>{trip.time}</Typography>
            </Box>

            <Box sx={{ width: '11%', backgroundColor: trip.type === 'bus' ? 'primary.light' : 'secondary.light', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, gap: 0.75, maxWidth: '108px' }}>
              {trip.type === 'bus' ? <AirportShuttleOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} /> : <TrainOutlinedIcon sx={{ fontSize: 16, color: 'secondary.main' }} />}
              <Typography variant='body2'>{trip.type === 'bus' ? `Bus ${trip.busService}` : 'MRT'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant='body1'>
                {trip.startLocation} → {trip.endLocation}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                {issue && (
                  <Tooltip title={issue.message + ". Distance and fare for this trip will not be included in the comparison below."} placement="top" arrow>
                    <Box sx ={{ display: 'flex', alignItems: 'center', backgroundColor: 'warning.light', borderRadius: 1.5, px: 1, py: 0.2, gap: 1 }}>
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
          </Box>
        )
      })}
    </>
  )
}