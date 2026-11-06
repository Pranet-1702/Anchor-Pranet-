import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLayout } from './AdminLayout';
import {
  AdminNavTab,
  AdminEvent,
  AdminGalleryImage,
  AdminGalleryVideo,
  AdminAchievement,
  AdminService,
  AdminContactInquiry,
  AdminPersonalInfo,
  AdminSiteSettings,
} from '../../types/admin';
import {
  fetchEvents,
  fetchGalleryImages,
  fetchGalleryVideos,
  fetchAchievements,
  fetchServices,
  fetchAllFeedbacks,
  fetchInquiries,
  fetchPersonalInfo,
  fetchSiteSettings,
  DatabaseFeedback,
} from '../../lib/firebase';
import {
  VERIFIED_EVENTS,
  GALLERY_PHOTOS,
  ACHIEVEMENTS_LIST,
  SERVICES_LIST,
  PERSONAL_INFO,
} from '../../data/portfolioData';

// Code-splitting: Lazy-load individual heavy admin modules
const AdminLogin = lazy(() =>
  import('./AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const DashboardModule = lazy(() =>
  import('./modules/DashboardModule').then((m) => ({ default: m.DashboardModule }))
);
const EventsModule = lazy(() =>
  import('./modules/EventsModule').then((m) => ({ default: m.EventsModule }))
);
const PhotoGalleryModule = lazy(() =>
  import('./modules/PhotoGalleryModule').then((m) => ({ default: m.PhotoGalleryModule }))
);
const VideoGalleryModule = lazy(() =>
  import('./modules/VideoGalleryModule').then((m) => ({ default: m.VideoGalleryModule }))
);
const AchievementsModule = lazy(() =>
  import('./modules/AchievementsModule').then((m) => ({ default: m.AchievementsModule }))
);
const TestimonialsModule = lazy(() =>
  import('./modules/TestimonialsModule').then((m) => ({ default: m.TestimonialsModule }))
);
const AboutModule = lazy(() =>
  import('./modules/AboutModule').then((m) => ({ default: m.AboutModule }))
);
const ServicesModule = lazy(() =>
  import('./modules/ServicesModule').then((m) => ({ default: m.ServicesModule }))
);
const ContactModule = lazy(() =>
  import('./modules/ContactModule').then((m) => ({ default: m.ContactModule }))
);
const InquiriesModule = lazy(() =>
  import('./modules/InquiriesModule').then((m) => ({ default: m.InquiriesModule }))
);
const SettingsModule = lazy(() =>
  import('./modules/SettingsModule').then((m) => ({ default: m.SettingsModule }))
);

const ModuleLoadingFallback: React.FC = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="text-center space-y-3">
      <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
      <div className="text-xs tracking-wider uppercase text-[#d4af37]/80 font-medium">
        Loading module...
      </div>
    </div>
  </div>
);

interface AdminPanelProps {
  onNavigateToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToHome }) => {
  const { user, loading: authLoading, isAdmin, isFirebaseConnected } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminNavTab>('dashboard');

  // Pre-seed state with verified static portfolio data so admin never sees blank fields
  const [events, setEvents] = useState<AdminEvent[]>(() =>
    VERIFIED_EVENTS.map((e, idx) => ({
      ...e,
      image: e.image || '',
      is_published: true,
      is_featured: idx < 4,
      location: e.location || 'Pune, Maharashtra',
      sort_order: idx,
    }))
  );

  const [photos, setPhotos] = useState<AdminGalleryImage[]>(() =>
    GALLERY_PHOTOS.map((p, idx) => ({
      ...p,
      is_published: true,
      aspectRatio: p.aspectRatio || 'square',
      sort_order: idx,
    }))
  );

  const [videos, setVideos] = useState<AdminGalleryVideo[]>([]);
  const [achievements, setAchievements] = useState<AdminAchievement[]>(() =>
    ACHIEVEMENTS_LIST.map((a, idx) => ({
      ...a,
      is_published: true,
      sort_order: idx,
    }))
  );

  const [services, setServices] = useState<AdminService[]>(() =>
    SERVICES_LIST.map((s, idx) => ({
      ...s,
      is_featured: true,
      is_published: true,
      sort_order: idx,
    }))
  );

  const [feedbacks, setFeedbacks] = useState<DatabaseFeedback[]>([]);
  const [inquiries, setInquiries] = useState<AdminContactInquiry[]>([]);
  const [personalInfo, setPersonalInfo] = useState<AdminPersonalInfo>(PERSONAL_INFO);
  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings>({
    googleFormBookingUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScjjI6JzyO-zroGxewDtgX9z_lIKdThIiYdl8HB8bF-qvuVlA/viewform?usp=dialog',
    whatsAppBookingNumber: '917391035544',
    announcementBanner: {
      enabled: false,
      text: 'Currently taking bookings for college festivals and corporate summits.',
      link: '',
    },
  });

  const [dataLoading, setDataLoading] = useState(false);

  // Load live data from Firebase strictly for authorized Master Administrator
  const loadAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [
        liveEvents,
        livePhotos,
        liveVideos,
        liveAchievements,
        liveServices,
        liveFeedbacks,
        liveInquiries,
        livePersonalInfo,
        liveSettings,
      ] = await Promise.all([
        fetchEvents(true),
        fetchGalleryImages(true),
        fetchGalleryVideos(true),
        fetchAchievements(true),
        fetchServices(true),
        fetchAllFeedbacks(),
        fetchInquiries(),
        fetchPersonalInfo(),
        fetchSiteSettings(),
      ]);

      if (liveEvents && liveEvents.length > 0) setEvents(liveEvents);
      if (livePhotos && livePhotos.length > 0) setPhotos(livePhotos);
      if (liveVideos && liveVideos.length > 0) setVideos(liveVideos);
      if (liveAchievements && liveAchievements.length > 0) setAchievements(liveAchievements);
      if (liveServices && liveServices.length > 0) setServices(liveServices);
      if (liveFeedbacks) setFeedbacks(liveFeedbacks);
      if (liveInquiries) setInquiries(liveInquiries);
      if (livePersonalInfo) setPersonalInfo(livePersonalInfo);
      if (liveSettings) setSiteSettings(liveSettings);
    } catch (err) {
      console.warn('loadAllData notice:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only execute admin data loading after auth is fully verified and confirmed
    if (isAdmin && user && !authLoading) {
      loadAllData();
    }
  }, [isAdmin, user, authLoading, loadAllData]);

  // Loading spinner during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070709] text-[#fbf7ee] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Verifying Admin Credentials...
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated or not authorized -> Show Admin Login
  if (!isAdmin) {
    return (
      <Suspense fallback={<ModuleLoadingFallback />}>
        <AdminLogin onBackToHome={onNavigateToHome} />
      </Suspense>
    );
  }

  // Calculated stats for dashboard badges
  const pendingReviewsCount = feedbacks.filter((f) => f.status === 'pending').length;
  const approvedReviewsCount = feedbacks.filter((f) => f.status === 'approved').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      pendingReviewsCount={pendingReviewsCount}
      newInquiriesCount={newInquiriesCount}
      onNavigateToSite={onNavigateToHome}
    >
      <Suspense fallback={<ModuleLoadingFallback />}>
        {currentTab === 'dashboard' && (
          <DashboardModule
            onNavigateTab={setCurrentTab}
            stats={{
              eventsCount: events.length,
              photosCount: photos.length,
              videosCount: videos.length,
              achievementsCount: achievements.length,
              testimonialsPending: pendingReviewsCount,
              testimonialsApproved: approvedReviewsCount,
              inquiriesNew: newInquiriesCount,
            }}
            isFirebaseConnected={isFirebaseConnected}
            onRefreshData={loadAllData}
          />
        )}

        {currentTab === 'events' && <EventsModule events={events} onRefresh={loadAllData} />}

        {currentTab === 'gallery' && (
          <PhotoGalleryModule photos={photos} onRefresh={loadAllData} />
        )}

        {currentTab === 'videos' && (
          <VideoGalleryModule videos={videos} onRefresh={loadAllData} />
        )}

        {currentTab === 'achievements' && (
          <AchievementsModule achievements={achievements} onRefresh={loadAllData} />
        )}

        {currentTab === 'testimonials' && (
          <TestimonialsModule feedbacks={feedbacks} onRefresh={loadAllData} />
        )}

        {currentTab === 'about' && (
          <AboutModule personalInfo={personalInfo} onRefresh={loadAllData} />
        )}

        {currentTab === 'services' && (
          <ServicesModule services={services} onRefresh={loadAllData} />
        )}

        {currentTab === 'contact' && (
          <ContactModule personalInfo={personalInfo} onRefresh={loadAllData} />
        )}

        {currentTab === 'inquiries' && (
          <InquiriesModule inquiries={inquiries} onRefresh={loadAllData} />
        )}

        {currentTab === 'settings' && (
          <SettingsModule
            settings={siteSettings}
            isFirebaseConnected={isFirebaseConnected}
            onRefresh={loadAllData}
          />
        )}
      </Suspense>
    </AdminLayout>
  );
};
