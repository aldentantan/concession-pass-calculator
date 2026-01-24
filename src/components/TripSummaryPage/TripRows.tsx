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
            {/* Trip Time */}
            <Box sx={{ flexShrink: 0, width: '80px' }}>
              <Typography variant='body1' sx={{ whiteSpace: 'nowrap' }}>{trip.time}</Typography>
            </Box>

            {/* Trip Type Badge */}
            <Box sx={{ flexShrink: 0, width: '120px', backgroundColor: trip.type === 'bus' ? 'primary.light' : 'secondary.light', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, gap: 0.75 }}>
              {trip.type === 'bus' ? <AirportShuttleOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} /> : <TrainOutlinedIcon sx={{ fontSize: 16, color: 'secondary.main' }} />}
              <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>{trip.type === 'bus' ? `Bus ${trip.busService}` : 'MRT'}</Typography>
            </Box>

            {/* Location - fills remaining space */}
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography variant='body1' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                {trip.startLocation} → {trip.endLocation}
              </Typography>
            </Box>

            {/* Warning Badge and Fare */}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              {issue && (
                <Tooltip title={issue.message + ". Distance and fare for this trip will not be included in the comparison below."} placement="top" arrow>
                  <Box sx ={{ display: 'flex', alignItems: 'center', backgroundColor: 'warning.light', borderRadius: 1.5, px: 1, py: 0.2, gap: 1, whiteSpace: 'nowrap' }}>
                    <WarningAmberRoundedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography>Incomplete Data</Typography>
                  </Box>
                </Tooltip>
              )}
              <Typography variant='h3' sx={{ fontWeight: 400, whiteSpace: 'nowrap' }}>
                ${trip.fare.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </>
  )
}