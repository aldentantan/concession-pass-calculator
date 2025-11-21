import { Box, Paper, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  removeTrip: (id: number) => void;
}

// Hardcoded data for MVP
const busServices: string[] = ['2', '12', '14', '36', '64', '100', '167', '190'];
const busDirections: string[] = ['Direction 1', 'Direction 2'];
const busStops: string[] = [
  'Bus Interchange',
  'Bus Stop 1',
  'Bus Stop 2',
  'Bus Stop 3',
  'Bus Interchange 2'
];

const mrtStations: string[] = [
  'Jurong East',
  'Bukit Batok',
  'Bukit Gombak',
  'Choa Chu Kang',
  'Yew Tee',
  'Kranji',
  'Marsiling',
  'Woodlands',
  'Admiralty',
  'Sembawang',
  'Yishun',
  'Khatib',
  'Yio Chu Kang',
  'Ang Mo Kio',
  'Bishan',
  'Braddell',
  'Toa Payoh',
  'Novena',
  'Newton',
  'Orchard',
  'Somerset',
  'Dhoby Ghaut',
  'City Hall',
  'Raffles Place',
  'Marina Bay',
  'Marina South Pier'
];

const selectSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fff',
      borderRadius: 2
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#90E0EF'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0077B6'
    }
  };

const TripCard = ({ trip, removeTrip }: TripCardProps) => {

  const index = trip.id;

  return (
    <Paper
      key={trip.id}
      variant="outlined"
      sx={{
        border: '2px solid #90E0EF',
        borderRadius: 2,
        p: 2,
        bgcolor: 'rgba(202,240,248,0.3)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 600, color: '#03045E' }}>
            Trip {index + 1} - {trip.type.toUpperCase()}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => removeTrip(trip.id)} aria-label="remove" >
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </Box>

      {trip.type === 'bus' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth sx={selectSx}>
            <InputLabel id={`bus-service-label-${trip.id}`}>Bus Service</InputLabel>
            <Select
              labelId={`bus-service-label-${trip.id}`}
              value={trip.busService}
              label="Bus Service"
            >
              <MenuItem value=""><em>Select bus service</em></MenuItem>
              {busServices.map(service => (
                <MenuItem key={service} value={service}>Bus {service}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={selectSx}>
            <InputLabel id={`direction-label-${trip.id}`}>Direction</InputLabel>
            <Select
              labelId={`direction-label-${trip.id}`}
              value={trip.direction}
              label="Direction"
              disabled={!trip.busService}
            >
              <MenuItem value=""><em>Select direction</em></MenuItem>
              {busDirections.map(dir => (
                <MenuItem key={dir} value={dir}>{dir}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid size={6}>
              <FormControl fullWidth sx={selectSx}>
                <InputLabel id={`start-stop-label-${trip.id}`}>Start Stop</InputLabel>
                <Select
                  labelId={`start-stop-label-${trip.id}`}
                  value={trip.startStop}
                  label="Start Stop"
                  disabled={!trip.direction}
                >
                  <MenuItem value=""><em>Select start stop</em></MenuItem>
                  {busStops.map(stop => (
                    <MenuItem key={stop} value={stop}>{stop}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <FormControl fullWidth sx={selectSx}>
                <InputLabel id={`end-stop-label-${trip.id}`}>End Stop</InputLabel>
                <Select
                  labelId={`end-stop-label-${trip.id}`}
                  value={trip.endStop}
                  label="End Stop"
                  disabled={!trip.startStop}
                >
                  <MenuItem value=""><em>Select end stop</em></MenuItem>
                  {busStops.map(stop => (
                    <MenuItem key={stop} value={stop}>{stop}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid size={6}>
            <FormControl fullWidth sx={selectSx}>
              <InputLabel id={`start-station-label-${trip.id}`}>Start Station</InputLabel>
              <Select
                labelId={`start-station-label-${trip.id}`}
                value={trip.startStation}
                label="Start Station"
              >
                <MenuItem value=""><em>Select start station</em></MenuItem>
                {mrtStations.map(station => (
                  <MenuItem key={station} value={station}>{station}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth sx={selectSx}>
              <InputLabel id={`end-station-label-${trip.id}`}>End Station</InputLabel>
              <Select
                labelId={`end-station-label-${trip.id}`}
                value={trip.endStation}
                label="End Station"
                disabled={!trip.startStation}
              >
                <MenuItem value=""><em>Select end station</em></MenuItem>
                {mrtStations.map(station => (
                  <MenuItem key={station} value={station}>{station}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default TripCard;