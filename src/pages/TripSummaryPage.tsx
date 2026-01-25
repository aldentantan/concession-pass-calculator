import { Box, Button, Paper, Typography, Alert, Chip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { ConcessionPass } from '../types';
import { SectionHeader } from '../components/SectionHeader';
import { SummaryStatsSection } from '../components/TripSummaryPage/SummaryStatsSection';
import { TripReviewSection } from '../components/TripSummaryPage/TripReviewSection';
import { PassComparisonSection } from '../components/TripSummaryPage/PassComparisonSection';
import { RecommendationSection } from '../components/TripSummaryPage/RecommendationSection';
import { useState, useMemo, useEffect } from 'react';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useJourneyContext } from '../contexts/JourneyContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { RecommendationSectionMobile } from '../components/TripSummaryPage/RecommendationSectionMobile';
import { PassComparisonSectionMobile } from '../components/TripSummaryPage/PassComparisonSectionMobile';
import { TripReviewSectionMobile } from '../components/TripSummaryPage/TripReviewSectionMobile';
import { detectCoverageGaps } from '../utils/detectCoverageGaps';
import { calculateWindowComparison } from '../utils/calculateWindowComparison';
import { fetchTripsInDateRange } from '../services/statementsService';
import type { TripWithMetadata } from '../types';

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
  const { journeys, fares: calculatedFares, statements } = useJourneyContext();
  const isMobile = useIsMobile(); // Call hook at top level, not inside conditional

  // Date picker state for 30-day window selection
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);

  // Trips within the selected window
  const [windowTrips, setWindowTrips] = useState<TripWithMetadata[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [concessionFares, setConcessionFares] = useState<{
    totalFareExcludingBus: number;
    totalFareExcludingMrt: number;
  }>({ totalFareExcludingBus: 0, totalFareExcludingMrt: 0 });

  // Calculate earliest trip date from journeys to set default start date
  const earliestTripDate = useMemo(() => {
    if (journeys.length === 0) return null;
    const sortedDates = journeys
      .map(j => j.date)
      .sort((a, b) => a.localeCompare(b));
    return dayjs(sortedDates[0]);
  }, [journeys]);

  // Detect coverage gaps when dates or statements change
  const coverageResult = useMemo(() => {
    return detectCoverageGaps(statements, selectedStartDate, selectedEndDate);
  }, [statements, selectedStartDate, selectedEndDate]);

  // Manual function to fetch trips for selected window
  const loadWindowTrips = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      console.log('⏳ Waiting for date selection...');
      return;
    }

    console.log('🔄 Fetching trips for range:', {
      start: selectedStartDate.format('YYYY-MM-DD'),
      end: selectedEndDate.format('YYYY-MM-DD')
    });

    setLoadingTrips(true);
    setHasCalculated(true);
    try {
      const response = await fetchTripsInDateRange(
        selectedStartDate.format('YYYY-MM-DD'),
        selectedEndDate.format('YYYY-MM-DD')
      );
      console.log('✅ API Response:', response);
      console.log('📊 Trips received:', response.trips?.length || 0);
      console.log('💰 Concession fares:', response.concessionFares);
      setWindowTrips(response.trips || []);
      setConcessionFares(response.concessionFares || { totalFareExcludingBus: 0, totalFareExcludingMrt: 0 });
    } catch (error) {
      console.error('❌ Error fetching window trips:', error);
      setWindowTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  // Initialize default start date and calculate end date
  useEffect(() => {
    if (earliestTripDate && !selectedStartDate) {
      setSelectedStartDate(earliestTripDate);
      setSelectedEndDate(earliestTripDate.add(29, 'day')); // 30 days inclusive (start + 29)
    }
  }, [earliestTripDate, selectedStartDate]);

  // Update end date when start date changes (30-day window)
  const handleStartDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedStartDate(newDate);
      setSelectedEndDate(newDate.add(29, 'day')); // 30 days inclusive
      setHasCalculated(false); // Reset calculation state when date changes
    }
  };

  // Calculate window-based metrics from fetched trips
  const windowMetrics = useMemo(() => {
    if (windowTrips.length === 0) {
      return {
        paygTotal: 0,
        tripCount: 0,
        busTrips: 0,
        mrtTrips: 0,
        busDistance: 0,
        mrtDistance: 0,
      };
    }

    const paygTotal = windowTrips.reduce((sum, trip) => sum + trip.fare, 0);
    const busTrips = windowTrips.filter(t => t.mode === 'bus').length;
    const mrtTrips = windowTrips.filter(t => t.mode === 'mrt').length;
    const busDistance = windowTrips
      .filter(t => t.mode === 'bus')
      .reduce((sum, trip) => sum + trip.distance, 0);
    const mrtDistance = windowTrips
      .filter(t => t.mode === 'mrt')
      .reduce((sum, trip) => sum + trip.distance, 0);

    return {
      paygTotal: Math.round(paygTotal * 100) / 100,
      tripCount: windowTrips.length,
      busTrips,
      mrtTrips,
      busDistance: Math.round(busDistance * 100) / 100,
      mrtDistance: Math.round(mrtDistance * 100) / 100,
    };
  }, [windowTrips]);

  // Calculate pass comparison for the selected window
  const passComparison = useMemo(() => {
    return PASS_OPTIONS.map(pass => {
      let totalCost: number;
      let savings: number;
      const paygTotal = windowMetrics.paygTotal;

      if (pass.id === 'no-pass') {
        // No pass: just pay-as-you-go
        totalCost = paygTotal;
        savings = 0;
      } else if (pass.id === 'undergrad-mrt') {
        // MRT pass: $48 for unlimited MRT + pay for bus trips
        totalCost = pass.monthlyPrice + concessionFares.totalFareExcludingMrt;
        savings = paygTotal - totalCost;
      } else if (pass.id === 'undergrad-bus') {
        // Bus pass: $55.50 for unlimited bus + pay for MRT trips
        totalCost = pass.monthlyPrice + concessionFares.totalFareExcludingBus;
        savings = paygTotal - totalCost;
      } else {
        // Hybrid pass: $81 for unlimited everything
        totalCost = pass.monthlyPrice;
        savings = paygTotal - totalCost;
      }

      return {
        pass,
        cost: totalCost,
        savings: savings,
        isSavingMoney: savings > 0,
        paygTotal: paygTotal,
      };
    });
  }, [windowTrips, concessionFares]);

  const bestPass = useMemo(() => {
    return passComparison.reduce((best, current) =>
      current.savings > best.savings ? current : best
    );
  }, [passComparison]);

  const selectedPassComparison = passComparison.find(p => p.pass.id === selectedPassId)!;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh' }}>
        <SectionHeader title="Your Travel Summary" />

        {/* 30-Day Window Selector */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarMonthIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h3">Select 30-Day Window (Duration of Concession Pass)</Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: { xs: 'stretch', md: 'center' }
          }}>
            <DatePicker
              label="Start Date"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              format="DD MMM YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Select the first day of your 30-day period'
                }
              }}
            />

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: { xs: 'auto', md: '200px' }
            }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  textAlign: 'center'
                }}
              >
                →
              </Typography>
            </Box>

            <DatePicker
              label="End Date"
              value={selectedEndDate}
              disabled
              format="DD MMM YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Automatically set to 30 days from start'
                }
              }}
            />
          </Box>

          {/* Viewing Window and Calculate Button Row */}
          {selectedStartDate && selectedEndDate && (
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
                p: 2,
                backgroundColor: 'primary.light',
                borderRadius: 1,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.dark'
                  }}
                >
                  Dates Selected: {selectedStartDate.format('MMM D, YYYY')} - {selectedEndDate.format('MMM D, YYYY')}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={loadWindowTrips}
                disabled={loadingTrips}
                sx={{ minWidth: 200 }}
              >
                {loadingTrips ? 'Calculating...' : 'Calculate Pass Savings'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Warning when no trips found in selected window */}
        {hasCalculated && !loadingTrips && windowTrips.length === 0 && selectedStartDate !== null && selectedEndDate !== null && (
          <Alert
            severity="warning"
            icon={false}
            sx={{ mb: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WarningIcon sx={{ color: 'warning.main' }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                No trips found in selected period
              </Typography>
            </Box>
            <Typography variant="body2">
              There are no recorded trips between {selectedStartDate.format('MMM D, YYYY')} and {selectedEndDate.format('MMM D, YYYY')}.
              Try selecting a different 30-day window that includes your travel dates, or upload additional transaction statements.
            </Typography>
          </Alert>
        )}

        {/* Only show results when windowTrips has data */}
        {windowTrips.length > 0 && (
          <>
            <SummaryStatsSection
              totalFare={windowMetrics.paygTotal}
              numTrips={windowMetrics.tripCount}
              busDistance={windowMetrics.busDistance}
              mrtDistance={windowMetrics.mrtDistance}
            />

            {isMobile ?
              <>
                {/* Concession Pass Recommendation Panel */}
                <RecommendationSectionMobile totalFare={windowMetrics.paygTotal} bestPass={bestPass} passOptions={passComparison} />

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
                <RecommendationSection totalFare={windowMetrics.paygTotal} bestPass={bestPass} passOptions={passComparison} />
              </>
            }
          </>
        )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button onClick={() => window.history.back()} startIcon={<ArrowBackIosOutlinedIcon />}>
          Back
        </Button>
      </Box>
      </Box>
    </LocalizationProvider>
  );
}
