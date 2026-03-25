import type { ConcessionFareResponse, DayGroup } from '../types';

const GUEST_TRIP_SUMMARY_KEY = 'guest_trip_summary';
const LEGACY_DAY_GROUPS_KEY = 'day_groups';

const defaultFares: ConcessionFareResponse = {
  totalFareWithNewPrices: 0,
  totalFareExcludingBus: 0,
  totalFareExcludingMrt: 0,
};

export interface GuestTripSummary {
  dayGroups: DayGroup[];
  fares: ConcessionFareResponse;
  concessionFaresByDate: Record<string, ConcessionFareResponse>;
}

function clearLegacyGuestKeys(): void {
  sessionStorage.removeItem(LEGACY_DAY_GROUPS_KEY);
}

export function clearLegacyGuestSessionStorage(): void {
  clearLegacyGuestKeys();
}

export function clearGuestSession(): void {
  localStorage.removeItem('guest_upload_used');
  clearLegacyGuestKeys();
  sessionStorage.removeItem(GUEST_TRIP_SUMMARY_KEY);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildConcessionFaresByDate(dayGroups: DayGroup[]): Record<string, ConcessionFareResponse> {
  return dayGroups.reduce<Record<string, ConcessionFareResponse>>((accumulator, dayGroup) => {
    const totals = dayGroup.journeys.reduce((journeyAccumulator, journey) => {
      journeyAccumulator.totalFareWithNewPrices += journey.totalFare;
      journeyAccumulator.totalFareExcludingBus += journey.fareExcludingBus;
      journeyAccumulator.totalFareExcludingMrt += journey.fareExcludingMrt;
      return journeyAccumulator;
    }, {
      totalFareWithNewPrices: 0,
      totalFareExcludingBus: 0,
      totalFareExcludingMrt: 0,
    });

    accumulator[dayGroup.date] = {
      totalFareWithNewPrices: roundCurrency(totals.totalFareWithNewPrices),
      totalFareExcludingBus: roundCurrency(totals.totalFareExcludingBus),
      totalFareExcludingMrt: roundCurrency(totals.totalFareExcludingMrt),
    };
    return accumulator;
  }, {});
}

export function storeGuestTripSummary(input: {
  dayGroups: DayGroup[];
  fares: ConcessionFareResponse;
}): void {
  clearLegacyGuestKeys();
  const summary: GuestTripSummary = {
    dayGroups: input.dayGroups,
    fares: input.fares,
    concessionFaresByDate: buildConcessionFaresByDate(input.dayGroups),
  };
  sessionStorage.setItem(GUEST_TRIP_SUMMARY_KEY, JSON.stringify(summary));
}

export function getGuestTripSummary(): GuestTripSummary {
  clearLegacyGuestKeys();
  const raw = sessionStorage.getItem(GUEST_TRIP_SUMMARY_KEY);
  if (!raw) {
    return {
      dayGroups: [],
      fares: defaultFares,
      concessionFaresByDate: {},
    };
  }

  try {
    const parsed = JSON.parse(raw) as GuestTripSummary;
    return {
      dayGroups: Array.isArray(parsed.dayGroups) ? parsed.dayGroups : [],
      fares: parsed.fares ?? defaultFares,
      concessionFaresByDate: parsed.concessionFaresByDate ?? {},
    };
  } catch {
    return {
      dayGroups: [],
      fares: defaultFares,
      concessionFaresByDate: {},
    };
  }
}
