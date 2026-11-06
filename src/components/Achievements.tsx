import React from 'react';
import { Award, Trophy, Star, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/portfolioData';
import { GOOGLE_FORM_BOOKING_URL } from '../config/googleBookingConfig';

import { AchievementItem } from '../types';

interface AchievementsProps {
  achievements?: AchievementItem[];
  onSelectPhoto: (src: string, title: string, subtitle: string) => void;
  onOpenBooking?: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements, onSelectPhoto }) => {
  const items = achievements && achievements.length > 0 ? achievements : ACHIEVEMENTS;
  return (
    <section id="achievements" className="py-20 lg:py-28 bg-[#0a0a0c] relative border-t border-white/5">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-[radial-gradient(ellipse,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Adjudications</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            Verified Achievements
          </h2>
          <p className="text-sm sm:text-base text-[#9fa5b8]">
            Every accolade below is supported by documented physical trophies, institutional certificates of
            appreciation, and official stage adjudications.
          </p>
        </div>

        {/* 2x2 Showcase of Verified Honors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#111118] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_25px_-5px_rgba(212,175,55,0.15)] text-left"
            >
              <div className="space-y-5">
                {/* Visual Evidence (Real Trophy / Certificate Photo) */}
                {item.image && (
                  <div
                    onClick={() => onSelectPhoto(item.image!, item.title, item.organization)}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border border-[#d4af37]/20 bg-[#0d0d12] group-hover:border-[#d4af37]/50 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-black/20" />
                    
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#0a0a0c]/85 border border-[#d4af37]/30 text-[10px] font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1 backdrop-blur-sm">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{item.verifiedBadge || 'Verified Stage Honor'}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-[11px] text-[#f4e8d1] bg-[#0a0a0c]/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Click to inspect certificate & trophy</span>
                      <ExternalLink className="w-3 h-3 text-[#d4af37]" />
                    </div>
                  </div>
                )}

                {/* Achievement Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#8e94a8]">
                    <span className="text-[#d4af37] font-semibold">{item.organization}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[#a5abbf]">{item.year}</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#fbf7ee] group-hover:text-[#e5c07b] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-serif italic text-xs text-[#d4af37] font-normal">
                    {item.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#9ea4b8] leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Verified Trust Strip */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#10b981]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium text-[#9da3b7]">Official Documentation on File</span>
                </span>
                <a
                  href={GOOGLE_FORM_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#d4af37] hover:text-[#f4e8d1] transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Book Awarded Anchor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Oratory & Elocution Distinctions Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#14141d] via-[#171724] to-[#14141d] border border-[#d4af37]/25 text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
              Oratory & Stage Articulation Pedigree
            </div>
            <h4 className="font-display text-lg sm:text-xl font-bold text-[#fbf7ee]">
              Akashvani Pune Rank Holder & Literary Orator
            </h4>
            <p className="text-xs text-[#a0a5b8] leading-relaxed">
              Competitive elocution and state-level compering experience ensure crisp diction, flawless breath control,
              and nuanced pronunciation across English, Hindi, and Marathi dialects.
            </p>
          </div>

          <a
            href={GOOGLE_FORM_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] to-[#d4af37] rounded-md hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5"
          >
            <span>Book for Event</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
