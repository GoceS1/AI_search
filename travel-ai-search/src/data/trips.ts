export interface Trip {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration: number;
  image: string;
  type: 'adventure' | 'luxury' | 'cultural' | 'wildlife' | 'beach' | 'mountain' | 'wellness';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
  activities: string[];
  description: string;
}

export const trips: Trip[] = [
  {
    id: "1",
    name: "Safari in Kenya",
    destination: "Kenya",
    price: 2300,
    duration: 12,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&h=300&fit=crop",
    type: "wildlife",
    season: "year-round",
    activities: ["game drives", "wildlife viewing", "photography"],
    description: "Experience the Great Migration and witness the Big Five in Kenya's premier national parks."
  },
  {
    id: "2",
    name: "Luxury Maldives Escape",
    destination: "Maldives",
    price: 4500,
    duration: 7,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop",
    type: "luxury",
    season: "year-round",
    activities: ["snorkeling", "spa treatments", "fine dining"],
    description: "Indulge in overwater villa luxury with pristine beaches and crystal-clear waters."
  },
  {
    id: "3",
    name: "Cultural Japan Journey",
    destination: "Japan",
    price: 3200,
    duration: 14,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop",
    type: "cultural",
    season: "spring",
    activities: ["temple visits", "traditional ceremonies", "cherry blossom viewing"],
    description: "Immerse yourself in Japanese culture, from ancient temples to modern Tokyo."
  },
  {
    id: "4",
    name: "Patagonia Trekking",
    destination: "Argentina",
    price: 1800,
    duration: 10,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
    type: "adventure",
    season: "summer",
    activities: ["hiking", "mountaineering", "wildlife spotting"],
    description: "Challenge yourself with epic treks through stunning Patagonian landscapes."
  },
  {
    id: "5",
    name: "Bali Wellness Retreat",
    destination: "Indonesia",
    price: 1200,
    duration: 8,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop",
    type: "wellness",
    season: "year-round",
    activities: ["yoga", "meditation", "spa treatments"],
    description: "Rejuvenate your mind and body in Bali's serene temples and rice terraces."
  },
  {
    id: "6",
    name: "Swiss Alps Adventure",
    destination: "Switzerland",
    price: 2800,
    duration: 9,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&h=300&fit=crop",
    type: "mountain",
    season: "summer",
    activities: ["hiking", "skiing", "mountain railways"],
    description: "Experience breathtaking alpine scenery and charming mountain villages."
  },
  {
    id: "7",
    name: "Morocco Imperial Cities",
    destination: "Morocco",
    price: 1500,
    duration: 11,
    image: "https://images.unsplash.com/photo-1671181087708-be3050f1974e?q=80&w=500&h=300&fit=crop",
    type: "cultural",
    season: "fall",
    activities: ["medina tours", "desert camping", "traditional crafts"],
    description: "Explore the vibrant souks and historic architecture of Morocco's imperial cities."
  },
  {
    id: "8",
    name: "Greek Island Hopping",
    destination: "Greece",
    price: 2100,
    duration: 12,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&h=300&fit=crop",
    type: "beach",
    season: "summer",
    activities: ["sailing", "swimming", "historical tours"],
    description: "Discover the beauty of the Greek islands with their white-washed villages and azure waters."
  },
  {
    id: "9",
    name: "Iceland Northern Lights",
    destination: "Iceland",
    price: 2600,
    duration: 6,
    image: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?q=80&w=500&h=300&fit=crop",
    type: "adventure",
    season: "winter",
    activities: ["aurora viewing", "ice caves", "hot springs"],
    description: "Witness the magical northern lights and explore Iceland's dramatic winter landscapes."
  }
];
