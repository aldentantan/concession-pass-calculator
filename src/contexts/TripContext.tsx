import { createContext, useContext, useState } from 'react';
import type { DayGroup, ConcessionFareResponse, Statement } from '../types';
import type { ReactNode } from 'react';

interface TripContextType {
  dayGroups: DayGroup[];
  fares: ConcessionFareResponse;
  contextStatements: Statement[];
  setDayGroups: (dayGroups: DayGroup[]) => void;
  setFares: (fares: ConcessionFareResponse) => void;
  setContextStatements: (statements: Statement[]) => void;
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
      setDayGroups,
      setFares,
      setContextStatements,
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