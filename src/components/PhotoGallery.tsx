import React, { useState } from 'react';
import { Maximize2, Camera, Filter } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/portfolioData';
import { GalleryPhoto } from '../types';

interface PhotoGalleryProps {
  onSelectPhoto: (src: string, title: string, subtitle: string) => void;
  photos?: GalleryPhoto[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onSelectPhoto, photos = GALLERY_PHOTOS }) => {
  const [filter, setFilter] = useState<'all' | 'stage' | 'felicitation' | 'hackathon' | 'formal'>('all');

  const filterTabs: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All Photographs' },
    { key: 'stage', label: 'Main Stages & Galas' },
    { key: 'felicitation', label: 'Awards & Honors' },
    { key: 'hackathon', label: 'Hackathons & Summits' },
    { key: 'formal', label: 'Formal Podiums' },
  ];

  const filteredPhotos =
    filter === 'all'
      ? photos
      : photos.filter((photo) => photo.category === filter);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#070709] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            <Camera className="w-3.5 h-3.5" />
            <span>Cinematic Stage Gallery</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            Stage Performances in Motion
          </h2>
          <p className="text-sm sm:text-base text-[#9fa5b8]">
            Authentic, unedited documentary photography capturing real stage moments, audience interactions, and
            award ceremonies across Maharashtra.
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#d4af37] text-[#0a0a0c] font-bold shadow-[0_2px_12px_rgba(212,175,55,0.25)]'
                    : 'bg-[#12121a] text-[#a0a5b8] hover:text-[#fbf7ee] hover:bg-[#181824] border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Editorial Masonry Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-white/5 bg-[#111118]/40 max-w-md mx-auto">
            <Camera className="w-8 h-8 text-[#d4af37]/60 mx-auto mb-3" />
            <p className="text-white font-medium text-sm">No photos found in this category.</p>
            <p className="text-zinc-500 text-xs mt-1">Check back soon or select another category above.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                role="button"
                tabIndex={0}
                aria-label={`View enlarged photo: ${photo.title}`}
                onClick={() => onSelectPhoto(photo.src, photo.title, photo.subtitle)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPhoto(photo.src, photo.title, photo.subtitle);
                  }
                }}
                className="group break-inside-avoid relative rounded-2xl overflow-hidden bg-[#111118] border border-white/5 hover:border-[#d4af37]/60 focus:border-[#d4af37] focus-visible:ring-2 focus-visible:ring-[#d4af37] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-5 text-left" />

                  {/* Overlay Text Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-left">
                    <span className="text-[10px] tracking-widest uppercase text-[#d4af37] font-semibold block mb-1">
                      {photo.category.toUpperCase()}
                    </span>
                    <h4 className="font-display text-sm font-bold text-[#fbf7ee] leading-tight">
                      {photo.title}
                    </h4>
                    <p className="text-[11px] text-[#b0b5c7] mt-1 line-clamp-2">
                      {photo.subtitle}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#f4e8d1] font-medium">
                      <Maximize2 className="w-3 h-3 text-[#d4af37]" />
                      <span>Expand High-Res View</span>
                    </div>
                  </div>

                  {/* Subtle corner badge for quick identification */}
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/70 group-hover:text-[#d4af37] border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
