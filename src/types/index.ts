export type EventCategory = 
  | 'all'
  | 'cultural'
  | 'hackathons'
  | 'technical'
  | 'alumni'
  | 'seminars';

export interface EventItem {
  id: string;
  title: string;
  category: 'cultural' | 'hackathons' | 'technical' | 'alumni' | 'seminars';
  categoryLabel: string;
  organizer: string;
  location?: string;
  date: string;
  description: string;
  image?: string;
  imageAlt?: string;
  highlights: string[];
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  category: 'stage' | 'felicitation' | 'hackathon' | 'formal';
  aspectRatio?: 'tall' | 'wide' | 'square';
}

export interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
  imageAlt?: string;
  verifiedBadge?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyDeliverables: string[];
  formats: string[];
  recommendedAudience: string;
}

export const EVENT_TYPES = [
  'Cultural & College Festivals',
  'Technical Festivals & Hackathons',
  'Award Ceremonies & Prize Distributions',
  'Corporate & Institutional Events',
  'Alumni Meets & Reunions',
  'Seminars & Formal Programs',
  'Special Ceremonial / Other Event',
] as const;

export type EventType = typeof EVENT_TYPES[number];

export const EVENT_DURATIONS = [
  'Short Ceremony (1–2 Hours)',
  'Half Day (3–5 Hours)',
  'Full Day (6–8 Hours)',
  'Multi-Day / Hackathon (24–48 Hours)',
] as const;

export type EventDuration = typeof EVENT_DURATIONS[number];

export interface BookingEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  eventType: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM or AM/PM
  eventDateTime?: string; // Legacy formatted string
  eventLocation: string;
  eventDuration: string;
  budget?: string;
  additionalRequirements?: string;
  status?: string;
  createdAt: string;
}

export type FeedbackRole =
  | 'event_organizer'
  | 'client'
  | 'faculty_coordinator'
  | 'co_host'
  | 'attendee'
  | 'other';

export interface FeedbackSubmission {
  id: string;
  fullName: string;
  organization?: string;
  role: FeedbackRole;
  roleLabel: string;
  eventName?: string;
  feedback: string;
  rating: number; // 1 to 5
  publicConsent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  moderatedAt?: string;
}

export interface PublicFeedbackItem {
  id: string;
  fullName: string;
  organization?: string;
  role: string;
  eventName?: string;
  feedback: string;
  rating: number;
  publicConsent: boolean;
  isFeatured?: boolean;
  submittedAt: string;
}
