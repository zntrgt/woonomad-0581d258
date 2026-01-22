import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Star, ExternalLink } from 'lucide-react';
import { Hotel } from '@/hooks/useHotelSearch';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom hotel marker icon
const createHotelIcon = (price: number, stars: number) => {
  const color = stars >= 5 ? '#f59e0b' : stars >= 4 ? '#10b981' : '#6366f1';
  return L.divIcon({
    className: 'custom-hotel-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        ₺${price >= 1000 ? Math.round(price/1000) + 'K' : price}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
  });
};

// Custom cluster icon
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const markers = cluster.getAllChildMarkers();
  
  // Calculate average price for cluster
  let totalPrice = 0;
  markers.forEach((marker: any) => {
    if (marker.options.price) {
      totalPrice += marker.options.price;
    }
  });
  const avgPrice = Math.round(totalPrice / count);
  
  // Size based on count
  let size = 'small';
  let dimension = 40;
  if (count > 10) {
    size = 'medium';
    dimension = 50;
  }
  if (count > 20) {
    size = 'large';
    dimension = 60;
  }
  
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(262, 83%, 45%) 100%);
        color: white;
        width: ${dimension}px;
        height: ${dimension}px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <span style="font-size: 14px; line-height: 1;">${count}</span>
        <span style="font-size: 9px; opacity: 0.9;">otel</span>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(dimension, dimension),
    iconAnchor: [dimension / 2, dimension / 2],
  });
};

// Component to fit bounds to hotels
function FitBounds({ hotels }: { hotels: Hotel[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (hotels.length > 0) {
      const validHotels = hotels.filter(h => h.location.lat !== 0 && h.location.lon !== 0);
      if (validHotels.length > 0) {
        const bounds = L.latLngBounds(
          validHotels.map(h => [h.location.lat, h.location.lon] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [hotels, map]);
  
  return null;
}

interface HotelMapClusteredProps {
  hotels: Hotel[];
  cityName: string;
  defaultCenter?: [number, number];
  onHotelSelect?: (hotel: Hotel) => void;
}

export function HotelMapClustered({ hotels, cityName, defaultCenter, onHotelSelect }: HotelMapClusteredProps) {
  // Filter hotels with valid coordinates
  const validHotels = hotels.filter(h => h.location.lat !== 0 && h.location.lon !== 0);
  
  // Default city centers
  const cityCoords: Record<string, [number, number]> = {
    'istanbul': [41.0082, 28.9784],
    'antalya': [36.8969, 30.7133],
    'izmir': [38.4192, 27.1287],
    'bodrum': [37.0343, 27.4305],
    'paris': [48.8566, 2.3522],
    'londra': [51.5074, -0.1278],
    'barcelona': [41.3851, 2.1734],
    'amsterdam': [52.3676, 4.9041],
    'roma': [41.9028, 12.4964],
    'berlin': [52.5200, 13.4050],
    'dubai': [25.2048, 55.2708],
    'tokyo': [35.6762, 139.6503],
    'bali': [-8.4095, 115.1889],
    'bangkok': [13.7563, 100.5018],
  };
  
  const normalizedCityName = cityName.toLowerCase().replace(/[ıİşŞğĞüÜöÖçÇ]/g, c => 
    ({ 'ı': 'i', 'İ': 'i', 'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c' }[c] || c)
  );
  
  const center = defaultCenter || 
    (validHotels.length > 0 
      ? [validHotels[0].location.lat, validHotels[0].location.lon] as [number, number]
      : cityCoords[normalizedCityName] || [41.0082, 28.9784]);
  
  if (validHotels.length === 0) {
    return (
      <div className="h-[400px] rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Harita için konum bilgisi bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border shadow-sm">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds hotels={validHotels} />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          animate={true}
        >
          {validHotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={[hotel.location.lat, hotel.location.lon]}
              icon={createHotelIcon(hotel.priceFrom, hotel.stars)}
              // @ts-ignore - custom property for cluster avg price
              price={hotel.priceFrom}
              eventHandlers={{
                click: () => onHotelSelect?.(hotel),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  {hotel.photo && (
                    <img 
                      src={hotel.photo} 
                      alt={hotel.name}
                      className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-2"
                      style={{ width: 'calc(100% + 24px)' }}
                    />
                  )}
                  <h3 className="font-semibold text-sm mb-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    {hotel.rating > 0 && (
                      <span className="text-xs text-gray-500 ml-1">
                        {hotel.rating.toFixed(1)} ({hotel.reviews})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-600">
                      ₺{hotel.priceFrom.toLocaleString('tr-TR')}/gece
                    </span>
                    {hotel.link && (
                      <a 
                        href={hotel.link}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                      >
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Gör
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
