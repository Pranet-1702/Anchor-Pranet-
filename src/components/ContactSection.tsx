import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Linkedin,
  MapPin,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import {
  GOOGLE_FORM_BOOKING_URL,
  WHATSAPP_BOOKING_URL,
  getWhatsAppBookingUrl,
} from '../config/googleBookingConfig';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 3000);
  };

  const whatsappUrl = initialService
    ? getWhatsAppBookingUrl(initialService)
    : WHATSAPP_BOOKING_URL;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#07070a] relative border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-[radial-gradient(ellipse,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Stage Reservations</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            Book Pranet For Your Event
          </h2>
          <p className="text-sm sm:text-base text-[#9fa5b8]">
            Choose your preferred booking channel below to verify availability, review format curation, and confirm stage dates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Contact & Information */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="rounded-2xl bg-[#101016] border border-white/5 p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                  Immediate Inquiries
                </span>
                <h3 className="font-display text-xl font-bold text-[#fbf7ee]">
                  Direct Stage Management
                </h3>
                <p className="text-xs sm:text-sm text-[#9aa0b4] mt-2 leading-relaxed">
                  For time-sensitive bookings, festival dates, or urgent emcee replacements, contact Pranet directly via phone or WhatsApp.
                </p>
              </div>

              {/* Verified Contact Details */}
              <div className="space-y-3 pt-2">
                {/* Phone */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151520] border border-white/5 hover:border-[#d4af37]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#7f859a] uppercase font-semibold tracking-wider">
                        Direct Line
                      </div>
                      <a
                        href={`tel:${PERSONAL_INFO.contact.rawPhone}`}
                        className="text-sm font-semibold text-[#fbf7ee] hover:text-[#d4af37] transition-colors"
                      >
                        {PERSONAL_INFO.contact.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(PERSONAL_INFO.contact.phone, 'phone')}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-[#a0a5b8] hover:text-[#d4af37] transition-colors cursor-pointer"
                    title="Copy phone number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151520] border border-white/5 hover:border-[#d4af37]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#7f859a] uppercase font-semibold tracking-wider">
                        Official Email
                      </div>
                      <a
                        href={`mailto:${PERSONAL_INFO.contact.email}`}
                        className="text-xs sm:text-sm font-medium text-[#fbf7ee] hover:text-[#d4af37] transition-colors break-all"
                      >
                        {PERSONAL_INFO.contact.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(PERSONAL_INFO.contact.email, 'email')}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-[#a0a5b8] hover:text-[#d4af37] transition-colors cursor-pointer"
                    title="Copy email address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Instagram */}
                <a
                  href={PERSONAL_INFO.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#151520] border border-white/5 hover:border-[#d4af37]/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors shrink-0">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#7f859a] uppercase font-semibold tracking-wider">
                        Instagram
                      </div>
                      <div className="text-sm font-medium text-[#fbf7ee] group-hover:text-[#d4af37] transition-colors">
                        {PERSONAL_INFO.contact.instagram}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#8f95a8] group-hover:text-white transition-colors">
                    View Profile →
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href={PERSONAL_INFO.contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#151520] border border-white/5 hover:border-[#d4af37]/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors shrink-0">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#7f859a] uppercase font-semibold tracking-wider">
                        LinkedIn
                      </div>
                      <div className="text-sm font-medium text-[#fbf7ee] group-hover:text-[#d4af37] transition-colors">
                        {PERSONAL_INFO.contact.linkedin}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#8f95a8] group-hover:text-white transition-colors">
                    Connect →
                  </span>
                </a>
              </div>

              {copiedContact && (
                <div className="p-2 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fbf7ee] text-xs text-center animate-fadeIn">
                  Copied {copiedContact} to clipboard!
                </div>
              )}
            </div>

            {/* Geographic Coverage */}
            <div className="p-5 rounded-2xl bg-[#101016] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                <MapPin className="w-4 h-4" />
                <span>Geographic Reach</span>
              </div>
              <p className="text-xs text-[#959bad] leading-relaxed">
                Based in <strong className="text-white">Pune &amp; Kolhapur, Maharashtra</strong>. Readily available for
                statewide and pan-India travel for college cultural festivals, national hackathons, and corporate conventions.
              </p>
            </div>
          </div>

          {/* Right Column: Final 2 Booking Channels Hub */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Channel 1: Google Form Booking (Primary) */}
            <div className="relative rounded-2xl bg-[#101016] border border-[#d4af37]/40 p-6 sm:p-8 shadow-2xl space-y-5 hover:border-[#d4af37] transition-all duration-300 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37]/25 to-transparent border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-inner">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] block">
                      Method 1 · Recommended
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#fbf7ee]">
                      Google Form Booking
                    </h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#d4af37]/15 text-[#e5c07b] border border-[#d4af37]/30">
                  Official Form
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#a4aabf] leading-relaxed">
                Submit comprehensive event details including event date, schedule, venue location, expected audience size, VIP protocols, and specific language requirements directly into Pranet's calendar queue.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-[#b8bdcd]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Comprehensive run-of-show details</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Direct Google calendar sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Ideal for formal &amp; college fests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Opens instantly in new tab</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={GOOGLE_FORM_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7e1d] text-[#0a0a0c] font-bold text-xs sm:text-sm tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Book via Google Form</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Channel 2: WhatsApp Instant Booking */}
            <div className="relative rounded-2xl bg-[#101016] border border-[#25D366]/30 p-6 sm:p-8 shadow-2xl space-y-5 hover:border-[#25D366] transition-all duration-300 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shadow-inner">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#25D366] block">
                      Method 2 · Instant Chat
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#fbf7ee]">
                      WhatsApp Direct Booking
                    </h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                  Fastest Response
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#a4aabf] leading-relaxed">
                Connect directly with Pranet on <strong className="text-white">+91 7391035544</strong> with a pre-filled enquiry template. Perfect for quick availability checks, short-notice events, or urgent booking dates.
              </p>

              {/* Pre-filled Message Preview Box */}
              <div className="p-3.5 rounded-xl bg-[#0c0c12] border border-white/5 space-y-1.5 font-mono text-[11px] text-[#9ba0b4]">
                <div className="text-[#25D366] font-semibold text-[10px] uppercase tracking-wider font-sans">
                  Pre-filled Message Template:
                </div>
                <p className="text-xs text-[#cfd4e6] font-sans">
                  "Hello Pranet! I visited your anchoring portfolio website and would like to enquire about booking you for an event."
                </p>
                <div className="text-[10px] text-[#71778c] pt-1">
                  Includes Event Name, Event Date, Event Location, and Event Type fields.
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs sm:text-sm tracking-widest uppercase hover:brightness-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Direct Booking Assurance Note */}
            <div className="p-4 rounded-xl bg-[#14141e]/60 border border-white/5 flex items-center gap-3 text-xs text-[#8c92a6]">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>
                Both booking options connect directly to Pranet Bhosale. Zero agency middleman commissions or delays.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
