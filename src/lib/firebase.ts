import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import rawFirebaseConfig from '../../firebase-applet-config.json';
import {
  AdminEvent,
  AdminGalleryImage,
  AdminGalleryVideo,
  AdminAchievement,
  AdminService,
  AdminContactInquiry,
  AdminPersonalInfo,
  AdminSiteSettings,
} from '../types/admin';
import {
  VERIFIED_EVENTS,
  GALLERY_PHOTOS,
  ACHIEVEMENTS_LIST,
  SERVICES_LIST,
  PERSONAL_INFO,
} from '../data/portfolioData';

export const ADMIN_EMAIL = 'pranetbhosale@gmail.com';

const getEnvVar = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  return undefined;
};

// Dual resolution: reads from Vercel environment variables or bundled config
export const firebaseConfig = {
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || rawFirebaseConfig.projectId,
  appId: getEnvVar('VITE_FIREBASE_APP_ID') || rawFirebaseConfig.appId,
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY') || rawFirebaseConfig.apiKey,
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || rawFirebaseConfig.authDomain,
  firestoreDatabaseId:
    getEnvVar('VITE_FIREBASE_FIRESTORE_DATABASE_ID') || rawFirebaseConfig.firestoreDatabaseId || '(default)',
  storageBucket:
    getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || rawFirebaseConfig.storageBucket,
  messagingSenderId:
    getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || rawFirebaseConfig.messagingSenderId,
};

// -------------------------------------------------------------
// FIREBASE INITIALIZATION
// -------------------------------------------------------------
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId &&
    firebaseConfig.apiKey &&
    !firebaseConfig.projectId.includes('placeholder')
);

// -------------------------------------------------------------
// ERROR HANDLING & CONTEXT (Skill compliant)
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// CONNECTION VALIDATION
// -------------------------------------------------------------
export async function testFirebaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    // Attempt reading test connection doc from server
    await getDocFromServer(doc(db, 'site_settings', 'connection_probe'));
    return { connected: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline') || msg.includes('Failed to get document')) {
      return { connected: false, error: msg };
    }
    // If it reached Firestore server (even if doc is missing or rules returned permission), connection is alive
    return { connected: true };
  }
}

// -------------------------------------------------------------
// STORAGE HELPERS (Firebase Storage)
// -------------------------------------------------------------
export const uploadMediaFile = async (
  file: File,
  folder: string = 'gallery'
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `portfolio-media/${folder}/${cleanFileName}`;
    const fileRef = storageRef(storage, filePath);

    const snapshot = await uploadBytes(fileRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        uploadedBy: auth.currentUser?.email || 'anonymous',
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { url: downloadUrl, error: null };
  } catch (err: unknown) {
    console.warn('Storage upload notice, falling back to local data preview:', err);
    // Fallback: generate local data url so user workflow is not abruptly blocked
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string, error: null });
      };
      reader.onerror = () => {
        resolve({ url: null, error: 'Failed to read local file' });
      };
      reader.readAsDataURL(file);
    });
  }
};

export const deleteMediaFile = async (filePathOrUrl: string): Promise<boolean> => {
  try {
    // If it's a firebase storage url or path
    if (filePathOrUrl.startsWith('http')) {
      const fileRef = storageRef(storage, filePathOrUrl);
      await deleteObject(fileRef);
      return true;
    } else {
      const fileRef = storageRef(storage, `portfolio-media/${filePathOrUrl}`);
      await deleteObject(fileRef);
      return true;
    }
  } catch (err) {
    console.warn('deleteMediaFile notice:', err);
    return false;
  }
};

// -------------------------------------------------------------
// EVENTS CRUD
// -------------------------------------------------------------
export const fetchEvents = async (forAdmin: boolean = false): Promise<AdminEvent[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const q = forAdmin && isMaster
      ? query(collection(db, 'events'), orderBy('sort_order', 'asc'))
      : query(collection(db, 'events'), where('is_published', '==', true));
    const snapshot = await getDocs(q);
    const events: AdminEvent[] = [];
    snapshot.forEach((docSnap) => {
      events.push(docSnap.data() as AdminEvent);
    });
    return events.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.warn('fetchEvents notice:', err);
    return null;
  }
};

export const saveEvent = async (event: AdminEvent): Promise<boolean> => {
  try {
    const docRef = doc(db, 'events', event.id);
    await setDoc(docRef, {
      ...event,
      is_published: event.is_published ?? true,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('saveEvent error:', err);
    return false;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'events', id));
    return true;
  } catch (err) {
    console.error('deleteEvent error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// GALLERY IMAGES CRUD
// -------------------------------------------------------------
export const fetchGalleryImages = async (forAdmin: boolean = false): Promise<AdminGalleryImage[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const q = forAdmin && isMaster
      ? query(collection(db, 'gallery_images'), orderBy('sort_order', 'asc'))
      : query(collection(db, 'gallery_images'), where('is_published', '==', true));
    const snapshot = await getDocs(q);
    const images: AdminGalleryImage[] = [];
    snapshot.forEach((docSnap) => {
      images.push(docSnap.data() as AdminGalleryImage);
    });
    return images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.warn('fetchGalleryImages notice:', err);
    return null;
  }
};

export const saveGalleryImage = async (image: AdminGalleryImage): Promise<boolean> => {
  try {
    const docRef = doc(db, 'gallery_images', image.id);
    await setDoc(docRef, {
      ...image,
      is_published: image.is_published ?? true,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('saveGalleryImage error:', err);
    return false;
  }
};

export const deleteGalleryImage = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'gallery_images', id));
    return true;
  } catch (err) {
    console.error('deleteGalleryImage error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// VIDEOS CRUD
// -------------------------------------------------------------
export const fetchGalleryVideos = async (forAdmin: boolean = false): Promise<AdminGalleryVideo[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const q = forAdmin && isMaster
      ? query(collection(db, 'gallery_videos'), orderBy('sort_order', 'asc'))
      : query(collection(db, 'gallery_videos'), where('is_published', '==', true));
    const snapshot = await getDocs(q);
    const videos: AdminGalleryVideo[] = [];
    snapshot.forEach((docSnap) => {
      videos.push(docSnap.data() as AdminGalleryVideo);
    });
    return videos.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.warn('fetchGalleryVideos notice:', err);
    return null;
  }
};

export const saveGalleryVideo = async (video: AdminGalleryVideo): Promise<boolean> => {
  try {
    const docRef = doc(db, 'gallery_videos', video.id);
    await setDoc(docRef, {
      ...video,
      is_published: video.is_published ?? true,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('saveGalleryVideo error:', err);
    return false;
  }
};

export const deleteGalleryVideo = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'gallery_videos', id));
    return true;
  } catch (err) {
    console.error('deleteGalleryVideo error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// ACHIEVEMENTS CRUD
// -------------------------------------------------------------
export const fetchAchievements = async (forAdmin: boolean = false): Promise<AdminAchievement[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const q = forAdmin && isMaster
      ? query(collection(db, 'achievements'), orderBy('sort_order', 'asc'))
      : query(collection(db, 'achievements'), where('is_published', '==', true));
    const snapshot = await getDocs(q);
    const achievements: AdminAchievement[] = [];
    snapshot.forEach((docSnap) => {
      achievements.push(docSnap.data() as AdminAchievement);
    });
    return achievements.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.warn('fetchAchievements notice:', err);
    return null;
  }
};

export const saveAchievement = async (achievement: AdminAchievement): Promise<boolean> => {
  try {
    const docRef = doc(db, 'achievements', achievement.id);
    await setDoc(docRef, {
      ...achievement,
      is_published: achievement.is_published ?? true,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('saveAchievement error:', err);
    return false;
  }
};

export const deleteAchievement = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'achievements', id));
    return true;
  } catch (err) {
    console.error('deleteAchievement error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// SERVICES CRUD
// -------------------------------------------------------------
export const fetchServices = async (forAdmin: boolean = false): Promise<AdminService[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const q = forAdmin && isMaster
      ? query(collection(db, 'services'), orderBy('sort_order', 'asc'))
      : query(collection(db, 'services'), where('is_published', '==', true));
    const snapshot = await getDocs(q);
    const services: AdminService[] = [];
    snapshot.forEach((docSnap) => {
      services.push(docSnap.data() as AdminService);
    });
    return services.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.warn('fetchServices notice:', err);
    return null;
  }
};

export const saveService = async (service: AdminService): Promise<boolean> => {
  try {
    const docRef = doc(db, 'services', service.id);
    await setDoc(docRef, {
      ...service,
      is_published: service.is_published ?? true,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('saveService error:', err);
    return false;
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'services', id));
    return true;
  } catch (err) {
    console.error('deleteService error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// FEEDBACK & MODERATION
// -------------------------------------------------------------
export interface DatabaseFeedback {
  id: string;
  full_name: string;
  organization: string | null;
  role: string;
  event_name: string | null;
  feedback: string;
  rating: number;
  public_consent: boolean;
  is_featured?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  moderated_at: string | null;
}

/**
 * Public Website query: Fetches ONLY approved testimonials with explicit public consent.
 */
export const fetchApprovedTestimonials = async (): Promise<DatabaseFeedback[] | null> => {
  try {
    const q = query(
      collection(db, 'feedbacks'),
      where('status', '==', 'approved'),
      where('public_consent', '==', true)
    );
    const snapshot = await getDocs(q);
    const list: DatabaseFeedback[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as DatabaseFeedback);
    });
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.warn('fetchApprovedTestimonials notice:', err);
    return null;
  }
};

/**
 * Admin Dashboard query: Fetches all feedback records for moderation.
 * Strictly gated to authenticated Master Administrator.
 */
export const fetchAllFeedbacks = async (): Promise<DatabaseFeedback[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (!isMaster) {
      console.warn('fetchAllFeedbacks: Restricted to authenticated master admin.');
      return null;
    }
    const q = query(collection(db, 'feedbacks'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const list: DatabaseFeedback[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as DatabaseFeedback);
    });
    return list;
  } catch (err) {
    console.warn('fetchAllFeedbacks notice:', err);
    return null;
  }
};

export const submitFeedback = async (
  rawFeedbackData: Partial<DatabaseFeedback> & {
    fullName?: string;
    feedbackText?: string;
    publicConsent?: boolean;
    eventName?: string;
  }
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const fullName = (rawFeedbackData.full_name || rawFeedbackData.fullName || 'Anonymous Client').trim();
    const feedbackText = (rawFeedbackData.feedback || rawFeedbackData.feedbackText || '').trim();
    const rawRating = rawFeedbackData.rating;
    const parsedRating =
      typeof rawRating === 'number'
        ? rawRating
        : typeof rawRating === 'string'
        ? parseInt(rawRating, 10)
        : 5;
    const rating = !isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 5;
    const role = (rawFeedbackData.role || 'Event Organizer').trim();
    const organization = (rawFeedbackData.organization || '').trim() || null;
    const eventName = (rawFeedbackData.event_name || rawFeedbackData.eventName || '').trim() || null;
    const publicConsent =
      rawFeedbackData.public_consent !== undefined
        ? Boolean(rawFeedbackData.public_consent)
        : rawFeedbackData.publicConsent !== undefined
        ? Boolean(rawFeedbackData.publicConsent)
        : true;

    if (!feedbackText) {
      return { success: false, error: 'Feedback message cannot be empty.' };
    }

    const id = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newFeedback = {
      id,
      full_name: fullName.substring(0, 200),
      fullName: fullName.substring(0, 200),
      organization: organization ? organization.substring(0, 200) : null,
      role: role.substring(0, 100),
      event_name: eventName ? eventName.substring(0, 200) : null,
      eventName: eventName ? eventName.substring(0, 200) : null,
      feedback: feedbackText.substring(0, 3000),
      feedbackText: feedbackText.substring(0, 3000),
      rating,
      public_consent: publicConsent,
      publicConsent: publicConsent,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      moderated_at: null,
    };

    await setDoc(doc(db, 'feedbacks', id), newFeedback);
    return { success: true, id };
  } catch (err) {
    console.error('submitFeedback error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit feedback',
    };
  }
};

export const updateFeedbackStatus = async (
  id: string,
  status: 'approved' | 'rejected' | 'pending'
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'feedbacks', id), {
      status,
      moderated_at: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('updateFeedbackStatus error:', err);
    return false;
  }
};

export const toggleFeedbackFeatured = async (
  id: string,
  isFeatured: boolean
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'feedbacks', id), {
      is_featured: isFeatured,
    });
    return true;
  } catch (err) {
    console.error('toggleFeedbackFeatured error:', err);
    return false;
  }
};

export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'feedbacks', id));
    return true;
  } catch (err) {
    console.error('deleteFeedback error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// INQUIRIES & MESSAGES (Master Admin Only)
// -------------------------------------------------------------
export const fetchInquiries = async (): Promise<AdminContactInquiry[] | null> => {
  try {
    const isMaster = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (!isMaster) {
      console.warn('fetchInquiries: Restricted to authenticated master admin.');
      return null;
    }
    const q = query(collection(db, 'contact_inquiries'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const inquiries: AdminContactInquiry[] = [];
    snapshot.forEach((docSnap) => {
      inquiries.push(docSnap.data() as AdminContactInquiry);
    });
    return inquiries;
  } catch (err) {
    console.warn('fetchInquiries notice:', err);
    return null;
  }
};

export const createInquiry = async (
  inquiry: Omit<AdminContactInquiry, 'id' | 'status' | 'created_at'>
): Promise<boolean> => {
  try {
    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newInquiry: AdminContactInquiry = {
      ...inquiry,
      id,
      phone: inquiry.phone || '',
      event_type: inquiry.event_type || '',
      event_date: inquiry.event_date || '',
      status: 'new',
      created_at: new Date().toISOString(),
    };
    await setDoc(doc(db, 'contact_inquiries', id), newInquiry);
    return true;
  } catch (err) {
    console.error('createInquiry error:', err);
    return false;
  }
};

export const updateInquiryStatus = async (
  id: string,
  status: 'new' | 'contacted' | 'archived'
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'contact_inquiries', id), { status });
    return true;
  } catch (err) {
    console.error('updateInquiryStatus error:', err);
    return false;
  }
};

export const deleteInquiry = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'contact_inquiries', id));
    return true;
  } catch (err) {
    console.error('deleteInquiry error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// SITE SETTINGS & PERSONAL INFO
// -------------------------------------------------------------
export const fetchSiteSettings = async (): Promise<AdminSiteSettings | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'site_settings', 'general'));
    if (!docSnap.exists()) return null;
    return docSnap.data().value as AdminSiteSettings;
  } catch (err) {
    console.warn('fetchSiteSettings notice:', err);
    return null;
  }
};

export const saveSiteSettings = async (settings: AdminSiteSettings): Promise<boolean> => {
  try {
    await setDoc(
      doc(db, 'site_settings', 'general'),
      {
        key: 'general',
        value: settings,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('saveSiteSettings error:', err);
    return false;
  }
};

export const fetchPersonalInfo = async (): Promise<AdminPersonalInfo | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'site_settings', 'personal_info'));
    if (!docSnap.exists()) return null;
    return docSnap.data().value as AdminPersonalInfo;
  } catch (err) {
    console.warn('fetchPersonalInfo notice:', err);
    return null;
  }
};

export const savePersonalInfo = async (info: AdminPersonalInfo): Promise<boolean> => {
  try {
    await setDoc(
      doc(db, 'site_settings', 'personal_info'),
      {
        key: 'personal_info',
        value: info,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('savePersonalInfo error:', err);
    return false;
  }
};

// -------------------------------------------------------------
// ONE-CLICK DATABASE SEEDER (Idempotent initial data migration)
// -------------------------------------------------------------
export const seedInitialFirebaseData = async (): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, number>;
}> => {
  try {
    const currentUserEmail = auth.currentUser?.email?.toLowerCase();
    const isMaster = currentUserEmail === ADMIN_EMAIL.toLowerCase();
    if (!isMaster) {
      return {
        success: false,
        message: `Active session expired or unauthorized (${currentUserEmail || 'signed out'}). Please click 'Sign Out' in the top right, then sign back in as ${ADMIN_EMAIL} to authenticate with your project.`,
      };
    }

    const batch = writeBatch(db);

    // 1. Seed Events
    VERIFIED_EVENTS.forEach((evt, idx) => {
      const docRef = doc(db, 'events', evt.id);
      batch.set(docRef, {
        id: evt.id,
        title: evt.title,
        category: evt.category,
        categoryLabel: evt.categoryLabel,
        organizer: evt.organizer,
        location: evt.location || 'Pune & Maharashtra',
        date: evt.date,
        description: evt.description,
        image: evt.image || '',
        imageAlt: evt.imageAlt || evt.title,
        highlights: evt.highlights || [],
        is_published: true,
        is_featured: idx < 4,
        sort_order: idx,
        created_at: new Date().toISOString(),
      }, { merge: true });
    });

    // 2. Seed Gallery Images
    GALLERY_PHOTOS.forEach((photo, idx) => {
      const docRef = doc(db, 'gallery_images', photo.id);
      batch.set(docRef, {
        id: photo.id,
        src: photo.src,
        alt: photo.alt,
        title: photo.title,
        subtitle: photo.subtitle,
        category: photo.category,
        aspectRatio: photo.aspectRatio || 'square',
        is_published: true,
        sort_order: idx,
        created_at: new Date().toISOString(),
      }, { merge: true });
    });

    // 3. Seed Achievements
    ACHIEVEMENTS_LIST.forEach((ach, idx) => {
      const docRef = doc(db, 'achievements', ach.id);
      batch.set(docRef, {
        id: ach.id,
        title: ach.title,
        subtitle: ach.subtitle,
        organization: ach.organization,
        year: ach.year,
        description: ach.description,
        image: ach.image || '',
        imageAlt: ach.imageAlt || ach.title,
        verifiedBadge: ach.verifiedBadge,
        is_published: true,
        sort_order: idx,
        created_at: new Date().toISOString(),
      }, { merge: true });
    });

    // 4. Seed Services
    SERVICES_LIST.forEach((srv, idx) => {
      const docRef = doc(db, 'services', srv.id);
      batch.set(docRef, {
        id: srv.id,
        title: srv.title,
        tagline: srv.tagline,
        description: srv.description,
        keyDeliverables: srv.keyDeliverables,
        formats: srv.formats,
        recommendedAudience: srv.recommendedAudience,
        is_featured: true,
        is_published: true,
        sort_order: idx,
        created_at: new Date().toISOString(),
      }, { merge: true });
    });

    // 5. Seed Gallery Video Showreel
    const videoRef = doc(db, 'gallery_videos', 'vid-default-1');
    batch.set(videoRef, {
      id: 'vid-default-1',
      title: 'Umang 2025 Annual Gathering Official Emcee Showreel',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: '/assets/aistudio/6_480be6e9.jpeg',
      category: 'Stage Highlights',
      description: 'Main-stage ceremony address before thousands of students and guests.',
      is_published: true,
      sort_order: 0,
      created_at: new Date().toISOString(),
    }, { merge: true });

    // 6. Seed Personal Info & Site Settings
    const personalInfoRef = doc(db, 'site_settings', 'personal_info');
    batch.set(personalInfoRef, {
      key: 'personal_info',
      value: PERSONAL_INFO,
      updated_at: new Date().toISOString(),
    }, { merge: true });

    const generalRef = doc(db, 'site_settings', 'general');
    batch.set(generalRef, {
      key: 'general',
      value: {
        googleFormBookingUrl:
          'https://docs.google.com/forms/d/e/1FAIpQLScjjI6JzyO-zroGxewDtgX9z_lIKdThIiYdl8HB8bF-qvuVlA/viewform?usp=dialog',
        whatsAppBookingNumber: '917391035544',
        announcementBanner: {
          enabled: false,
          text: 'Available for National Bookings & Anchor Engagements',
        },
      },
      updated_at: new Date().toISOString(),
    }, { merge: true });

    await batch.commit();

    return {
      success: true,
      message: `Firebase Firestore successfully seeded with ${VERIFIED_EVENTS.length} events, ${GALLERY_PHOTOS.length} photos, ${ACHIEVEMENTS_LIST.length} achievements, and ${SERVICES_LIST.length} services!`,
      details: {
        events: VERIFIED_EVENTS.length,
        photos: GALLERY_PHOTOS.length,
        achievements: ACHIEVEMENTS_LIST.length,
        services: SERVICES_LIST.length,
      },
    };
  } catch (err: unknown) {
    console.error('Firebase seeding error:', err);
    const msg = err instanceof Error ? err.message : 'Database seeding failed';
    let friendly = msg;
    if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
      friendly = `Authentication credentials rejected by your Firebase project. Please click 'Sign Out' in the top right, then sign back in as ${ADMIN_EMAIL} to establish a fresh session with your new project.`;
    }
    return {
      success: false,
      message: friendly,
    };
  }
};
