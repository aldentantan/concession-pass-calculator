import { Box, Paper, Typography } from '@mui/material';
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
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4
            }}>
                {/* Total Fare Card */}
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 4,
                    gap: 0.5,
                    maxWidth: '25%',
                    width: '25%'
                }}>
                    <AttachMoneyOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', backgroundColor: 'background.primary', borderRadius: 1, mb: 1 }}/>
                    <Typography variant='h3' sx={{ fontWeight: 400 }}>${totalFare.toFixed(2)}</Typography>
                    <Typography variant='body2'>
                        Total Fare
                    </Typography>
                </Paper>

                {/* Total Journeys Card */}
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 4,
                    gap: 0.5,
                    maxWidth: '25%',
                    width: '25%'
                }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 36, color: 'secondary.main', backgroundColor: 'background.secondary', borderRadius: 1, mb: 1 }}/>
                    <Typography variant='h3' sx={{ fontWeight: 400 }}>{numTrips}</Typography>
                    <Typography variant='body2'>
                        Total Journeys
                    </Typography>
                </Paper>

                {/* Bus Distance Card */}
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 4,
                    gap: 0.5,
                    maxWidth: '25%',
                    width: '25%'
                }}>
                    <AirportShuttleOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', backgroundColor: 'background.primary', borderRadius: 1, mb: 1 }}/>
                    <Typography variant='h3' sx={{ fontWeight: 400 }}>{busDistance.toFixed(1)} km</Typography>
                    <Typography variant='body2'>
                        Distance By Bus
                    </Typography>
                </Paper>

                {/* MRT Distance Card */}
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 4,
                    gap: 0.5,
                    maxWidth: '25%',
                    width: '25%'
                }}>
                    <TrainOutlinedIcon sx={{ fontSize: 36, color: 'secondary.main', backgroundColor: 'background.secondary', borderRadius: 1, mb: 1 }}/>
                    <Typography variant='h3' sx={{ fontWeight: 400 }}>{mrtDistance.toFixed(1)} km</Typography>
                    <Typography variant='body2'>
                        Distance By MRT
                    </Typography>
                </Paper>
            </Box>
        </Section>
    )
}