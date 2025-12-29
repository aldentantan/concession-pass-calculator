import { Box, Button } from '@mui/material';
import type { ConcessionPass } from '../types';
import { SectionHeader } from '../components/SectionHeader';
import { SummaryStatsSection } from '../components/TripSummaryPage/SummaryStatsSection';
import { TripReviewSection } from '../components/TripSummaryPage/TripReviewSection';
import { PassComparisonSection } from '../components/TripSummaryPage/PassComparisonSection';
import { RecommendationSection } from '../components/TripSummaryPage/RecommendationSection';
import { useState, useMemo } from 'react';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useJourneyContext } from '../contexts/JourneyContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { RecommendationSectionMobile } from '../components/TripSummaryPage/RecommendationSectionMobile';
import { PassComparisonSectionMobile } from '../components/TripSummaryPage/PassComparisonSectionMobile';
import { TripReviewSectionMobile } from '../components/TripSummaryPage/TripReviewSectionMobile';

const PASS_OPTIONS: ConcessionPass[] = [
  {
    id: 'no-pass',
    label: 'No Pass',
    monthlyPrice: 0,
    description: `Your projected fare based on this month's travel patterns, calculated with the new fares effective from 27 Dec 2025.`,
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

export default function TripSummaryPage() {
  const [selectedPassId, setSelectedPassId] = useState<string>('no-pass');
  const { journeys, fares: calculatedFares } = useJourneyContext();

  const { totalFareWithNewPrices } = calculatedFares;
  const totalFare = journeys.reduce((sum, journey) => sum + journey.totalFare, 0); // Actual fare paid
  const numTrips = journeys.reduce((sum) => sum + 1, 0);
  const busDistance = journeys.reduce((sum, journey) => sum + journey.busDistance, 0);
  const mrtDistance = journeys.reduce((sum, journey) => sum + journey.mrtDistance, 0);

  const passComparison = useMemo(() => {
    const { totalFareExcludingBus, totalFareExcludingMrt } = calculatedFares;

    return PASS_OPTIONS.map(pass => {
      let cost: number;

      if (pass.id === 'no-pass') {
        cost = totalFareWithNewPrices;
      } else if (pass.id === 'undergrad-bus') {
        cost = totalFareExcludingBus + pass.monthlyPrice;
      } else if (pass.id === 'undergrad-mrt') {
        cost = totalFareExcludingMrt + pass.monthlyPrice;
      } else {
        cost = pass.monthlyPrice;
      }

      const savings = pass.id === 'no-pass' ? 0 : totalFareWithNewPrices - cost;

      return {
        pass,
        cost,
        savings,
        isSavingMoney: savings > 0,
      };
    });
  }, [totalFareWithNewPrices, calculatedFares]);

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

      {useIsMobile() ?
        <>
          {/* Concession Pass Recommendation Panel */}
          <RecommendationSectionMobile totalFare={totalFare} bestPass={bestPass} passOptions={passComparison} />

          {/* Concession Pass Savings Panel */}
          <SectionHeader title="Concession Pass Comparison" />
          <PassComparisonSectionMobile
            passOptions={PASS_OPTIONS}
            selectedPassId={selectedPassId}
            onPassChange={setSelectedPassId}
            selectedPassComparison={selectedPassComparison}
          />

          {/* Trip Review Panel */}
          <SectionHeader title="Your Trip Review" />
          <TripReviewSectionMobile journeys={journeys} />
        </>
        :
        <>
          {/* Trip Review Panel */}
          <SectionHeader title="Your Trip Review" />
          <TripReviewSection journeys={journeys} />

          {/* Concession Pass Savings Panel */}
          <SectionHeader title="Concession Pass Comparison" />
          <PassComparisonSection
            passOptions={PASS_OPTIONS}
            selectedPassId={selectedPassId}
            onPassChange={setSelectedPassId}
            selectedPassComparison={selectedPassComparison}
          />

          {/* Concession Pass Recommendation Panel */}
          <RecommendationSection totalFare={totalFare} bestPass={bestPass} passOptions={passComparison} />
        </>
      }

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button onClick={() => window.history.back()} startIcon={<ArrowBackIosOutlinedIcon />}>
          Back
        </Button>
      </Box>
    </Box>
  );
}
