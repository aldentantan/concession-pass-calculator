export interface ParsedTrip {
  date: string;
  type: 'mrt' | 'bus';
  startLocation: string;
  endLocation: string;
  fare: number;
  busService?: string;
  journeyId?: string;
}

export interface Trip {
  time: string;
  type: 'mrt' | 'bus';
  busService?: string;
  startLocation: string;
  endLocation: string;
  fare: number;
  distance: number;
}

export interface Journey {
    date: string;
    day: string;
    startLocation: string;
    endLocation: string;
    trips: Trip[];
    mrtDistance: number;
    busDistance: number;
    totalDistance: number;
    totalFare: number;
}

export interface ConcessionPass {
  id: string;
  label: string;
  monthlyPrice: number;
  description: string;
};