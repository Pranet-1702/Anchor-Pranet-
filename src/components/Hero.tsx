import React from 'react';
import { ArrowRight, Award, Mic, Languages, CalendarCheck, Sparkles, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { AnimatedCounter } from './AnimatedCounter';
import { GOOGLE_FORM_BOOKING_URL, WHATSAPP_BOOKING_URL } from '../config/googleBookingConfig';

interface HeroProps {
  onOpenBooking?: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork }) => {
  return (
    <section id="home" className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Ambience: Subtle cinematic lighting beam & gold depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12)_0%,rgba(212,175,55,0.02)_50%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(229,192,123,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Elegant geometric grid accent overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Split-Screen Hero: 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quiet, unboxed kicker without pill badges */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
              <span>Stage Mastery</span>
              <span aria-hidden="true" className="text-[#8c91a4]">·</span>
              <span>Audience Chemistry</span>
              <span aria-hidden="true" className="text-[#8c91a4]">·</span>
              <span>Trilingual Eloquence</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#fbf7ee] uppercase leading-[1.08]">
                {PERSONAL_INFO.name}
              </h1>
              <p className="font-serif italic text-xl sm:text-2xl text-[#d4af37] font-normal tracking-wide">
                “{PERSONAL_INFO.tagline}”
              </p>
            </div>

            {/* Subtitle & Value Proposition */}
            <p className="text-sm sm:text-base text-[#a8adc0] leading-relaxed max-w-2xl font-light">
              Professional anchor and emcee trusted across Maharashtra for major cultural festivals, national 24-hour hackathons,
              VIP dignitary convocations, alumni meets, and corporate seminars. Bringing charismatic command, natural stage
              spontaneity, and flawless schedule orchestration to every live audience.
            </p>

            {/* Event Formats Handled */}
            <div className="pt-1 pb-2">
              <span className="text-xs uppercase tracking-wider text-[#7e8499] block mb-2 font-medium">
                Core Stage Specializations
              </span>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[#d0d4e4]">
                <span className="flex items-center gap-1.5 text-[#e5c07b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  Cultural Galas & Fest Fusions
                </span>
                <span className="text-[#494e63]">·</span>
                <span className="flex items-center gap-1.5 text-[#e5c07b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  24-Hour National Hackathons
                </span>
                <span className="text-[#494e63]">·</span>
                <span className="flex items-center gap-1.5 text-[#e5c07b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  VIP Dignitary Summits
                </span>
                <span className="text-[#494e63]">·</span>
                <span className="flex items-center gap-1.5 text-[#e5c07b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  National Prize Distributions
                </span>
              </div>
            </div>

            {/* Dual Booking CTAs (Google Form + WhatsApp) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* Primary: Google Form Booking (opens in new tab) */}
              <a
                href={GOOGLE_FORM_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold tracking-widest uppercase text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7e1d] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] cursor-pointer whitespace-nowrap overflow-hidden focus-visible:ring-2 focus-visible:ring-[#d4af37]"
              >
                <div className="absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                <span className="relative z-10">Book via Google Form</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 relative z-10" />
              </a>

              {/* Secondary: WhatsApp Booking (opens directly with pre-filled message) */}
              <a
                href={WHATSAPP_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-wider uppercase text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 hover:border-[#25D366] rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md focus-visible:ring-2 focus-visible:ring-[#25D366]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Book via WhatsApp</span>
              </a>

              {/* Explore Work Link */}
              <button
                onClick={onExploreWork}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-[#c5cbdb] hover:text-white bg-[#14141c]/60 hover:bg-[#1c1c28] border border-white/10 hover:border-[#d4af37]/40 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Explore Work</span>
              </button>
            </div>

            {/* Verified Trust Stamp */}
            <div className="pt-3 flex items-center gap-2 text-xs text-[#8c92a6]">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Authentic stage portfolio backed by verified certificates, trophies & real photography.</span>
            </div>
          </div>

          {/* Right Column: Cinematic Real Anchoring Visual with Layered Gold Lighting */}
          <div className="lg:col-span-5 relative">
            {/* Subtle moving light trails and atmospheric glow behind portrait */}
            <div
              className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,transparent_70%)] animate-light-trail pointer-events-none blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(243,227,169,0.12)_0%,transparent_70%)] animate-glow-pulse pointer-events-none blur-3xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Gold Frame with gentle breathing glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#d4af37]/50 via-transparent to-[#aa7e1d]/50 rounded-3xl blur-[3px]" />

              {/* Main Visual Container */}
              <div className="relative bg-[#111118] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.15)]">
                {/* Real Stage Photograph: High-Res Signature Portrait */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden group">
                  <img
                    src="/assets/aistudio/1_031bd9c3.jpg"
                    alt="Pranet Bhosale - Professional Anchor & Emcee at the podium"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Atmospheric gradient overlay scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/25 to-transparent" />

                  {/* Stage Snapshot Pill Overlay (Quiet metadata) */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#0a0a0c]/90 border border-[#d4af37]/30 backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <div className="font-display text-sm font-semibold text-[#fbf7ee]">Pranet Bhosale</div>
                        <div className="text-[11px] text-[#a5abbf]">Best Anchor Winner · Stage Host</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                          Verified Emcee
                        </span>
                        <span className="text-[11px] text-[#868c9f]">Pune & Nationwide</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Metrics & Highlights Strip (Placed below the hero split per guidelines) */}
        <div className="mt-14 pt-8 border-t border-[#d4af37]/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {/* Metric 1: 4+ Years */}
            <div className="p-5 rounded-2xl bg-[#111117] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                <CalendarCheck className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8f95a8]">Experience</span>
              </div>
              <AnimatedCounter
                end={4}
                suffix="+"
                label="Years On Stage"
                sublabel="Refined compering & audience mastery"
              />
            </div>

            {/* Metric 2: 16+ Hosted Events */}
            <div className="p-5 rounded-2xl bg-[#111117] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                <Mic className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8f95a8]">Events Hosted</span>
              </div>
              <AnimatedCounter
                end={16}
                suffix="+"
                label="Verified Stages"
                sublabel="Cultural, corporate & tech summits"
              />
            </div>

            {/* Metric 3: 3 Languages */}
            <div className="p-5 rounded-2xl bg-[#111117] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                <Languages className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8f95a8]">Languages</span>
              </div>
              <AnimatedCounter
                end={3}
                label="Fluent Tongues"
                sublabel="English · Hindi · Marathi"
              />
            </div>

            {/* Metric 4: Recognition */}
            <div className="p-5 rounded-2xl bg-[#111117] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                <Award className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8f95a8]">Adjudication</span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#e5c07b]">
                Best Anchor
              </div>
              <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#fbf7ee] mt-1">
                Winner & Rank 2
              </div>
              <p className="text-[11px] sm:text-xs text-[#8f95a8] font-light mt-1">
                Umang & Akashvani Pune Elocution
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
