import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ArrowUp,
  MapPin,
  Mic,
  ShieldCheck,
  Calendar,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ShareFeedbackModal } from './ShareFeedbackModal';
import { GOOGLE_FORM_BOOKING_URL } from '../config/googleBookingConfig';

interface FooterProps {
  onOpenBooking?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050508] border-t border-[#d4af37]/20 text-[#a3a9be] pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10 text-left">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold tracking-wider text-[#fbf7ee] uppercase block">
                {PERSONAL_INFO.name}
              </span>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#d4af37] uppercase block">
                {PERSONAL_INFO.title}
              </span>
            </div>

            <p className="text-sm text-[#8c92a6] font-light max-w-md leading-relaxed">
              “{PERSONAL_INFO.tagline}” — Elevating cultural festivals, hackathons, academic convocations,
              and executive award ceremonies with refined stage presence, trilingual articulation, and crowd command.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={PERSONAL_INFO.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @anchorrpranet"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.contact.email}`}
                aria-label="Email Pranet"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] transition"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${PERSONAL_INFO.contact.rawPhone}`}
                aria-label="Call Pranet"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] transition"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-[#fbf7ee] transition">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#fbf7ee] transition">About & Persona</a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#fbf7ee] transition">Events & Experience</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#fbf7ee] transition">Photo Gallery</a>
              </li>
              <li>
                <a href="#achievements" className="hover:text-[#fbf7ee] transition">Achievements & Awards</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#fbf7ee] transition">Hosting Services</a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-[#fbf7ee] transition">Client Experiences & Feedback</a>
              </li>
              <li>
                <a href="#portfolio-deck" className="hover:text-[#fbf7ee] transition">Download Portfolio</a>
              </li>
            </ul>
          </div>

          {/* Contact & Booking Dispatch (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Direct Bookings & Contact
            </h4>
            <div className="space-y-2 text-sm text-[#8c92a6]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${PERSONAL_INFO.contact.rawPhone}`} className="text-white hover:text-[#d4af37] font-medium transition">
                  {PERSONAL_INFO.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`mailto:${PERSONAL_INFO.contact.email}`} className="text-white hover:text-[#d4af37] font-medium transition">
                  {PERSONAL_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{PERSONAL_INFO.contact.location}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={GOOGLE_FORM_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0a0a0c] hover:brightness-110 transition shadow-md cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Book For Your Event</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#d4af37] hover:text-[#fbf7ee] bg-white/5 hover:bg-white/10 border border-[#d4af37]/25 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Feedback Link (/feedback)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Share Feedback Link Modal */}
        <ShareFeedbackModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e7386]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>
              © {new Date().getFullYear()} Pranet Bhosale. All rights reserved. Stage photographs authentic & documented.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="text-xs text-[#6e7386] hover:text-[#d4af37] transition font-medium"
              title="Secure Administrator Dashboard"
            >
              Admin CMS
            </a>

            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="flex items-center gap-1.5 text-xs text-[#a3a9be] hover:text-[#d4af37] transition cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
