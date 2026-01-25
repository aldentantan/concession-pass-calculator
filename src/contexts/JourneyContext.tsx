import { createContext, useContext, useState } from 'react';
import type { Journey, ConcessionFareResponse, Statement } from '../types';
import type { ReactNode } from 'react';

interface JourneyContextType {
  journeys: Journey[];
  fares: ConcessionFareResponse;
  statements: Statement[];
  setJourneys: (journeys: Journey[]) => void;
  setFares: (fares: ConcessionFareResponse) => void;
  setStatements: (statements: Statement[]) => void;
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
  const [statements, setStatements] = useState<Statement[]>([]);

  const clearData = () => {
    setJourneys([]);
    setFares(defaultFares);
    setStatements([]);
  };

  return (
    <JourneyContext.Provider value={{ journeys, fares, statements, setJourneys, setFares, setStatements, clearData }}>
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