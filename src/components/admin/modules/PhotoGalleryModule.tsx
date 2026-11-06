import React, { useState } from 'react';
import {
  UploadCloud,
  Search,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AdminGalleryImage } from '../../../types/admin';
import { saveGalleryImage, deleteGalleryImage, uploadMediaFile } from '../../../lib/firebase';

interface PhotoGalleryModuleProps {
  photos: AdminGalleryImage[];
  onRefresh: () => Promise<void>;
}

export const PhotoGalleryModule: React.FC<PhotoGalleryModuleProps> = ({ photos, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<AdminGalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'stage', label: 'Stage Anchoring' },
    { id: 'felicitation', label: 'Felicitations & Awards' },
    { id: 'hackathon', label: 'Hackathons & Technical' },
    { id: 'formal', label: 'Formal & Dignitaries' },
  ];

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
      const { url } = await uploadMediaFile(file, 'gallery');

      if (url) {
        const titleFromFileName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const newPhoto: AdminGalleryImage = {
          id: `img-${Date.now()}-${i}`,
          src: url,
          alt: titleFromFileName,
          title: titleFromFileName,
          subtitle: 'Anchorr Pranet Stage Capture',
          category: 'stage',
          aspectRatio: 'square',
          is_published: true,
          sort_order: photos.length + i,
        };
        await saveGalleryImage(newPhoto);
        successCount++;
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    e.target.value = '';
    alert(`Successfully uploaded ${successCount} photo(s) to your gallery!`);
    await onRefresh();
  };

  const handleTogglePublish = async (photo: AdminGalleryImage) => {
    const updated = { ...photo, is_published: !photo.is_published };
    await saveGalleryImage(updated);
    await onRefresh();
  };

  const handleDelete = async (id: string, _title?: string) => {
    await deleteGalleryImage(id);
    await onRefresh();
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    await saveGalleryImage(editingPhoto);
    setIsModalOpen(false);
    setEditingPhoto(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Photo Gallery Management
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Upload multiple photos directly to Firebase Storage, adjust captions, and configure masonry layout ({photos.length} total)
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer shrink-0">
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={isUploading}
            onChange={handleMultipleFilesUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploading Status Banner */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center gap-3 text-xs text-[#d4af37] font-semibold animate-pulse">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{uploadProgress || 'Uploading images to storage...'}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search photos by title or caption..."
            className="w-full bg-[#0d0d12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] transition"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#d4af37] text-[#0a0a0c]'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d12] border border-white/10 text-zinc-400 text-sm">
          No photos found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`group rounded-xl bg-[#0d0d12] border overflow-hidden flex flex-col justify-between transition-all hover:border-[#d4af37]/40 ${
                photo.is_published ? 'border-white/10' : 'border-dashed border-zinc-700 opacity-60'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt || photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/6_480be6e9.jpeg';
                  }}
                />

                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30">
                    {photo.category}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleTogglePublish(photo)}
                    title={photo.is_published ? 'Published' : 'Hidden'}
                    className={`p-1 rounded-md text-[10px] backdrop-blur-md transition cursor-pointer ${
                      photo.is_published
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {photo.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Photo Meta */}
              <div className="p-3">
                <h4 className="text-xs font-bold text-white line-clamp-1">{photo.title}</h4>
                <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{photo.subtitle}</p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingPhoto(photo);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-[#d4af37] transition cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(photo.id, photo.title)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                    title="Delete image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Photo Modal */}
      {isModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0d0d12] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold text-white">Edit Photo Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Subtitle / Context
                </label>
                <input
                  type="text"
                  value={editingPhoto.subtitle}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, subtitle: e.target.value })}
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingPhoto.category}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        category: e.target.value as AdminGalleryImage['category'],
                      })
                    }
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="stage">Stage Anchoring</option>
                    <option value="felicitation">Felicitations</option>
                    <option value="hackathon">Hackathons</option>
                    <option value="formal">Formal &amp; VIPs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={editingPhoto.aspectRatio}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        aspectRatio: e.target.value as AdminGalleryImage['aspectRatio'],
                      })
                    }
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="square">Square (1:1)</option>
                    <option value="tall">Tall / Portrait (3:4)</option>
                    <option value="wide">Wide / Landscape (16:9)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editingPhoto.is_published}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, is_published: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                  <span>Published on Live Gallery</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] to-[#e4c466] hover:brightness-110 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
