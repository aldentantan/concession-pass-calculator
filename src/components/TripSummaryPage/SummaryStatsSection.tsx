import { Paper, Typography, Grid } from '@mui/material';
import { Section } from '../Section';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import TrainOutlinedIcon from '@mui/icons-material/TrainOutlined';

interface SummaryStatsSectionProps {
  totalFare: number;
  numTrips: number;
  busDistance: number;
  mrtDistance: number;
}

export const SummaryStatsSection = ({ totalFare, numTrips, busDistance, mrtDistance }: SummaryStatsSectionProps) => {
  return (
    <Section>
      <Grid container spacing={2}>
        {/* Total Fare Card */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            p: { xs: 3, md: 4 },
            gap: 0.5,
          }}>
            <AttachMoneyOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', backgroundColor: 'background.primary', borderRadius: 1, mb: 1 }} />
            <Typography variant='h3' sx={{ fontWeight: 400 }}>${totalFare.toFixed(2)}</Typography>
            <Typography variant='body2'>
              Total Fare Paid
            </Typography>
          </Paper>
        </Grid>

        {/* Total Journeys Card */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            p: { xs: 3, md: 4 },
            gap: 0.5,
          }}>
            <PlaceOutlinedIcon sx={{ fontSize: 36, color: 'secondary.main', backgroundColor: 'background.secondary', borderRadius: 1, mb: 1 }} />
            <Typography variant='h3' sx={{ fontWeight: 400 }}>{numTrips}</Typography>
            <Typography variant='body2' textAlign="left">
              Total Journeys
            </Typography>
          </Paper>
        </Grid>

        {/* Bus Distance Card */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            p: { xs: 3, md: 4 },
            gap: 0.5,
          }}>
            <AirportShuttleOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', backgroundColor: 'background.primary', borderRadius: 1, mb: 1 }} />
            <Typography variant='h3' sx={{ fontWeight: 400 }}>{busDistance.toFixed(1)} km</Typography>
            <Typography variant='body2' textAlign="left">
              Distance By Bus
            </Typography>
          </Paper>
        </Grid>

        {/* MRT Distance Card */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            p: { xs: 3, md: 4 },
            gap: 0.5,
          }}>
            <TrainOutlinedIcon sx={{ fontSize: 36, color: 'secondary.main', backgroundColor: 'background.secondary', borderRadius: 1, mb: 1 }} />
            <Typography variant='h3' sx={{ fontWeight: 400 }}>{mrtDistance.toFixed(1)} km</Typography>
            <Typography variant='body2' textAlign="left">
              Distance By MRT
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Section>
  )
}