import React, { useState } from 'react';
import { FileText, MessageSquare, ExternalLink, Settings, Check, Sparkles } from 'lucide-react';
import { BOOKING_CONFIG } from '../config/bookingConfig';

interface BookingButtonsProps {
  size?: 'sm' | 'md' | 'lg';
  layout?: 'row' | 'col' | 'responsive';
  eventContext?: { title?: string; type?: string; location?: string };
  className?: string;
  showConfigTrigger?: boolean;
}

export const BookingButtons: React.FC<BookingButtonsProps> = ({
  size = 'md',
  layout = 'responsive',
  eventContext,
  className = '',
  showConfigTrigger = false,
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(BOOKING_CONFIG.googleForm.getUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const googleFormUrl = BOOKING_CONFIG.googleForm.getUrl();
  const isGoogleFormConfigured = BOOKING_CONFIG.googleForm.isConfigured();
  const whatsappUrl = BOOKING_CONFIG.whatsapp.getUrl(eventContext);

  const handleGoogleFormClick = (e: React.MouseEvent) => {
    if (!isGoogleFormConfigured) {
      // If still placeholder, notify or offer quick configuration
      e.preventDefault();
      setIsConfigOpen(true);
      return;
    }
    // Directly opens in new tab via target="_blank" on the anchor
  };

  const handleSaveFormUrl = (e: React.FormEvent) => {
    e.preventDefault();
    BOOKING_CONFIG.googleForm.setUrl(customUrlInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsConfigOpen(false);
    }, 1500);
  };

  // Button size styling
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-[11px] gap-1.5',
    md: 'px-5 py-2.5 sm:py-3 text-xs gap-2',
    lg: 'px-7 py-3.5 sm:py-4 text-xs sm:text-sm gap-2.5',
  }[size];

  // Layout styling
  const layoutClasses = {
    row: 'flex flex-row items-center gap-3',
    col: 'flex flex-col items-stretch gap-2.5',
    responsive: 'flex flex-col sm:flex-row items-stretch sm:items-center gap-3',
  }[layout];

  return (
    <>
      <div className={`${layoutClasses} ${className}`}>
        {/* Button 1: Book via Google Form */}
        <a
          href={googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleGoogleFormClick}
          className={`group relative inline-flex items-center justify-center font-bold uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7e1d] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] whitespace-nowrap overflow-hidden cursor-pointer ${sizeClasses}`}
        >
          {/* Subtle continuous golden sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
          <FileText className="w-4 h-4 shrink-0 text-[#0a0a0c]" />
          <span>Book via Google Form</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5" />
        </a>

        {/* Button 2: Book via WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center font-bold uppercase tracking-wider text-[#fbf7ee] bg-[#101018] hover:bg-[#161622] border border-[#25D366]/40 hover:border-[#25D366] rounded-xl hover:shadow-[0_0_20px_rgba(37,211,102,0.25)] active:scale-95 transition-all whitespace-nowrap cursor-pointer ${sizeClasses}`}
        >
          <div className="w-4 h-4 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3 h-3 text-[#25D366]" />
          </div>
          <span className="text-[#25D366]">Book via WhatsApp</span>
        </a>

        {/* Optional Admin Setup Cog */}
        {showConfigTrigger && (
          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            title="Configure Google Form URL"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8e94a8] hover:text-[#d4af37] border border-white/5 transition cursor-pointer shrink-0"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Lightweight Google Form URL Config Modal */}
      {isConfigOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040406]/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsConfigOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#0d0d14] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-7 shadow-2xl text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
              <FileText className="w-4 h-4" />
              <span>Google Form Configuration</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-[#fbf7ee]">
                Connect Your Google Form
              </h3>
              <p className="text-xs text-[#9aa0b4] leading-relaxed">
                Paste your published Google Form link. When visitors click &ldquo;Book via Google Form&rdquo;, they will be directed directly to this form in a new tab.
              </p>
            </div>

            <form onSubmit={handleSaveFormUrl} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] mb-1">
                  Google Form URL
                </label>
                <input
                  type="url"
                  required
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141e] border border-white/10 focus:border-[#d4af37] text-xs font-mono text-white focus:outline-none"
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Google Form link saved successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8f95a8] hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-[#d4af37] hover:brightness-110 transition cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
