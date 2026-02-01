// Shared Hotel type for hotel-related components
export interface Hotel {
  id: string;
  name: string;
  stars: number;
  priceFrom: number;
  priceAvg: number;
  rating: number;
  reviews: number;
  location: {
    lat: number;
    lon: number;
  };
  photo: string | null;
  link: string;
  amenities?: string[];
}

export interface HotelSearchResult {
  hotels: Hotel[];
  cityId?: string;
  iata?: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  affiliateLink?: string;
}
