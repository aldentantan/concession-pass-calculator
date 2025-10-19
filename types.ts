export interface Trip {
  id: number;
  type: 'mrt' | 'bus';
  busService: string;
  direction: string;
  startStop: string;
  endStop: string;
  startStation: string;
  endStation: string;
}