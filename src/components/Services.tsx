import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Users2, Calendar, FileText, MessageSquare, ExternalLink } from 'lucide-react';
import { HOSTING_SERVICES } from '../data/portfolioData';
import { ServiceItem } from '../types';
import { GOOGLE_FORM_BOOKING_URL, getWhatsAppBookingUrl } from '../config/googleBookingConfig';

interface ServicesProps {
  services?: ServiceItem[];
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectServiceForBooking }) => {
  const items = services && services.length > 0 ? services : HOSTING_SERVICES;
  return (
    <section id="services" className="py-20 lg:py-28 bg-[#070709] relative border-t border-white/5">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            Professional Hosting Solutions
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            Anchoring & Emcee Services
          </h2>
          <p className="text-sm sm:text-base text-[#9fa5b8]">
            Tailored stage curation designed around your event format, protocol requirements, and audience demographics.
            Transparent, bespoke proposals with no arbitrary tiering.
          </p>
        </div>

        {/* 3-Column Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service, index) => (
            <div
              key={service.id}
              className="rounded-2xl bg-[#101016] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,175,55,0.12)] text-left"
            >
              <div className="space-y-4">
                {/* Clean index numbering (per design guidelines: Natural editorial numbering) */}
                <div className="flex items-center justify-between text-xs text-[#7e8499]">
                  <span className="font-serif italic text-sm text-[#d4af37]">0{index + 1}.</span>
                  <span className="text-[11px] font-mono text-[#8a90a4]">{service.recommendedAudience}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-xl font-bold text-[#fbf7ee] group-hover:text-[#e5c07b] transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-serif italic text-xs text-[#d4af37] font-normal">
                    {service.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#9ea4b8] leading-relaxed">
                  {service.description}
                </p>

                {/* Formats Covered */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#73798e] font-semibold block mb-1.5">
                    Formats Covered
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.formats.map((fmt, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded bg-[#181824] text-[#cfd3e4] border border-white/5"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#73798e] font-semibold block">
                    Key Stage Deliverables
                  </span>
                  {service.keyDeliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#b0b5c7]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Booking CTAs for each service */}
              <div className="mt-8 pt-4 border-t border-white/5 space-y-2">
                <a
                  href={GOOGLE_FORM_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-[#0a0a0c] font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:brightness-110"
                >
                  <span>Book via Google Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={getWhatsAppBookingUrl(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-semibold text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Hosting Brief Banner with Both Booking Options */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#0f0f16] border border-[#d4af37]/25 text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h4 className="font-display text-lg font-bold text-[#fbf7ee]">
              Hosting a Unique or Multi-Day Event?
            </h4>
            <p className="text-xs text-[#9aa0b4]">
              Custom compering schedules, bilingual scripting, dignitary briefings, and rehearsal attendance can be
              tailored to your exact event run-sheet.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href={GOOGLE_FORM_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] to-[#d4af37] rounded-md hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shadow-md inline-flex items-center justify-center gap-1.5"
            >
              <span>Book via Google Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={getWhatsAppBookingUrl('Custom / Multi-Day Event')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 text-xs font-bold tracking-wider uppercase text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/35 rounded-md hover:border-[#25D366] transition-all cursor-pointer whitespace-nowrap shadow-sm inline-flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Book via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
