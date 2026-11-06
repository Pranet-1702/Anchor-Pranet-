import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Calendar, MapPin, Tag } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/portfolioData';

interface LightboxModalProps {
  photo: {
    src: string;
    title: string;
    subtitle: string;
  } | null;
  onClose: () => void;
  onSelectPhoto?: (src: string, title: string, subtitle: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  onClose,
  onSelectPhoto,
}) => {
  // Find current index in GALLERY_PHOTOS
  const currentIndex = photo
    ? GALLERY_PHOTOS.findIndex((p) => p.src === photo.src)
    : -1;

  const handlePrev = useCallback(() => {
    if (!onSelectPhoto || GALLERY_PHOTOS.length === 0) return;
    const prevIdx =
      currentIndex <= 0 ? GALLERY_PHOTOS.length - 1 : currentIndex - 1;
    const nextPhoto = GALLERY_PHOTOS[prevIdx];
    onSelectPhoto(nextPhoto.src, nextPhoto.title, nextPhoto.subtitle);
  }, [currentIndex, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (!onSelectPhoto || GALLERY_PHOTOS.length === 0) return;
    const nextIdx =
      currentIndex >= GALLERY_PHOTOS.length - 1 ? 0 : currentIndex + 1;
    const nextPhoto = GALLERY_PHOTOS[nextIdx];
    onSelectPhoto(nextPhoto.src, nextPhoto.title, nextPhoto.subtitle);
  }, [currentIndex, onSelectPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (photo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose, handlePrev, handleNext]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || 'Enlarged stage photo'}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#040406]/95 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-[#0d0d14] border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(212,175,55,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#12121c]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
              Stage Performance Archive
            </span>
            {currentIndex >= 0 && (
              <span className="text-xs text-[#8c91a4] ml-2">
                ({currentIndex + 1} of {GALLERY_PHOTOS.length})
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close photo preview"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#fbf7ee] hover:text-[#d4af37] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-1 min-h-[300px] max-h-[68vh] bg-black/80 flex items-center justify-center overflow-hidden">
          <img
            src={photo.src}
            alt={photo.title || 'Stage performance by Pranet Bhosale'}
            className="max-h-[66vh] w-auto max-w-full object-contain mx-auto select-none"
          />

          {/* Navigation Controls */}
          {currentIndex >= 0 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous photograph"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0a0a10]/80 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-white/10 hover:border-[#d4af37] cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next photograph"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0a0a10]/80 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-white/10 hover:border-[#d4af37] cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Footer Details */}
        <div className="px-6 py-4 bg-[#101018] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-[#fbf7ee] tracking-tight">
              {photo.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#9fa5b8]">
              {photo.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-[#787d90] hidden sm:inline">
              Use arrow keys to navigate
            </span>
            <a
              href={photo.src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 text-[#fbf7ee] transition"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Full File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
