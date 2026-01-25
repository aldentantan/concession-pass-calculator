import type { TripWithMetadata } from '../types';

export interface WindowComparison {
  paygTotal: number;
  passCost: number;
  savings: number;
  worthIt: boolean;
  tripCount: number;
  busTrips: number;
  mrtTrips: number;
}

/**
 * Calculate 30-day window comparison between pay-as-you-go and concession pass
 * @param trips - Array of trips within the selected date range
 * @param passCost - The monthly cost of the concession pass
 * @returns Comparison metrics including savings and trip counts
 */
export function calculateWindowComparison(
  trips: TripWithMetadata[],
  passCost: number
): WindowComparison {
  // Calculate total PAYG fare
  const paygTotal = trips.reduce((sum, trip) => sum + trip.fare, 0);

  // Count trips by mode
  const busTrips = trips.filter(t => t.mode === 'bus').length;
  const mrtTrips = trips.filter(t => t.mode === 'mrt').length;

  // Calculate savings (positive = pass saves money, negative = PAYG is cheaper)
  const savings = paygTotal - passCost;

  // Determine if pass is worth it
  const worthIt = savings > 0;

  return {
    paygTotal: Math.round(paygTotal * 100) / 100, // Round to 2 decimal places
    passCost,
    savings: Math.round(savings * 100) / 100,
    worthIt,
    tripCount: trips.length,
    busTrips,
    mrtTrips,
  };
}
