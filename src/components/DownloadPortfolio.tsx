import React, { useState } from 'react';
import { FileDown, FileText, CheckCircle2, Eye, Printer, Send, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO, ACHIEVEMENTS, VERIFIED_EVENTS } from '../data/portfolioData';
import { GOOGLE_FORM_BOOKING_URL } from '../config/googleBookingConfig';

interface DownloadPortfolioProps {
  onOpenBooking?: () => void;
}

export const DownloadPortfolio: React.FC<DownloadPortfolioProps> = () => {
  const [showOneSheetModal, setShowOneSheetModal] = useState(false);

  return (
    <section id="portfolio-deck" className="py-16 lg:py-24 bg-[#0a0a0c] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#12121b] via-[#151520] to-[#0e0e15] border border-[#d4af37]/30 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-left relative overflow-hidden">
          {/* Subtle gold watermarking / corner ornament */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
                <FileText className="w-3.5 h-3.5" />
                <span>Executive Dossier & One-Sheet</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#fbf7ee] uppercase tracking-tight">
                Download Anchoring Portfolio
              </h2>

              <p className="text-sm text-[#a8adc0] leading-relaxed max-w-2xl">
                Need a comprehensive profile deck for your committee, management board, or event planning agency?
                Review the verified credentials, stage track record, client references, and language proficiencies.
              </p>

              {/* Verified Status Note */}
              <div className="flex items-start sm:items-center gap-2.5 p-3 rounded-lg bg-[#0a0a0c]/80 border border-[#d4af37]/20 text-xs text-[#c5cadb]">
                <AlertCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  <strong>Portfolio Status:</strong> Official high-res PDF is prepared per event brief. You can instantly
                  preview or print the <strong>Digital One-Sheet</strong> below or request the comprehensive deck via email.
                </span>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#d0d4e4]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>16+ Verified Stages</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Best Anchor Adjudications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Trilingual Delivery (EN/HI/MR)</span>
                </div>
              </div>
            </div>

            {/* Right Buttons Container */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {/* Button 1: Preview Digital One-Sheet */}
              <button
                onClick={() => setShowOneSheetModal(true)}
                className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7e1d] text-[#0a0a0c] font-bold text-xs tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Digital One-Sheet</span>
              </button>

              {/* Button 2: Request PDF via Email / Direct Message */}
              <a
                href={`mailto:${PERSONAL_INFO.contact.email}?subject=Requesting Anchoring Portfolio PDF for Pranet Bhosale&body=Hi Pranet,%0D%0A%0D%0AWe are planning an upcoming event and would like to review your complete Anchoring Portfolio PDF.%0D%0A%0D%0AEvent Details:%0D%0A- Event Type:%0D%0A- Expected Date:%0D%0A- Location:%0D%0A%0D%0AThank you!`}
                className="w-full py-3 px-6 rounded-lg bg-[#181824] hover:bg-[#202030] text-[#fbf7ee] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#d4af37]" />
                <span>Request PDF via Email</span>
              </a>

              <p className="text-[11px] text-[#787f95] text-center">
                Direct dispatch within 2 business hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital One-Sheet Modal / Printable Dossier */}
      {showOneSheetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowOneSheetModal(false)}
        >
          <div
            className="bg-[#0e0e14] border border-[#d4af37]/50 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left print:bg-white print:text-black print:p-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 print:hidden">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
                <FileText className="w-4 h-4" />
                <span>Verified Executive Profile One-Sheet</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-[#1c1c28] hover:bg-[#d4af37] text-[#e2e8f0] hover:text-[#0a0a0c] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowOneSheetModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable One-Sheet Document Content */}
            <div className="py-6 space-y-6">
              {/* Header Lockup */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-wider uppercase text-[#fbf7ee]">
                    {PERSONAL_INFO.name}
                  </h3>
                  <div className="font-serif italic text-sm text-[#d4af37] mt-0.5">
                    {PERSONAL_INFO.title}
                  </div>
                  <div className="text-xs text-[#a0a5b8] mt-1">
                    {PERSONAL_INFO.tagline} · Pune, Maharashtra
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 space-y-1 text-xs text-[#cbd0e2]">
                  <div>Phone: <strong className="text-white">{PERSONAL_INFO.contact.phone}</strong></div>
                  <div>Email: <strong className="text-white">{PERSONAL_INFO.contact.email}</strong></div>
                  <div>Instagram: <strong className="text-[#d4af37]">{PERSONAL_INFO.contact.instagram}</strong></div>
                  <div>LinkedIn: <strong className="text-white">{PERSONAL_INFO.contact.linkedin}</strong></div>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#14141d] border border-white/5 text-center">
                <div>
                  <div className="font-display text-xl font-bold text-[#fbf7ee] tabular-nums">
                    {PERSONAL_INFO.yearsExperience} Years
                  </div>
                  <div className="text-[11px] text-[#8e94a8]">Stage Experience</div>
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-[#fbf7ee] tabular-nums">
                    {PERSONAL_INFO.eventsHosted} Events
                  </div>
                  <div className="text-[11px] text-[#8e94a8]">Hosted Successfully</div>
                </div>
                <div>
                  <div className="font-display text-base font-bold text-[#e5c07b]">
                    3 Languages
                  </div>
                  <div className="text-[11px] text-[#8e94a8]">EN · HI · MR</div>
                </div>
              </div>

              {/* Bio Summary */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#d4af37]">
                  Professional Executive Summary
                </div>
                <p className="text-xs text-[#b0b5c7] leading-relaxed">
                  {PERSONAL_INFO.leadBio} Experienced Cultural Secretary and Student Editor adept at managing high-pressure
                  schedules, coordinating with VIP dignitaries, and sustaining high crowd vitality across 24-hour hackathons,
                  technical festivals, and large-scale cultural gatherings.
                </p>
              </div>

              {/* Verified Achievements */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#d4af37]">
                  Verified Awards & Stage Adjudications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="p-3 rounded-lg bg-[#14141d] border border-white/5 text-xs">
                      <div className="font-bold text-[#fbf7ee]">{ach.title}</div>
                      <div className="text-[#d4af37] text-[11px] mt-0.5">{ach.organization}</div>
                      <div className="text-[#888e9f] text-[10px] mt-1">{ach.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Event Portfolio Overview */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#d4af37]">
                  Documented Events Portfolio (Selection)
                </div>
                <div className="space-y-2">
                  {VERIFIED_EVENTS.slice(0, 5).map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 rounded bg-[#12121a] flex items-center justify-between text-xs border border-white/5"
                    >
                      <div>
                        <span className="font-semibold text-white">{evt.title}</span>
                        <span className="text-[#8e94a8] block text-[11px]">
                          {evt.organizer} · {evt.categoryLabel}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#d4af37] shrink-0">{evt.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTA in Modal */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between print:hidden">
              <span className="text-xs text-[#8e94a8]">
                Ready to lock in your event date?
              </span>
              <a
                href={GOOGLE_FORM_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] to-[#d4af37] rounded-md hover:brightness-110 cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Book Pranet Bhosale</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
