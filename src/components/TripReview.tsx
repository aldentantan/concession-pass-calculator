import { Box, Button, Paper } from '@mui/material';
import JourneyList from './JourneyList';
import ConcessionComparerPanel from './ConcessionComparerPanel';
import type { Journey } from '../types';
import { SummaryStatsSection } from './TripSummaryPage/SummaryStatsSection';
import { SectionHeader } from './SectionHeader';
import { TripReviewSection } from './TripSummaryPage/TripReviewSection';

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
      <SectionHeader title="Your Travel Summary" />
      <SummaryStatsSection
        totalFare={totalFare}
        numTrips={numTrips}
        busDistance={busDistance}
        mrtDistance={mrtDistance}
      />

      <SectionHeader title="Trip Review" />
      <TripReviewSection journeys={journeys} />
      
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
