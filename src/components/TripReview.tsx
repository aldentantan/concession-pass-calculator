import { Box, Button } from '@mui/material';
import ConcessionComparerPanel from './ConcessionComparerPanel';
import type { Journey } from '../types';
import { SummaryStatsSection } from './TripSummaryPage/SummaryStatsSection';
import { SectionHeader } from './SectionHeader';
import { TripReviewSection } from './TripSummaryPage/TripReviewSection';
import { PassComparisonSection } from './TripSummaryPage/PassComparisonSection';

interface TripReviewProps {
  journeys: Journey[];
  calculatedFares: {
    totalFareExcludingBus: number;
    totalFareExcludingMrt: number;
  };
  onNext: () => void;
  onBack: () => void;
}

export default function TripReview({ journeys, calculatedFares, onNext, onBack }: TripReviewProps) {
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
      <SectionHeader title="Concession Pass Comparison" />
      <PassComparisonSection totalFare={totalFare} calculatedFares={calculatedFares}/>
      
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
