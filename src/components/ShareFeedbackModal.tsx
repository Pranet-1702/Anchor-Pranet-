import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Globe,
  AlertCircle,
} from 'lucide-react';

interface ShareFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareFeedbackModal: React.FC<ShareFeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  if (!isOpen) return null;

  // Determine feedback URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const feedbackUrl = `${origin}/feedback`;
  const isLocalhost =
    origin.includes('localhost') || origin.includes('127.0.0.1');

  // WhatsApp invitation template requested
  const invitationText =
    `Hi! Thank you for being part of my event journey. I'd really appreciate it if you could share your genuine experience of working with me as an anchor. Your feedback means a lot to me: ${feedbackUrl}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    invitationText
  )}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(feedbackUrl);
      } else {
        // Fallback for older browsers or restricted environments
        const textArea = document.createElement('textarea');
        textArea.value = feedbackUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pranet Bhosale — Share Your Experience',
          text: `Hi! Thank you for being part of my event journey. I'd really appreciate it if you could share your genuine experience of working with me as an anchor:`,
          url: feedbackUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback gracefully to copy
        console.info('Share cancelled or not completed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040406]/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-[#0d0d14] border border-[#d4af37]/35 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(212,175,55,0.2)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#fbf7ee] hover:text-[#d4af37] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37] mb-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>Direct Client Invitation</span>
            </div>
            <h3
              id="share-modal-title"
              className="font-display text-2xl font-bold text-[#fbf7ee] tracking-tight uppercase"
            >
              Share Feedback Link
            </h3>
            <p className="text-xs sm:text-sm text-[#9fa5b8] mt-1 font-light leading-relaxed">
              Send this direct link to event organizers, faculty coordinators, clients, or co-hosts after any stage performance.
            </p>
          </div>

          {/* Actual Shareable URL Display Box */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
              Shareable Direct URL
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#14141e] border border-white/10 group focus-within:border-[#d4af37]/60 transition">
              <Globe className="w-4 h-4 text-[#d4af37] shrink-0 ml-1" />
              <input
                type="text"
                readOnly
                value={feedbackUrl}
                aria-label="Direct feedback URL"
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#fbf7ee] focus:outline-none selection:bg-[#d4af37] selection:text-black truncate"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#d4af37] text-black hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-400 font-medium animate-fadeIn">
                ✓ Feedback link copied to your clipboard.
              </p>
            )}
            {copyError && (
              <p className="text-[11px] text-rose-400 font-medium">
                Unable to copy automatically. Please copy the URL from the input box above.
              </p>
            )}
          </div>

          {/* Localhost / Deployment Notice */}
          {isLocalhost && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Note:</strong> You are currently on a local preview URL. When deployed to your custom domain or live cloud URL, external WhatsApp invitations will automatically use the live domain instead of localhost.
              </span>
            </div>
          )}

          {/* Action Buttons: WhatsApp & Native Share */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366] text-black hover:bg-[#20ba59] active:scale-95 transition shadow-lg"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Share on WhatsApp</span>
            </a>

            {typeof navigator !== 'undefined' && 'share' in navigator ? (
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-[#fbf7ee] border border-white/10 hover:border-[#d4af37]/40 active:scale-95 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>More Share Options</span>
              </button>
            ) : (
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-[#fbf7ee] border border-white/10 hover:border-[#d4af37]/40 active:scale-95 transition cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#d4af37]" />
                <span>Copy Invitation</span>
              </button>
            )}
          </div>

          {/* Invitation Preview */}
          <div className="p-3.5 rounded-xl bg-[#101018] border border-white/5 space-y-1.5 text-left">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8a90a2] block">
              WhatsApp Invitation Message Preview:
            </span>
            <p className="text-xs text-[#a9b0c5] italic leading-relaxed font-light">
              “Hi! Thank you for being part of my event journey. I'd really appreciate it if you could share your genuine experience of working with me as an anchor. Your feedback means a lot to me: <span className="text-[#d4af37] font-mono not-italic break-all">{feedbackUrl}</span>”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
