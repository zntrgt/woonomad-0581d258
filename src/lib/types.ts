export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
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
  tripClass: string;
}
