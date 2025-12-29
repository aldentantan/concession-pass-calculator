import { createContext, useContext, useState } from 'react';
import type { Journey, ConcessionFareResponse } from '../types';
import type { ReactNode } from 'react';

interface JourneyContextType {
  journeys: Journey[];
  fares: ConcessionFareResponse;
  setJourneys: (journeys: Journey[]) => void;
  setFares: (fares: ConcessionFareResponse) => void;
  clearData: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

const defaultFares: ConcessionFareResponse = {
  totalFareWithNewPrices: 0,
  totalFareExcludingBus: 0,
  totalFareExcludingMrt: 0,
};

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [fares, setFares] = useState<ConcessionFareResponse>(defaultFares);

  const clearData = () => {
    setJourneys([]);
    setFares(defaultFares);
  };

  return (
    <JourneyContext.Provider value={{ journeys, fares, setJourneys, setFares, clearData }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourneyContext() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider');
  }
  return context;
}