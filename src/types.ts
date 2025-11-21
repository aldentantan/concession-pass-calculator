export interface ParsedTrip {
  date: string;
  type: 'mrt' | 'bus';
  startLocation: string;
  endLocation: string;
  fare: number;
  busService?: string;
  journeyId?: string;
}

// export interface Trip {
//   id: number;
//   type: 'mrt' | 'bus';
//   busService: string;
//   direction: string;
//   startStop: string;
//   endStop: string;
//   startStation: string;
//   endStation: string;
// }

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