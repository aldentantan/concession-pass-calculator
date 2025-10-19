import { Box, Button, Paper, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { ParsedTrip } from '../types';

// Concession pass prices (adjust to actual 2025 prices)
const PASS_PRICES = {
  bus: 45,
  mrt: 55,
  hybrid: 85
};

interface PassRecommendationProps {
  trips: ParsedTrip[];
  onBack: () => void;
}

export default function PassRecommendation({ trips, onBack }: PassRecommendationProps) {
  const totalFare = trips.reduce((sum, trip) => sum + trip.fare, 0);
  const busFare = trips.filter(t => t.type === 'bus').reduce((sum, t) => sum + t.fare, 0);
  const mrtFare = trips.filter(t => t.type === 'mrt').reduce((sum, t) => sum + t.fare, 0);

  // Calculate savings for each pass type
  const busSavings = busFare - PASS_PRICES.bus;
  const mrtSavings = mrtFare - PASS_PRICES.mrt;
  const hybridSavings = totalFare - PASS_PRICES.hybrid;

  // Determine best option
  const bestPass = Math.max(busSavings, mrtSavings, hybridSavings);
  let recommendation: 'bus' | 'mrt' | 'hybrid' | 'none' = 'none';

  if (bestPass > 0) {
    if (bestPass === hybridSavings) recommendation = 'hybrid';
    else if (bestPass === mrtSavings) recommendation = 'mrt';
    else recommendation = 'bus';
  }

  const passDetails = {
    bus: { name: 'Bus Concession Pass', price: PASS_PRICES.bus, savings: busSavings },
    mrt: { name: 'MRT Concession Pass', price: PASS_PRICES.mrt, savings: mrtSavings },
    hybrid: { name: 'MRT + Bus Concession Pass', price: PASS_PRICES.hybrid, savings: hybridSavings }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#03045E', mb: 3 }}>
        Your Personalized Recommendation
      </Typography>

      {recommendation === 'none' ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#FFF3CD' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            No Pass Recommended
          </Typography>
          <Typography>
            Your monthly fare (${totalFare.toFixed(2)}) is lower than all concession pass prices.
            Continue paying per trip for better value.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Recommended Pass */}
          <Paper sx={{ p: 4, mb: 3, bgcolor: '#D4F1F4', border: '3px solid #0077B6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#0077B6' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#03045E' }}>
                {passDetails[recommendation].name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Pass Price:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${passDetails[recommendation].price}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Your Total Fare:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${totalFare.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#0077B6', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                Monthly Savings:
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                ${passDetails[recommendation].savings.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          {/* Other Options */}
          <Typography variant="h6" sx={{ mb: 2 }}>Other Options</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {(Object.keys(passDetails) as Array<'bus' | 'mrt' | 'hybrid'>)
              .filter(key => key !== recommendation)
              .map(key => (
                <Paper key={key} sx={{ p: 2, flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    {passDetails[key].name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#0077B6', mb: 1 }}>
                    ${passDetails[key].price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: passDetails[key].savings > 0 ? 'success.main' : 'error.main' }}>
                    {passDetails[key].savings > 0 ? 'Save' : 'Lose'} ${Math.abs(passDetails[key].savings).toFixed(2)}
                  </Typography>
                </Paper>
              ))}
          </Box>
        </>
      )}

      <Button onClick={onBack} sx={{ bgcolor: '#90E0EF' }}>
        Back to Trips
      </Button>
    </Box>
  );
}