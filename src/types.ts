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
    tripIssues: TripIssue[];
    mrtDistance: number;
    busDistance: number;
    totalDistance: number;
    totalFare: number;
}

export interface ConcessionFareResponse { // The JSON object returned from backend after calculating fare prices with the different concession passes
  totalFareWithNewPrices: number;
  totalFareExcludingBus: number;
  totalFareExcludingMrt: number;
}

export interface ConcessionPass {
  id: string;
  label: string;
  monthlyPrice: number;
  description: string;
};

export interface Statement {
  id: number;
  file_name: string;
  file_path: string;
  file_hash: string;
  total_fare: number;
  journey_count: number;
  statement_month: string;
  statement_year: number;
  created_at: string;
}

export interface TripIssue {
  code: 'BUS_STOP_NOT_FOUND' | 'MRT_STATION_NOT_FOUND';
  message: string;
  tripIndex: number;
  busService?: string;
  unknownStopName: string;
}

export interface TripWithMetadata {
  date: string;
  time: string;
  mode: 'mrt' | 'bus';
  busService?: string;
  startLocation: string;
  endLocation: string;
  fare: number;
  distance: number;
  statement_id: string;
  statement_month: string;
}

export interface DayGroupedTrips {
  date: string;
  dayOfWeek: string;
  trips: TripWithMetadata[];
  totalFare: number;
}