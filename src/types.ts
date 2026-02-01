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

export interface TripIssue {
  code: 'BUS_STOP_NOT_FOUND' | 'MRT_STATION_NOT_FOUND';
  message: string;
  tripIndex: number;
  busService?: string;
  unknownStopName: string;
}

// Trips grouped by their date
export interface DayGroup {
  date: string; // "DD MMM YYYY" format e.g. "01 Oct 2025"
  day: string;
  tripIssues: TripIssue[];
  journeys: Journey[];
  mrtDistance: number;
  busDistance: number;
  totalDistance: number;
  totalFare: number;
}

export interface Journey {
    startLocation: string;
    endLocation: string;
    trips: Trip[];
    tripIssues: TripIssue[];
    mrtDistance: number;
    busDistance: number;
    fareExcludingBus: number;
    fareExcludingMrt: number;
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