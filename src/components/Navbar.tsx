import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, Sparkles, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { GOOGLE_FORM_BOOKING_URL } from '../config/googleBookingConfig';

interface NavbarProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'My Work', href: '#events' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Services', href: '#services' },
    { label: 'Feedback', href: '#feedback' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0c]/95 backdrop-blur-md border-b border-[#d4af37]/20 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#0a0a0c]/90 to-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 xl:gap-6">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <a
            href="#home"
            className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 group whitespace-nowrap shrink-0 text-left"
            aria-label="Pranet Bhosale Home"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#15151c] text-[#f4e8d1] font-serif font-bold text-xs sm:text-sm tracking-wider group-hover:border-[#d4af37] transition-colors shrink-0">
              PB
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs sm:text-sm xl:text-base tracking-wider text-[#fbf7ee] group-hover:text-[#d4af37] transition-colors">
                PRANET BHOSALE
              </span>
              <span className="text-[8px] sm:text-[9px] xl:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[#a0a5b5] font-sans">
                Professional Anchor & Emcee
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Clean single-line text links with subtle hover underlines) */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[11px] 2xl:text-xs font-medium tracking-wide uppercase text-[#c3c7d5]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#f4e8d1] transition-colors relative py-1 px-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#d4af37] hover:after:w-full after:transition-all after:duration-200 whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${PERSONAL_INFO.contact.rawPhone}`}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#d4af37] border border-[#d4af37]/30 rounded-md hover:bg-[#d4af37]/10 transition-colors whitespace-nowrap"
              title="Call Pranet Bhosale directly"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="tabular-nums font-mono">7391035544</span>
            </a>

            {/* Direct Google Form Booking CTA */}
            <a
              href={GOOGLE_FORM_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 xl:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7e1d] rounded-md hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_12px_rgba(212,175,55,0.25)] whitespace-nowrap shrink-0"
            >
              <span>Book for Event</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Mobile Menu Button - Shown below xl */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-[#c3c7d5] hover:text-[#fbf7ee] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0c0c10] border-b border-[#d4af37]/20 px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium tracking-wider uppercase text-[#d5d9e5] hover:text-[#d4af37] py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-3">
              <a
                href={`tel:${PERSONAL_INFO.contact.rawPhone}`}
                className="flex items-center justify-center gap-2 py-2.5 text-xs text-[#d4af37] border border-[#d4af37]/30 rounded-md bg-[#15151c]"
              >
                <PhoneCall className="w-4 h-4" />
                <span className="tabular-nums">Call: +91 7391035544</span>
              </a>
              <a
                href={GOOGLE_FORM_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-xs font-semibold tracking-wider uppercase text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] to-[#c59b27] rounded-md shadow-lg text-center flex items-center justify-center gap-1.5"
              >
                <span>Book for Event</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
