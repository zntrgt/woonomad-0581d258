/**
 * authors.ts — Author profiles for E-E-A-T trust signals
 * 
 * Google and AI search engines trust content from identifiable authors.
 * Every blog post and city guide should have an author attribution.
 * 
 * TODO: Add real photos to public/team/ directory
 * TODO: Add real social media links
 */

export interface Author {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  shortBio: string;
  image: string;
  countries: number;
  expertise: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export const authors: Author[] = [
  {
    id: 'ozan',
    name: 'Ozan Turgut',
    slug: 'ozan-turgut',
    role: 'Kurucu & Baş Editör',
    bio: 'Dijital göçebe olarak birçok ülkede yaşadı ve çalıştı. Yazılım geliştirici, seyahat tutkunu ve WooNomad\'ın kurucusu. Her destinasyonu bizzat deneyimleyerek, veri odaklı ve dürüst rehberler üretmeyi hedefliyor.',
    shortBio: 'WooNomad kurucusu, dijital göçebe',
    image: '/team/ozan.jpg', // TODO: gerçek fotoğraf ekle
    countries: 15,
    expertise: ['dijital-gocebe', 'seyahat-teknoloji', 'sehir-rehberleri'],
    social: {
      // TODO: gerçek linkleri ekle
      // twitter: 'https://twitter.com/woonomad',
      // linkedin: 'https://linkedin.com/in/ozanturgut',
    },
  },
  {
    id: 'woonomad-editor',
    name: 'WooNomad Editör',
    slug: 'woonomad-editor',
    role: 'Editör',
    bio: 'WooNomad editöryal ekibi. Tüm içerikler araştırılmış, doğrulanmış ve düzenli olarak güncellenmektedir.',
    shortBio: 'WooNomad editöryal ekibi',
    image: '/pwa-192x192.png',
    countries: 0,
    expertise: ['seyahat-rehberleri'],
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find(a => a.id === id);
}

export function getDefaultAuthor(): Author {
  return authors[0]; // Primary author
}
