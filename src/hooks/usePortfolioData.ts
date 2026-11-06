import { useState, useEffect, useCallback } from 'react';
import {
  fetchEvents,
  fetchGalleryImages,
  fetchGalleryVideos,
  fetchAchievements,
  fetchServices,
  fetchApprovedTestimonials,
  fetchPersonalInfo,
  fetchSiteSettings,
  DatabaseFeedback,
} from '../lib/firebase';
import {
  AdminEvent,
  AdminGalleryImage,
  AdminGalleryVideo,
  AdminAchievement,
  AdminService,
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

export const usePortfolioData = () => {
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
      sort_order: idx,
    }))
  );

  const [services, setServices] = useState<AdminService[]>(() =>
    SERVICES_LIST.map((s, idx) => ({
      ...s,
      is_featured: true,
      sort_order: idx,
    }))
  );

  const [personalInfo, setPersonalInfo] = useState<AdminPersonalInfo>(PERSONAL_INFO);

  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings>({
    googleFormBookingUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScjjI6JzyO-zroGxewDtgX9z_lIKdThIiYdl8HB8bF-qvuVlA/viewform?usp=dialog',
    whatsAppBookingNumber: '917391035544',
    announcementBanner: {
      enabled: false,
      text: 'Currently taking bookings for corporate galas and college festivals.',
      link: '',
    },
  });

  const [approvedFeedbacks, setApprovedFeedbacks] = useState<DatabaseFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const [
        liveEvents,
        livePhotos,
        liveVideos,
        liveAchievements,
        liveServices,
        liveFeedbacks,
        livePersonalInfo,
        liveSettings,
      ] = await Promise.all([
        fetchEvents(),
        fetchGalleryImages(),
        fetchGalleryVideos(),
        fetchAchievements(),
        fetchServices(),
        fetchApprovedTestimonials(),
        fetchPersonalInfo(),
        fetchSiteSettings(),
      ]);

      // If Firebase returned data (even empty array []), respect it as valid CMS state.
      // Only keep the fallback if live* is null (unconfigured or query error).
      if (liveEvents !== null && liveEvents.length > 0) {
        setEvents(liveEvents.filter((e) => e.is_published !== false));
      }
      if (livePhotos !== null && livePhotos.length > 0) {
        setPhotos(livePhotos.filter((p) => p.is_published !== false));
      }
      if (liveVideos !== null && liveVideos.length > 0) {
        setVideos(liveVideos.filter((v) => v.is_published !== false));
      }
      if (liveAchievements !== null && liveAchievements.length > 0) {
        setAchievements(liveAchievements.filter((a) => a.is_published !== false));
      }
      if (liveServices !== null && liveServices.length > 0) {
        setServices(liveServices.filter((s) => s.is_published !== false));
      }
      if (liveFeedbacks !== null) {
        setApprovedFeedbacks(liveFeedbacks);
      }
      if (livePersonalInfo !== null) {
        setPersonalInfo(livePersonalInfo);
      }
      if (liveSettings !== null) {
        setSiteSettings(liveSettings);
      }
    } catch (err) {
      console.warn('usePortfolioData fallback active:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    events,
    photos,
    videos,
    achievements,
    services,
    personalInfo,
    siteSettings,
    approvedFeedbacks,
    loading,
    refresh: loadData,
  };
};
