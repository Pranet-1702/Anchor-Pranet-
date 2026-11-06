import React, { useState } from 'react';
import { Calendar, MapPin, Building, Sparkles, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { VERIFIED_EVENTS } from '../data/portfolioData';
import { EventCategory, EventItem } from '../types';
import { GOOGLE_FORM_BOOKING_URL } from '../config/googleBookingConfig';

interface EventsExperienceProps {
  onSelectPhoto: (src: string, title: string, subtitle: string) => void;
  onOpenBooking?: (serviceName?: string) => void;
  events?: EventItem[];
}

export const EventsExperience: React.FC<EventsExperienceProps> = ({ onSelectPhoto, events = VERIFIED_EVENTS }) => {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);

  const categories: { key: EventCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Events', count: events.length },
    {
      key: 'cultural',
      label: 'Cultural Festivals',
      count: events.filter((e) => e.category === 'cultural').length,
    },
    {
      key: 'hackathons',
      label: 'Hackathons & Summits',
      count: events.filter((e) => e.category === 'hackathons').length,
    },
    {
      key: 'technical',
      label: 'Technical Fests & Awards',
      count: events.filter((e) => e.category === 'technical').length,
    },
    {
      key: 'alumni',
      label: 'Alumni & Institutional',
      count: events.filter((e) => e.category === 'alumni').length,
    },
    {
      key: 'seminars',
      label: 'Seminars & State Programs',
      count: events.filter((e) => e.category === 'seminars').length,
    },
  ];

  const filteredEvents =
    activeCategory === 'all'
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <section id="events" className="py-20 lg:py-28 bg-[#0a0a0c] relative border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            Documented Stage Portfolio
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            Events & Hosting Experience
          </h2>
          <p className="text-sm sm:text-base text-[#9fa5b8]">
            A documented chronicle of 16+ stages anchored across premier engineering colleges, state entrepreneurship
            cells, 24-hour national hackathons, and multi-thousand audience cultural gatherings.
          </p>
        </div>

        {/* Interactive Filter Tabs (Buttons with click handlers per design guidelines 1.A) */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7e1d] text-[#0a0a0c] font-bold shadow-[0_2px_12px_rgba(212,175,55,0.25)]'
                    : 'bg-[#14141c] text-[#a0a5b8] hover:text-[#fbf7ee] hover:bg-[#1a1a24] border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#0a0a0c]/25 text-[#0a0a0c]' : 'bg-white/5 text-[#888e9f]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-white/5 bg-[#111118]/40 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-[#d4af37]/60 mx-auto mb-3" />
            <p className="text-white font-medium text-sm">No events found in this category.</p>
            <p className="text-zinc-500 text-xs mt-1">Check back soon or select another category above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl bg-[#111118] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,175,55,0.15)]"
            >
              {/* Event Verified Image */}
              {event.image ? (
                <div
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-[#0e0e14]"
                  onClick={() => onSelectPhoto(event.image!, event.title, event.organizer)}
                >
                  <img
                    src={event.image}
                    alt={event.imageAlt || event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-black/30" />

                  {/* Category Stamp & Date (Quiet, unboxed metadata) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#f4e8d1] drop-shadow-md">
                    <span className="bg-[#0a0a0c]/85 px-2.5 py-1 rounded border border-[#d4af37]/30 text-[#e5c07b] font-medium backdrop-blur-sm">
                      {event.categoryLabel}
                    </span>
                    <span className="bg-[#0a0a0c]/85 px-2 py-1 rounded text-[#a5abbf] font-mono backdrop-blur-sm">
                      {event.date}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[11px] text-[#d4af37] bg-[#0a0a0c]/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Photo</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#161622] via-[#0f0f18] to-[#0a0a0f] flex flex-col items-center justify-center p-6 border-b border-white/5 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-2 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                    <Sparkles className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
                    Stage Record Verified
                  </span>
                  <span className="text-[11px] text-[#8e95aa] mt-1 max-w-[220px]">
                    Official photograph pending organizer review
                  </span>
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#f4e8d1]">
                    <span className="bg-[#0a0a0c]/85 px-2.5 py-1 rounded border border-[#d4af37]/30 text-[#e5c07b] font-medium backdrop-blur-sm">
                      {event.categoryLabel}
                    </span>
                    <span className="bg-[#0a0a0c]/85 px-2 py-1 rounded text-[#a5abbf] font-mono backdrop-blur-sm">
                      {event.date}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2.5">
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-2 text-xs text-[#8f95a8]">
                    <span className="text-[#d4af37] font-medium">{event.organizer}</span>
                    {event.location && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#fbf7ee] group-hover:text-[#e5c07b] transition-colors leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#959bad] leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="pt-3 border-t border-white/5 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-[#6b7285] font-semibold">
                    Hosting Highlights
                  </div>
                  {event.highlights.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-[#b4b9cb]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Card Footer */}
                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEventModal(event)}
                    className="text-xs text-[#d4af37] hover:text-[#f4e8d1] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Full Event Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={GOOGLE_FORM_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] px-3 py-1 rounded bg-[#181822] hover:bg-[#d4af37] text-[#c4c9da] hover:text-[#0a0a0c] transition-colors border border-white/5 cursor-pointer font-medium inline-flex items-center gap-1"
                  >
                    <span>Book Similar Event</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Event Detail Modal */}
        {selectedEventModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedEventModal(null)}
          >
            <div
              className="bg-[#101016] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                  <span>{selectedEventModal.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[#a5abbf]">{selectedEventModal.date}</span>
                </div>
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              {selectedEventModal.image && (
                <div className="mt-4 rounded-xl overflow-hidden aspect-[16/9] border border-white/10">
                  <img
                    src={selectedEventModal.image}
                    alt={selectedEventModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mt-5 space-y-3">
                <h3 className="font-display text-2xl font-bold text-[#fbf7ee]">
                  {selectedEventModal.title}
                </h3>
                <div className="text-xs text-[#959bad] flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#d4af37]" />
                    {selectedEventModal.organizer}
                  </span>
                  {selectedEventModal.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      {selectedEventModal.location}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#b0b5c7] leading-relaxed pt-2">
                  {selectedEventModal.description}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#d4af37]">
                    Execution Highlights
                  </div>
                  {selectedEventModal.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#c5cadb]">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="px-4 py-2 text-xs text-[#959bad] hover:text-white transition-colors"
                >
                  Close
                </button>
                <a
                  href={GOOGLE_FORM_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] to-[#d4af37] rounded-md hover:brightness-110 transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Book for Event</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
