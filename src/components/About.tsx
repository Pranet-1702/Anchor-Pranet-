import React from 'react';
import { Mic2, Users, Volume2, Award, BookOpen, Crown, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { GOOGLE_FORM_BOOKING_URL } from '../config/googleBookingConfig';

import { AdminPersonalInfo } from '../types/admin';

interface AboutProps {
  personalInfo?: AdminPersonalInfo;
  onOpenBooking?: () => void;
}

export const About: React.FC<AboutProps> = ({ personalInfo }) => {
  const info = personalInfo || PERSONAL_INFO;
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#070709] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            Professional Persona & Stage Craft
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            About Pranet Bhosale
          </h2>
          <p className="text-sm sm:text-base text-[#9ea4b8] font-light">
            Every gathering has a purpose; every stage requires a heartbeat. From academic solemnity to high-voltage
            festival euphoria, the microphone is a bridge that connects hosts, performers, and audiences.
          </p>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase: Real Stage Action + Editorial Frame */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative group rounded-2xl overflow-hidden border border-[#d4af37]/25 shadow-2xl bg-[#111118]">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src="/assets/aistudio/7_59dced08.jpeg"
                  alt="Pranet Bhosale delivering keynote address on the Umage Annual Social Gathring stage with Chief Guest Hon. Vinayak Bhosale"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0e0e14]/90 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-semibold text-[#f4e8d1]">Institutional Stage Moderation</span>
                    <span className="text-[#d4af37] font-mono text-[11px]">UMANG: Annual Social Gathering</span>
                  </div>
                  <p className="text-[11px] text-[#959bad] mt-1">
                    Moderating proceedings for Chief Guest Hon. Vinayak Bhosale & senior academic council.
                  </p>
                </div>
              </div>
            </div>

            {/* Language Proficiency Strip */}
            <div className="p-4 rounded-xl bg-[#12121a] border border-[#d4af37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#fbf7ee]">Multilingual Articulation</div>
                  <div className="text-[11px] text-[#8e94a8]">Fluent across regional & international delegates</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-medium">
                <span>EN</span>
                <span className="text-white/20">/</span>
                <span>HI</span>
                <span className="text-white/20">/</span>
                <span>MR</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-4 text-sm sm:text-base text-[#b0b5c7] leading-relaxed">
              <p>
                With over <strong className="text-[#fbf7ee] font-semibold">4 years of live stage experience</strong> and{' '}
                <strong className="text-[#fbf7ee] font-semibold">16+ successfully anchored events</strong>, I specialize
                in elevating live gatherings through articulate compering, precise dignitary protocol, and spontaneous
                audience rapport.
              </p>
              <p>
                Whether steering a <strong className="text-[#f4e8d1]">24-Hour National Hackathon</strong> with coding
                sprints and countdown intervals, addressing an auditorium of 800+ scholars, or anchoring the grand stage
                of a <strong className="text-[#f4e8d1]">multi-day cultural festival</strong> with live bands, I ensure
                your schedule moves seamlessly, participants feel celebrated, and key messages resonate with clarity.
              </p>
            </div>

            {/* Core Leadership Experience (Verified Roles: Cultural Secretary & Student Editor) */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-3">
                Verified Leadership Credentials
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#101016] border border-white/5 hover:border-[#d4af37]/30 transition-colors">
                  <div className="flex items-center gap-2.5 text-[#e5c07b] mb-1.5">
                    <Crown className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-display font-semibold text-sm text-[#fbf7ee]">Cultural Secretary</span>
                  </div>
                  <p className="text-xs text-[#9aa0b4] leading-normal">
                    Spearheaded institutional stage management, artist coordination, dignitary reception protocols, and
                    curated festival agendas for major annual social gatherings.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#101016] border border-white/5 hover:border-[#d4af37]/30 transition-colors">
                  <div className="flex items-center gap-2.5 text-[#e5c07b] mb-1.5">
                    <BookOpen className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-display font-semibold text-sm text-[#fbf7ee]">Student Editor</span>
                  </div>
                  <p className="text-xs text-[#9aa0b4] leading-normal">
                    Authored keynote scripts, formal presidential citations, speaker introductions, and official
                    publications, bringing literary precision to spoken stage delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Pillars of Stage Mastery */}
            <div className="pt-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#fbf7ee]">
                    Commanding Stage Poise & Gravitas
                  </h4>
                  <p className="text-xs text-[#8f95a8] mt-0.5">
                    Calm, confident posture that sets a tone of professionalism for institutional and corporate gatherings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#fbf7ee]">
                    Audience Chemistry & Spontaneity
                  </h4>
                  <p className="text-xs text-[#8f95a8] mt-0.5">
                    Intuitive crowd reading, quick-witted ad-libbing during technical delays, and natural situational humor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#fbf7ee]">
                    Rigorous Time & Protocol Management
                  </h4>
                  <p className="text-xs text-[#8f95a8] mt-0.5">
                    Exact respect for speaker schedules, formal honors etiquette, and smooth stage transitions.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Callout */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href={GOOGLE_FORM_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] to-[#d4af37] rounded-md hover:brightness-110 active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Book for Event</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="#achievements"
                className="text-xs text-[#d4af37] hover:text-[#f4e8d1] tracking-wider uppercase font-semibold transition-colors"
              >
                View Awards & Trophies →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
