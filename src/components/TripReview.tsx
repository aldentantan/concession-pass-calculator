import { Box, Button } from '@mui/material';
import type { Journey, ConcessionPass } from '../types';
import { SummaryStatsSection } from './TripSummaryPage/SummaryStatsSection';
import { SectionHeader } from './SectionHeader';
import { TripReviewSection } from './TripSummaryPage/TripReviewSection';
import { PassComparisonSection } from './TripSummaryPage/PassComparisonSection';
import { RecommendationSection } from './TripSummaryPage/RecommendationSection';
import { useState, useMemo } from 'react';

interface TripReviewProps {
  journeys: Journey[];
  calculatedFares: {
    totalFareExcludingBus: number;
    totalFareExcludingMrt: number;
  };
  onNext: () => void;
  onBack: () => void;
}

const PASS_OPTIONS: ConcessionPass[] = [
    {
      id: 'no-pass',
      label: 'No Pass',
      monthlyPrice: 0,
      description: 'Your current fares, excluding concession pass price (if you had purchased one).',
    },
    {
      id: 'undergrad-bus',
      label: 'Undergrad Bus',
      monthlyPrice: 55.50,
      description: 'Unlimited bus travel. Best if you primarily use buses for your commute.',
    },
    {
      id: 'undergrad-mrt',
      label: 'Undergrad MRT',
      monthlyPrice: 48,
      description: 'Unlimited MRT/LRT travel. Best if you primarily use MRT/LRT for your commute.',
    },
    {
      id: 'undergrad-hybrid',
      label: 'Undergrad Hybrid',
      monthlyPrice: 81,
      description: 'Unlimited bus and MRT/LRT travel. Best value for mixed-mode commuters.',
    },
  ];

export default function TripReview({ journeys, calculatedFares, onNext, onBack }: TripReviewProps) {
  const [selectedPassId, setSelectedPassId] = useState<string>('no-pass');

  const totalFare = journeys.reduce((sum, journey) => sum + journey.totalFare, 0);
  const numTrips = journeys.reduce((sum) => sum + 1, 0);
  const busDistance = journeys.reduce((sum, journey) => sum + journey.busDistance, 0);
  const mrtDistance = journeys.reduce((sum, journey) => sum + journey.mrtDistance, 0);

  const passComparison = useMemo(() => {
    const { totalFareExcludingBus, totalFareExcludingMrt } = calculatedFares;

    return PASS_OPTIONS.map(pass => {
      let cost: number;

      if (pass.id === 'no-pass') {
        cost = totalFare;
      } else if (pass.id === 'undergrad-bus') {
        cost = totalFareExcludingBus + pass.monthlyPrice;
      } else if (pass.id === 'undergrad-mrt') {
        cost = totalFareExcludingMrt + pass.monthlyPrice;
      } else {
        cost = pass.monthlyPrice;
      }

      const savings = pass.id === 'no-pass' ? 0 : totalFare - cost;

      return {
        pass,
        cost,
        savings,
        isSavingMoney: savings > 0,
      };
    });
  }, [totalFare, calculatedFares]);

  const bestPass = useMemo(() => {
    return passComparison.reduce((best, current) =>
      current.savings > best.savings ? current : best
    );
  }, [passComparison]);

  const selectedPassComparison = passComparison.find(p => p.pass.id === selectedPassId)!;

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
      <PassComparisonSection
        passOptions={PASS_OPTIONS}
        selectedPassId={selectedPassId}
        onPassChange={setSelectedPassId}
        selectedPassComparison={selectedPassComparison}
      />

      <RecommendationSection totalFare={totalFare} bestPass={bestPass} passOptions={passComparison} />

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
