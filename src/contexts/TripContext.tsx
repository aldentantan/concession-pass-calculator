import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ConcessionFareResponse, DayGroup, Statement } from '../types';

interface TripContextType {
  dayGroups: DayGroup[];
  fares: ConcessionFareResponse;
  contextStatements: Statement[];
  currTripsLoaded: Boolean;
  lastFetchedKey: string | null;
  cachedConcessionFares: { totalFareExcludingBus: number; totalFareExcludingMrt: number } | null;
  setDayGroups: (dayGroups: DayGroup[]) => void;
  setFares: (fares: ConcessionFareResponse) => void;
  setContextStatements: (statements: Statement[]) => void;
  setCurrTripsLoaded: (loaded: Boolean) => void;
  setLastFetchedKey: (key: string | null) => void;
  setCachedConcessionFares: (fares: { totalFareExcludingBus: number; totalFareExcludingMrt: number } | null) => void;
  clearData: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const defaultFares: ConcessionFareResponse = {
  totalFareWithNewPrices: 0,
  totalFareExcludingBus: 0,
  totalFareExcludingMrt: 0,
};

export function TripProvider({ children }: { children: ReactNode }) {
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
  const [fares, setFares] = useState<ConcessionFareResponse>(defaultFares);
  const [contextStatements, setContextStatements] = useState<Statement[]>([]);
  const [currTripsLoaded, setCurrTripsLoaded] = useState<Boolean>(false);
  const [lastFetchedKey, setLastFetchedKey] = useState<string | null>(null);
  const [cachedConcessionFares, setCachedConcessionFares] = useState<{ totalFareExcludingBus: number; totalFareExcludingMrt: number } | null>(null);

  const clearData = () => {
    setDayGroups([]);
    setFares(defaultFares);
    setContextStatements([]);
  };

  return (
    <TripContext.Provider value={{
      dayGroups,
      fares,
      contextStatements,
      currTripsLoaded,
      lastFetchedKey,
      cachedConcessionFares,
      setDayGroups,
      setFares,
      setContextStatements,
      setCurrTripsLoaded,
      setLastFetchedKey,
      setCachedConcessionFares,
      clearData,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripProvider');
  }
  return context;
}