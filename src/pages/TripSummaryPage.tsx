import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AlertCircle, Bus, Calendar, ChevronDown, ChevronUp, Train } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useTripContext } from '../contexts/TripContext';
import { fetchTripsInDateRange } from '../services/statementsService';
import type { ConcessionPass } from '../types';

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
    monthlyPrice: 45.00,
    description: 'Unlimited bus travel',
  },
  {
    id: 'undergrad-mrt',
    label: 'Undergrad MRT Pass',
    monthlyPrice: 55.00,
    description: 'Unlimited MRT travel',
  },
  {
    id: 'undergrad-hybrid',
    label: 'Undergrad Hybrid Pass',
    monthlyPrice: 85.00,
    description: 'Unlimited bus & MRT',
  },
];

export default function TripSummaryPage() {
  const { dayGroups, setDayGroups } = useTripContext();
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [concessionFares, setConcessionFares] = useState<{
    totalFareExcludingBus: number;
    totalFareExcludingMrt: number;
  }>({ totalFareExcludingBus: 0, totalFareExcludingMrt: 0 });
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Calculate earliest trip date
  const earliestTripDate = useMemo(() => {
    if (dayGroups.length === 0) return null;
    const sortedDates = dayGroups
      .map(j => j.date)
      .sort((a, b) => a.localeCompare(b));
    return dayjs(sortedDates[0]);
  }, [dayGroups]);

  // Initialize default start date
  useEffect(() => {
    if (earliestTripDate && !selectedStartDate) {
      setSelectedStartDate(earliestTripDate);
      setSelectedEndDate(earliestTripDate.add(29, 'day'));
    }
  }, [earliestTripDate, selectedStartDate, selectedEndDate]);

  // Load window trips
  const loadWindowTrips = async () => {
    if (!selectedStartDate || !selectedEndDate) return;

    setLoadingTrips(true);
    try {
      const response = await fetchTripsInDateRange(
        selectedStartDate.format('YYYY-MM-DD'),
        selectedEndDate.format('YYYY-MM-DD')
      );
      // Backend now returns day groups directly
      setDayGroups(response.dayGroups || []);
      setConcessionFares(response.concessionFares || { totalFareExcludingBus: 0, totalFareExcludingMrt: 0 });
    } catch (error) {
      console.error('Error fetching window trips:', error);
      setDayGroups([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  // Handle start date change
  const handleStartDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedStartDate(newDate);
      setSelectedEndDate(newDate.add(29, 'day'));
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
        totalCost = paygTotal;
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
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 flex-shrink-0">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Analysis Controls</h3>
            <p className="text-sm text-slate-600">Configure your date range</p>
          </div>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">End Date (Auto)</label>
            <DatePicker
              value={selectedEndDate}
              disabled
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small'
                }
              }}
            />
          </div>

          <Button
            variant="default"
            size="md"
            onClick={loadWindowTrips}
            disabled={!selectedStartDate || !selectedEndDate || loadingTrips}
            className="w-full mb-4 "
          >
            {loadingTrips ? 'Loading Trips...' : 'Load Trips'}
          </Button>

          <Card className="flex justify-center p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="text-sm">
              <div className="font-semibold text-blue-900">30-day period</div>
              <div className="text-blue-700">{dayGroups.reduce((total, dg) => total + dg.journeys.reduce((jTotal, journey) => jTotal + journey.trips.length, 0), 0)} trips found</div>
            </div>
          </Card>

          {/* Quick Summary */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Quick 30-Day Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Amount Spent</span>
                <span className="font-semibold text-slate-900">${windowMetrics.paygTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Days Travelled</span>
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
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Recommendation Card */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-slate-50 border-slate-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white rounded-full">
                <AlertCircle className="w-6 h-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  Stick to {bestPass.pass.label}
                </h2>
                <p className="text-slate-700">
                  Based on your travel patterns, paying {' '}
                  <span className="font-semibold">${bestPass.cost.toFixed(2)}/month</span>{' '}
                  is your most economical option.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="text-sm text-slate-600 mb-1">Best Option</p>
                <p className="text-lg font-semibold text-slate-900">{bestPass.pass.label}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Monthly Cost</p>
                <p className="text-lg font-semibold text-slate-900">${bestPass.cost.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Pass Options Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Pass Options Breakdown (Based on your Travel History)</h3>
            <div className="grid grid-cols-4 gap-6">
              {passComparison.map((option) => {
                const isBest = option.pass.id === bestPass.pass.id;

                return (
                  <Card
                    key={option.pass.id}
                    className={`p-6 ${isBest ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-1">{option.pass.label}</h4>
                        <p className="text-sm text-slate-600">{option.pass.description}</p>
                      </div>
                      {isBest && (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Pass Price</span>
                        <span className="font-semibold text-slate-900">${option.pass.monthlyPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                        <span className="text-slate-600">Total Cost</span>
                        <span className="font-semibold text-slate-900">${option.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Trip Details */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Trip Details</h3>
            <p className="text-slate-600 mb-4">Click any day to view individual journeys</p>

            <div className="space-y-3">
              {dayGroups.map((dayGroup) => {
                const isExpanded = expandedDays.has(dayGroup.date);
                const trips = dayGroup.journeys.flatMap(journey => journey.trips);

                return (
                  <Card key={dayGroup.date} className="overflow-hidden border-slate-200">
                    {/* Day Header */}
                    <button
                      onClick={() => toggleDay(dayGroup.date)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{dayGroup.day}, {dayGroup.date}</div>
                          <div className="text-sm text-slate-600">{dayGroup.journeys.length} journey{dayGroup.journeys.length !== 1 ? 's' : ''} ◦ {trips.length} trip{trips.length !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="font-semibold text-slate-900">${dayGroup.totalFare.toFixed(2)}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Expanded Trip Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50">
                        {trips.map((trip, index) => (
                          <div
                            key={index}
                            className="p-4 border-b border-slate-200 last:border-b-0 flex items-center gap-4"
                          >
                            <div className="">
                              <div className="text-sm text-slate-600">{trip.time}</div>
                            </div>
                            <div className="flex items-center gap-2 w-26">
                              {trip.type === 'bus' ? (
                                <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 rounded text-sm">
                                  <Bus className="w-4 h-4 text-blue-600" />
                                  <span className="text-blue-900 font-medium">Bus {trip.busService}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-2 py-1 bg-green-100 rounded text-sm">
                                  <Train className="w-4 h-4 text-green-600" />
                                  <span className="text-green-900 font-medium">MRT</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-sm text-slate-700">
                              {trip.startLocation} → {trip.endLocation}
                            </div>
                            <div className="font-semibold text-slate-900">${trip.fare.toFixed(2)}</div>
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
