import { Tooltip } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AlertTriangle, Bus, Calendar, ChevronDown, ChevronUp, Info, Train } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import NoTripsModal from '../components/NoTripsModal';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useTripContext } from '../contexts/TripContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { fetchTripsInDateRange } from '../services/statementsService';
import type { ConcessionFareResponse, ConcessionPass, DayGroup } from '../types';
import { getGuestTripSummary } from '../utils/guestSession';

const PASS_OPTIONS: ConcessionPass[] = [
  {
    id: 'no-pass',
    label: 'No Pass',
    monthlyPrice: 0,
    description: 'Pay per trip',
  },
  {
    id: 'undergrad-bus',
    label: 'Undergrad Bus Pass',
    monthlyPrice: 55.50,
    description: 'Unlimited bus travel',
  },
  {
    id: 'undergrad-mrt',
    label: 'Undergrad MRT Pass',
    monthlyPrice: 48.00,
    description: 'Unlimited MRT travel',
  },
  {
    id: 'undergrad-hybrid',
    label: 'Undergrad Hybrid Pass',
    monthlyPrice: 81.00,
    description: 'Unlimited bus & MRT',
  },
];

const BUS_STOP_ISSUE_TOOLTIP = 'Some bus trips were not accounted for because bus stop names could not be matched.';
export default function TripSummaryPage() {
  const { dayGroups, setDayGroups, currTripsLoaded, setCurrTripsLoaded, lastFetchedKey, setLastFetchedKey, cachedConcessionFares, setCachedConcessionFares } = useTripContext();
  const { user } = useAuth();
  const guestTripSummary = user ? null : getGuestTripSummary();
  const isMobile = useIsMobile();
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [concessionFares, setConcessionFares] = useState<ConcessionFareResponse>({
    totalFareWithNewPrices: 0,
    totalFareExcludingBus: 0,
    totalFareExcludingMrt: 0,
  });
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Calculate earliest trip date.
  // Guests read from sessionStorage (full upload) so the default window stays
  // correct even after loadWindowTrips narrows dayGroups to a filtered subset.
  const earliestTripDate = useMemo(() => {
    const source: DayGroup[] = user ? dayGroups : (guestTripSummary?.dayGroups ?? []);
    if (source.length === 0) return null;
    const sortedDates = source
      .map(j => j.date)
      .sort((a, b) => a.localeCompare(b));
    return dayjs(sortedDates[0], 'DD MMM YYYY');
  }, [dayGroups, guestTripSummary?.dayGroups, user]);

  // Initialize default start date
  useEffect(() => {
    if (earliestTripDate && !selectedStartDate) {
      setSelectedStartDate(earliestTripDate);
      setSelectedEndDate(earliestTripDate.add(1, 'month').subtract(1, 'day'));
    }
  }, [earliestTripDate, selectedStartDate, selectedEndDate]);

  // Load window trips
  const loadWindowTrips = async () => {
    // if (currTripsLoaded) return;
    if (!selectedStartDate || !selectedEndDate) return;

    setLoadingTrips(true);
    try {
      if (user) {
        // Authenticated: fetch from backend (DB-persisted data)
        const response = await fetchTripsInDateRange(
          selectedStartDate.format('YYYY-MM-DD'),
          selectedEndDate.format('YYYY-MM-DD')
        );
        const dayGroupsResult = response.dayGroups || [];
        const concessionFaresResult = response.concessionFares || {
          totalFareWithNewPrices: 0,
          totalFareExcludingBus: 0,
          totalFareExcludingMrt: 0,
        };
        const fetchKey = `${selectedStartDate.format('YYYY-MM-DD')}_${selectedEndDate.format('YYYY-MM-DD')}`;
        setDayGroups(dayGroupsResult);
        setConcessionFares(concessionFaresResult);
        setLastFetchedKey(fetchKey);
        setCachedConcessionFares(concessionFaresResult);
        setCurrTripsLoaded(true);
      } else {
        // Guest: filter sessionStorage day groups client-side
        const start = selectedStartDate.format('YYYY-MM-DD');
        const end = selectedEndDate.format('YYYY-MM-DD');
        const allDayGroups = guestTripSummary?.dayGroups ?? [];
        const filtered = allDayGroups.filter((dg) => {
          const date = dayjs(dg.date, 'DD MMM YYYY').format('YYYY-MM-DD');
          return date >= start && date <= end;
        });

        const selectedDates = new Set(filtered.map((dayGroup) => dayGroup.date));
        const concessionFaresByDate = guestTripSummary?.concessionFaresByDate ?? {};
        const filteredFares = Object.entries(concessionFaresByDate).reduce((accumulator, [date, fares]) => {
          if (!selectedDates.has(date)) {
            return accumulator;
          }

          accumulator.totalFareWithNewPrices += fares.totalFareWithNewPrices;
          accumulator.totalFareExcludingBus += fares.totalFareExcludingBus;
          accumulator.totalFareExcludingMrt += fares.totalFareExcludingMrt;
          return accumulator;
        }, {
          totalFareWithNewPrices: 0,
          totalFareExcludingBus: 0,
          totalFareExcludingMrt: 0,
        });

        setDayGroups(filtered);
        setConcessionFares({
          totalFareWithNewPrices: Math.round(filteredFares.totalFareWithNewPrices * 100) / 100,
          totalFareExcludingBus: Math.round(filteredFares.totalFareExcludingBus * 100) / 100,
          totalFareExcludingMrt: Math.round(filteredFares.totalFareExcludingMrt * 100) / 100,
        });
      }
    } catch (error) {
      console.error('Error fetching window trips:', error);
      setDayGroups([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  // Auto-load trips when dates are initialized (only once per mount).
  // For auth users returning from another route, restore from sessionStorage
  // cache to avoid a redundant DB call.
  useEffect(() => {
    if (!selectedStartDate || !selectedEndDate || loadingTrips || hasInitiallyLoaded) return;

    if (user && currTripsLoaded) {
      const fetchKey = `${selectedStartDate.format('YYYY-MM-DD')}_${selectedEndDate.format('YYYY-MM-DD')}`;
      if (lastFetchedKey === fetchKey && dayGroups.length > 0 && cachedConcessionFares) {
        setConcessionFares(cachedConcessionFares);
        setHasInitiallyLoaded(true);
        return;
      }
    }

    loadWindowTrips();
    setHasInitiallyLoaded(true);
  }, [selectedStartDate, selectedEndDate]);

  // Handle start date change
  const handleStartDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedStartDate(newDate);
      setSelectedEndDate(newDate.add(1, 'month').subtract(1, 'day'));
    }
  };

  // Calculate window metrics from day groups
  const windowMetrics = useMemo(() => {
    const paygTotal = dayGroups.reduce((sum, dayGroup) => sum + dayGroup.totalFare, 0);
    const busDistance = dayGroups.reduce((sum, dayGroup) => sum + dayGroup.busDistance, 0);
    const mrtDistance = dayGroups.reduce((sum, dayGroup) => sum + dayGroup.mrtDistance, 0);

    return {
      paygTotal: Math.round(paygTotal * 100) / 100,
      tripCount: dayGroups.length,
      busDistance: Math.round(busDistance * 100) / 100,
      mrtDistance: Math.round(mrtDistance * 100) / 100,
    };
  }, [dayGroups]);
  // Calculate pass comparison
  const passComparison = useMemo(() => {
    return PASS_OPTIONS.map(pass => {
      let totalCost: number;
      const paygTotal = windowMetrics.paygTotal;

      if (pass.id === 'no-pass') {
        totalCost = concessionFares.totalFareWithNewPrices;
      } else if (pass.id === 'undergrad-mrt') {
        totalCost = pass.monthlyPrice + concessionFares.totalFareExcludingMrt;
      } else if (pass.id === 'undergrad-bus') {
        totalCost = pass.monthlyPrice + concessionFares.totalFareExcludingBus;
      } else {
        totalCost = pass.monthlyPrice;
      }

      const savings = paygTotal - totalCost;

      return {
        pass,
        cost: totalCost,
        savings: savings,
        isSavingMoney: savings > 0,
      };
    });
  }, [windowMetrics, concessionFares]);

  const bestPass = useMemo(() => {
    return passComparison.reduce((best, current) =>
      current.savings > best.savings ? current : best
    );
  }, [passComparison]);
  const optimalPassDifference = windowMetrics.paygTotal - bestPass.cost;

  const toggleDay = (date: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`min-h-screen bg-gray-50 ${isMobile ? '' : 'flex'}`}>
        <NoTripsModal isOpen={!loadingTrips && dayGroups.length === 0} />
        {/* Left Sidebar / Top Controls on Mobile */}
        <div className={`bg-white border-slate-200 ${isMobile ? 'border-b p-4' : 'w-80 border-r p-6 flex-shrink-0'}`}>
          <div className={isMobile ? 'mb-4' : 'mb-8'}>
            <h3 className={`font-semibold text-slate-900 ${isMobile ? 'text-base mb-0.5' : 'text-lg mb-1'}`}>
              Analysis Controls
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">Configure your date range</p>
          </div>

          {/* Date Picker */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'gap-6'}`}>
            <div className={isMobile ? '' : 'mb-6'}>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <DatePicker
                value={selectedStartDate}
                onChange={handleStartDateChange}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </div>

            <div className={isMobile ? '' : 'mb-6'}>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">End Date (Auto)</label>
              <DatePicker
                value={selectedEndDate}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </div>
          </div>

          <Button
            variant="default"
            size="md"
            onClick={loadWindowTrips}
            disabled={!selectedStartDate || !selectedEndDate || loadingTrips}
            className={`w-full ${isMobile ? 'mt-3 mb-3' : 'mt-6 mb-4'}`}
          >
            {loadingTrips ? 'Loading Trips...' : 'Load Trips'}
          </Button>

          <Card className={`flex justify-center p-3 sm:p-4 ${isMobile ? 'mb-0' : 'mb-6'} bg-blue-50 border-blue-200`}>
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-blue-900">30-day period</div>
              <div className="text-blue-700">{dayGroups.reduce((total, dg) => total + dg.journeys.reduce((jTotal, journey) => jTotal + journey.trips.length, 0), 0)} trips found</div>
            </div>
          </Card>

          {/* Quick Summary - Hidden on mobile in sidebar, shown in main content */}
          {!isMobile && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Quick 30-Day Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Your Actual Spendings This Month </span>
                  <span className="font-semibold text-slate-900">${windowMetrics.paygTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">No. of Days Travelled</span>
                  <span className="font-semibold text-slate-900">{dayGroups.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bus Distance Travelled</span>
                  <span className="font-semibold text-slate-900">{windowMetrics.busDistance.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">MRT Distance Travelled</span>
                  <span className="font-semibold text-slate-900">{windowMetrics.mrtDistance.toFixed(1)} km</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={`flex-1 overflow-auto ${isMobile ? 'p-4' : 'p-8'}`}>
          {/* Quick Summary on Mobile - Shown here instead of sidebar */}
          {isMobile && (
            <Card className="p-4 mb-4 bg-white border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Quick 30-Day Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-600 block mb-0.5">Total Spent</span>
                  <span className="font-semibold text-slate-900">${windowMetrics.paygTotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-600 block mb-0.5">Days Travelled</span>
                  <span className="font-semibold text-slate-900">{dayGroups.length}</span>
                </div>
                <div>
                  <span className="text-slate-600 block mb-0.5">Bus Distance</span>
                  <span className="font-semibold text-slate-900">{windowMetrics.busDistance.toFixed(1)} km</span>
                </div>
                <div>
                  <span className="text-slate-600 block mb-0.5">MRT Distance</span>
                  <span className="font-semibold text-slate-900">{windowMetrics.mrtDistance.toFixed(1)} km</span>
                </div>
              </div>
            </Card>
          )}

          {/* Pass Options Breakdown */}
          <div className={isMobile ? 'mb-4' : 'mb-8'}>
            <h3 className={`font-semibold text-slate-900 ${isMobile ? 'text-base mb-3' : 'text-xl mb-4'}`}>
              Pass Options Breakdown {!isMobile && '(Based on your Travel History)'}
            </h3>
            <h2 className="mb-4">This is how much you would have spent in total if you were to purchase each pass with your current travel patterns:</h2>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
              {passComparison.map((option) => {
                const isBest = option.pass.id === bestPass.pass.id;
                // const savings = windowMetrics.paygTotal - option.cost;
                const savings = concessionFares.totalFareWithNewPrices - option.cost;
                const savingsBaselineTooltip = `You would ${savings < 0 ? 'lose' : 'save'} $${Math.abs(savings).toFixed(2)} if you bought the ${option.pass.label} as compared to not buying a pass.`;

                return (
                  <Card
                    key={option.pass.id}
                    className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col h-full ${isBest ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div>
                        <h4 className={`font-semibold text-slate-900 ${isMobile ? 'text-base mb-0.5' : 'text-lg mb-1'}`}>
                          {option.pass.label}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600">{option.pass.description}</p>
                      </div>
                      {isBest && (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-slate-600">Pass Price</span>
                        <span className="font-semibold text-slate-900">${option.pass.monthlyPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm pt-2 border-t border-slate-200">
                        <span className="text-slate-600">Total Cost</span>
                        <span className="font-semibold text-slate-900">${option.cost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="min-w-0 text-slate-600 inline-flex items-center gap-2">
                          <span className="truncate">You save</span>
                          <Tooltip
                            title={savingsBaselineTooltip}
                            placement="top"
                            slotProps={{ tooltip: { sx: { textAlign: 'center', maxWidth: 300 } } }}
                          >
                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </Tooltip>
                        </span>
                        <span
                          className={`font-semibold ${
                            savings > 0 ? 'text-green-600' : savings < 0 ? 'text-red-600' : 'text-slate-900'
                          } shrink-0`}
                        >
                          ${savings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-4 md:p-6 mb-4 md:mb-8 w-full md:w-[40%] mx-auto bg-white border-slate-200">
            <h3 className={`font-semibold text-slate-900 ${isMobile ? 'text-base mb-3' : 'text-lg mb-4'}`}>
              Optimal Pass Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-600">Your actual amount paid</span>
                <span className="font-semibold text-slate-900">${windowMetrics.paygTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-600">Optimal pass to buy</span>
                <span className="font-semibold text-slate-900 text-right">{bestPass.pass.label}</span>
              </div>
              <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-200">
                <span className="text-slate-600 inline-flex items-end gap-2">
                  Your Spendings vs Optimal Pass
                  <Tooltip
                            title='Might be inaccurate if you bought a concession pass already'
                            placement="top"
                            slotProps={{ tooltip: { sx: { textAlign: 'center', maxWidth: 300 } } }}
                          >
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                          </Tooltip>
                </span>
                <span
                  className={`font-semibold ${
                    optimalPassDifference > 0
                      ? 'text-green-600'
                      : optimalPassDifference < 0
                        ? 'text-red-600'
                        : 'text-slate-900'
                  }`}
                >
                  ${optimalPassDifference.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Trip Details */}
          <div>
            <h3 className={`font-semibold text-slate-900 ${isMobile ? 'text-base mb-1' : 'text-xl mb-2'}`}>
              Trip Details
            </h3>
            <p className={`text-slate-600 ${isMobile ? 'text-xs mb-3' : 'mb-4'}`}>
              Click any day to view individual journeys
            </p>

            <div className="space-y-3">
              {dayGroups.map((dayGroup) => {
                const isExpanded = expandedDays.has(dayGroup.date);
                const tripsWithIssueState = dayGroup.journeys.flatMap((journey) =>
                  journey.trips.map((trip, tripIndex) => ({
                    trip,
                    hasBusStopIssue: journey.tripIssues.some(
                      (issue) => issue.code === 'BUS_STOP_NOT_FOUND' && issue.tripIndex === tripIndex
                    ),
                  }))
                );
                const hasDayBusStopIssue = dayGroup.tripIssues.some((issue) => issue.code === 'BUS_STOP_NOT_FOUND');

                return (
                  <Card key={dayGroup.date} className="overflow-hidden border-slate-200">
                    {/* Day Header */}
                    <button
                      onClick={() => toggleDay(dayGroup.date)}
                      className={`w-full ${isMobile ? 'p-3' : 'p-4'} flex items-center justify-between hover:bg-slate-50 transition-colors text-left`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-slate-900 ${isMobile ? 'text-sm' : ''} truncate`}>
                            {dayGroup.day}, {dayGroup.date}
                          </div>
                          <div className={`text-slate-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {dayGroup.journeys.length} journey{dayGroup.journeys.length !== 1 ? 's' : ''} ◦{' '}
                            {tripsWithIssueState.length} trip{tripsWithIssueState.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        {hasDayBusStopIssue && (
                          <Tooltip title={BUS_STOP_ISSUE_TOOLTIP} placement="top" slotProps={{ tooltip: { sx: { textAlign: 'center', maxWidth: 270 }}}}>
                            <div className="text-amber-600">
                              <AlertTriangle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                            </div>
                          </Tooltip>
                        )}
                        <div className={`font-semibold text-slate-900 ${isMobile ? 'text-sm' : ''} flex-shrink-0`}>
                          ${dayGroup.totalFare.toFixed(2)}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400 ml-2 flex-shrink-0`} />
                      ) : (
                        <ChevronDown className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400 ml-2 flex-shrink-0`} />
                      )}
                    </button>

                    {/* Expanded Trip Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50">
                        {tripsWithIssueState.map(({ trip, hasBusStopIssue }, index) => (
                          <div
                            key={index}
                            className={`${isMobile ? 'p-3' : 'p-4'} border-b border-slate-200 last:border-b-0 ${isMobile ? 'space-y-2' : 'flex items-center gap-4'}`}
                          >
                            <div className={isMobile ? 'flex items-center justify-between' : ''}>
                              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-600`}>
                                {trip.time}
                              </div>
                              {isMobile && (
                                <div className="font-semibold text-slate-900 text-sm">
                                  ${trip.fare.toFixed(2)}
                                </div>
                              )}
                            </div>
                            <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-2 w-28'}`}>
                              {trip.type === 'bus' ? (
                                <div className={`flex items-center gap-1.5 px-2 py-1 bg-blue-100 rounded ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                  <Bus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                  <span className="text-blue-900 font-medium">Bus {trip.busService}</span>
                                </div>
                              ) : (
                                <div className={`flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                  <Train className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                  <span className="text-green-900 font-medium">MRT</span>
                                </div>
                              )}
                              {hasBusStopIssue && (
                                <Tooltip title={BUS_STOP_ISSUE_TOOLTIP} placement="top" slotProps={{ tooltip: { sx: { textAlign: 'center', maxWidth: 270 }}}}>
                                  <div className="text-amber-600">
                                    <AlertTriangle className="w-4 h-4" />
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                            <div className={`flex-1 ${isMobile ? 'text-xs' : 'text-sm'} text-slate-700`}>
                              {trip.startLocation} → {trip.endLocation}
                            </div>
                            {!isMobile && (
                              <div className="font-semibold text-slate-900">${trip.fare.toFixed(2)}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
