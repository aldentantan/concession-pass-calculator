export interface ParsedTrip {
  date: string;
  type: 'mrt' | 'bus';
  startLocation: string;
  endLocation: string;
  fare: number;
  busService?: string;
  journeyId?: string;
}