import { Helmet } from "react-helmet-async";

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export function OrganizationSchema({
  name = "WooNomad",
  url = "https://woonomad.co",
  logo = "https://woonomad.co/pwa-512x512.png",
  description = "En ucuz uçak bileti fiyatlarını karşılaştırın. Dijital göçebe rotaları keşfedin.",
  sameAs = [
    "https://twitter.com/woonomad",
    "https://www.instagram.com/woonomad",
    "https://www.facebook.com/woonomad"
  ]
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    "sameAs": sameAs,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Turkish", "English", "German", "French", "Spanish", "Arabic"]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  searchUrl?: string;
}

export function WebSiteSchema({
  name = "WooNomad",
  url = "https://woonomad.co",
  searchUrl = "https://woonomad.co/ucuslar?q={search_term_string}"
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": searchUrl
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface TripSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  priceCurrency?: string;
  rating?: number;
  reviewCount?: number;
  provider?: string;
}

export function TripSchema({
  name,
  description,
  url,
  image,
  destination,
  startDate,
  endDate,
  price,
  priceCurrency = "TRY",
  rating,
  reviewCount,
  provider = "WooNomad"
}: TripSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Trip",
    "name": name,
    "description": description,
    "url": url,
    "itinerary": {
      "@type": "Place",
      "name": destination
    },
    "provider": {
      "@type": "Organization",
      "name": provider
    }
  };

  if (image) {
    schema.image = image;
  }

  if (startDate) {
    schema.startDate = startDate;
  }

  if (endDate) {
    schema.endDate = endDate;
  }

  if (price !== undefined) {
    schema.offers = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0]
    };
  }

  if (rating !== undefined && reviewCount !== undefined) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
  sku?: string;
  price: number;
  priceCurrency?: string;
  rating?: number;
  reviewCount?: number;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}

export function ProductSchema({
  name,
  description,
  url,
  image,
  brand = "WooNomad",
  sku,
  price,
  priceCurrency = "TRY",
  rating,
  reviewCount,
  availability = "InStock"
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "url": url,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": `https://schema.org/${availability}`,
      "url": url
    }
  };

  if (image) {
    schema.image = image;
  }

  if (sku) {
    schema.sku = sku;
  }

  if (rating !== undefined && reviewCount !== undefined) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface HotelSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressCountry: string;
  };
  starRating?: number;
  priceRange?: string;
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
}

export function HotelSchema({
  name,
  description,
  url,
  image,
  address,
  starRating,
  priceRange,
  amenities,
  rating,
  reviewCount
}: HotelSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "description": description,
    "url": url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": address.addressLocality,
      "addressCountry": address.addressCountry,
      ...(address.streetAddress && { streetAddress: address.streetAddress })
    }
  };

  if (image) {
    schema.image = image;
  }

  if (starRating) {
    schema.starRating = {
      "@type": "Rating",
      "ratingValue": starRating
    };
  }

  if (priceRange) {
    schema.priceRange = priceRange;
  }

  if (amenities && amenities.length > 0) {
    schema.amenityFeature = amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }));
  }

  if (rating !== undefined && reviewCount !== undefined) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface FlightRouteSchemaProps {
  origin: {
    name: string;
    iataCode: string;
  };
  destination: {
    name: string;
    iataCode: string;
  };
  departureDate?: string;
  returnDate?: string;
  price?: number;
  priceCurrency?: string;
  airline?: string;
}

export function FlightRouteSchema({
  origin,
  destination,
  departureDate,
  returnDate,
  price,
  priceCurrency = "TRY",
  airline
}: FlightRouteSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FlightReservation",
    "reservationFor": {
      "@type": "Flight",
      "departureAirport": {
        "@type": "Airport",
        "name": origin.name,
        "iataCode": origin.iataCode
      },
      "arrivalAirport": {
        "@type": "Airport",
        "name": destination.name,
        "iataCode": destination.iataCode
      }
    }
  };

  if (departureDate) {
    (schema.reservationFor as Record<string, unknown>).departureTime = departureDate;
  }

  if (returnDate) {
    schema.returnFlight = {
      "@type": "Flight",
      "departureTime": returnDate
    };
  }

  if (airline) {
    (schema.reservationFor as Record<string, unknown>).airline = {
      "@type": "Airline",
      "name": airline
    };
  }

  if (price !== undefined) {
    schema.totalPrice = price;
    schema.priceCurrency = priceCurrency;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface CityGuideSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  country: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export function CityGuideSchema({
  name,
  description,
  url,
  image,
  country,
  datePublished,
  dateModified,
  author = "WooNomad"
}: CityGuideSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": name,
    "description": description,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "WooNomad",
      "logo": {
        "@type": "ImageObject",
        "url": "https://woonomad.co/pwa-512x512.png"
      }
    },
    "about": {
      "@type": "City",
      "name": name.replace(" Rehberi", "").replace(" Guide", ""),
      "containedInPlace": {
        "@type": "Country",
        "name": country
      }
    }
  };

  if (image) {
    schema.image = image;
  }

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
