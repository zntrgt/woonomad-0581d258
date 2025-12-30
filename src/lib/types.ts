export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  region?: string;
  continent?: string;
}

export type TripDuration = '1-1' | '2-2' | '3-3';
export type CabinClass = 'Y' | 'C'; // Y = Economy, C = Business
export type VisaOption = 'all' | 'visa-free' | 'visa-required';

export interface PopularRoute {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  emoji: string;
}

export interface Flight {
  origin: string;
  destination: string;
  origin_airport: string;
  destination_airport: string;
  price: number;
  airline: string;
  flight_number: number;
  departure_at: string;
  return_at?: string;
  transfers: number;
  return_transfers?: number;
  duration: number;
  duration_to?: number;
  duration_back?: number;
  link: string;
  affiliateLink?: string | null;
  visaStatus?: 'visa-free' | 'visa-required' | 'unknown';
}

export interface WeekendDate {
  saturday: Date;
  sunday: Date;
  label: string;
  weekOffset: number;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  tripClass: CabinClass;
  visaFilter?: VisaOption;
}

// Special "Anywhere" destination
export const ANYWHERE_DESTINATION: Airport = {
  code: '',
  name: 'Her Yere',
  city: 'Her Yere',
  country: 'Dünya',
  continent: 'Her Yer'
};
