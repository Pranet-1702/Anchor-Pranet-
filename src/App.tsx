/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { EventsExperience } from './components/EventsExperience';
import { PhotoGallery } from './components/PhotoGallery';
import { Achievements } from './components/Achievements';
import { Services } from './components/Services';
import { ClientFeedbackSection } from './components/ClientFeedbackSection';
import { DownloadPortfolio } from './components/DownloadPortfolio';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { ParticleCanvas } from './components/ParticleCanvas';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Phone, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from './data/portfolioData';
import { GOOGLE_FORM_BOOKING_URL, WHATSAPP_BOOKING_URL } from './config/googleBookingConfig';

// Route-level code-splitting: Lazy-load admin & secondary routes so homepage remains ultra-lightweight
const AdminPanel = React.lazy(() =>
  import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);
const FeedbackPage = React.lazy(() =>
  import('./components/FeedbackPage').then((m) => ({ default: m.FeedbackPage }))
);
const AdminAuthProvider = React.lazy(() =>
  import('./context/AdminAuthContext').then((m) => ({ default: m.AdminAuthProvider }))
);

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#070709] text-[#fbf7ee] flex items-center justify-center p-4">
    <div className="text-center space-y-3">
      <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
      <div className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
        Loading...
      </div>
    </div>
  </div>
);

export default function App() {
  // Direct Routing: Check if URL path is /admin or /feedback
  const [currentRoute, setCurrentRoute] = useState<'home' | 'feedback' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin')) return 'admin';
      if (window.location.pathname.startsWith('/feedback')) return 'feedback';
      return 'home';
    }
    return 'home';
  });

  // Dynamic portfolio data with resilient fallback to portfolioData.ts
  const portfolioData = usePortfolioData();

  // Listen to browser back/forward history navigation and link clicks
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentRoute('admin');
      } else if (path.startsWith('/feedback')) {
        setCurrentRoute('feedback');
      } else {
        setCurrentRoute('home');
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href === '/admin') {
        e.preventDefault();
        window.history.pushState(null, '', '/admin');
        setCurrentRoute('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '/feedback') {
        e.preventDefault();
        window.history.pushState(null, '', '/feedback');
        setCurrentRoute('feedback');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '/') {
        e.preventDefault();
        window.history.pushState(null, '', '/');
        setCurrentRoute('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleDocumentClick);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const navigateToHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lightbox Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const handleSelectPhoto = (src: string, title: string, subtitle: string) => {
    setSelectedPhoto({ src, title, subtitle });
  };

  const handleExploreWork = () => {
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dedicated /admin private CMS route view
  if (currentRoute === 'admin') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <AdminAuthProvider>
          <AdminPanel onNavigateToHome={navigateToHome} />
        </AdminAuthProvider>
      </React.Suspense>
    );
  }

  // Dedicated /feedback route view
  if (currentRoute === 'feedback') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <div className="min-h-screen bg-[#070709] text-[#fbf7ee] font-sans selection:bg-[#d4af37] selection:text-[#0a0a0c] relative">
          <ParticleCanvas />
          <FeedbackPage onNavigateHome={navigateToHome} />
        </div>
      </React.Suspense>
    );
  }

  const effectiveGoogleBookingUrl =
    portfolioData.siteSettings.googleFormBookingUrl || GOOGLE_FORM_BOOKING_URL;
  const effectiveWhatsAppBookingUrl = portfolioData.siteSettings.whatsAppBookingNumber
    ? `https://wa.me/${portfolioData.siteSettings.whatsAppBookingNumber.replace(/[^0-9]/g, '')}`
    : WHATSAPP_BOOKING_URL;

  // Main Portfolio View
  return (
    <div className="min-h-screen bg-[#070709] text-[#fbf7ee] font-sans selection:bg-[#d4af37] selection:text-[#0a0a0c] relative">
      {/* Background Interactive Gold Particle Dust */}
      <ParticleCanvas />

      {/* Optional Top Announcement Banner configured from Admin CMS */}
      {portfolioData.siteSettings.announcementBanner?.enabled && (
        <div className="relative z-50 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] text-[#0a0a0c] py-2 px-4 text-center text-xs font-bold uppercase tracking-wider shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{portfolioData.siteSettings.announcementBanner.text}</span>
            {portfolioData.siteSettings.announcementBanner.link && (
              <a
                href={portfolioData.siteSettings.announcementBanner.link}
                className="underline hover:opacity-80 ml-1"
              >
                Learn More &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10">
        {/* Section 1: Cinematic Hero with Animated Counters, Moving Light Trails & Depth */}
        <Hero onOpenBooking={() => {}} onExploreWork={handleExploreWork} />

        {/* Section 2: About Me & Stage Persona */}
        <About personalInfo={portfolioData.personalInfo} />

        {/* Section 3: Events & Experience (Dynamic from CMS with static fallback) */}
        <EventsExperience
          events={portfolioData.events}
          onSelectPhoto={handleSelectPhoto}
        />

        {/* Section 4: Photo Gallery (Dynamic from CMS with static fallback) */}
        <PhotoGallery
          photos={portfolioData.photos}
          onSelectPhoto={handleSelectPhoto}
        />

        {/* Section 5: Achievements & Honors */}
        <Achievements
          achievements={portfolioData.achievements}
          onSelectPhoto={handleSelectPhoto}
        />

        {/* Section 6: Anchoring & Emcee Services */}
        <Services
          services={portfolioData.services}
          onSelectServiceForBooking={() => {}}
        />

        {/* Section 7: Client Experiences & Feedback */}
        <ClientFeedbackSection />

        {/* Section 8: Download Anchoring Portfolio */}
        <DownloadPortfolio />

        {/* Section 9: Contact & Booking Enquiries */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full-Screen Stage Photo Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={handleSelectPhoto}
      />

      {/* Discreet Mobile Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0a10]/95 backdrop-blur-lg border-t border-[#d4af37]/30 px-3 py-2.5 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Quick Call */}
          <a
            href={`tel:${PERSONAL_INFO.contact.rawPhone}`}
            aria-label="Call Pranet"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#d4af37] border border-white/10 text-[11px] font-medium transition"
          >
            <Phone className="w-3.5 h-3.5 mb-0.5" />
            <span>Call</span>
          </a>

          {/* Quick WhatsApp */}
          <a
            href={effectiveWhatsAppBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Pranet"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-[11px] font-medium transition"
          >
            <MessageSquare className="w-3.5 h-3.5 mb-0.5" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Book via Google Form */}
          <a
            href={effectiveGoogleBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[2] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c466] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.35)] cursor-pointer text-center"
          >
            <span>Book Now</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
