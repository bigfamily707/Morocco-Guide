
export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface TrekkingRoute {
  name: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  duration: string;
  elevation: string;
  desc: string;
}

export interface TrekkingInfo {
  routes: TrekkingRoute[];
  tips: string[];
  gear: string[];
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  bestTime: string;
  type: 'city' | 'nature' | 'coastal';
  coordinates: {
    lat: number;
    lng: number;
  };
  gallery?: string[];
  reviews?: Review[];
  trekking?: TrekkingInfo;
}

export interface LocalHost {
  id: string;
  name: string;
  image: string;
  location: string;
  address?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  experienceType: 'food' | 'trekking' | 'history' | 'shopping' | 'artisan';
  languages: string[];
  price: string;
  bio: string;
}

export interface Phrase {
  id: string;
  english: string;
  darija: string;
  pronunciation: string;
  category: 'greetings' | 'shopping' | 'dining' | 'emergency';
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface CulturalNorm {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface Trivia {
  id: string;
  q: string;
  a: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export enum UserPersona {
  FAMILY = 'Family',
  SOLO = 'Solo',
  ADVENTURE = 'Adventure',
  LUXURY = 'Luxury',
  CULTURAL = 'Cultural'
}

export interface OfflineRegion {
  id: string;
  name: string;
  description: string;
  sizeMB: number;
  status: 'idle' | 'downloading' | 'downloaded';
  progress: number;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  duration: number;
  destinations: string[]; // IDs of selected destinations
  itinerary: Record<number, string>; // Day number -> Main Activity/Location description
  createdAt: string;
}
