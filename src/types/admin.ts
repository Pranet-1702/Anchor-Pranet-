export type AdminNavTab =
  | 'dashboard'
  | 'events'
  | 'gallery'
  | 'videos'
  | 'achievements'
  | 'testimonials'
  | 'about'
  | 'services'
  | 'contact'
  | 'inquiries'
  | 'settings';

export interface AdminEvent {
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
  is_published?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface AdminGalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  category: 'stage' | 'felicitation' | 'hackathon' | 'formal';
  aspectRatio: 'tall' | 'wide' | 'square';
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface AdminGalleryVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  category: string;
  description?: string;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface AdminAchievement {
  id: string;
  title: string;
  subtitle: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
  imageAlt?: string;
  verifiedBadge?: string;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface AdminService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyDeliverables: string[];
  formats: string[];
  recommendedAudience: string;
  is_featured?: boolean;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface AdminContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_type?: string;
  event_date?: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  created_at: string;
}

export interface AdminPersonalInfo {
  name: string;
  title: string;
  tagline: string;
  leadBio: string;
  yearsExperience: string;
  eventsHosted: string;
  languages: string[];
  contact: {
    phone: string;
    rawPhone: string;
    email: string;
    instagram: string;
    instagramUrl: string;
    linkedin: string;
    linkedinUrl: string;
    whatsappUrl: string;
    location: string;
  };
  roles: Array<{
    role: string;
    institution: string;
    focus: string;
  }>;
}

export interface AdminSiteSettings {
  googleFormBookingUrl?: string;
  whatsAppBookingNumber?: string;
  announcementBanner?: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}
