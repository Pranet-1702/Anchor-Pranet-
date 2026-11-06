import React, { useState } from 'react';
import { Plus, Video, Trash2, Edit2, Eye, EyeOff, Check, X, ExternalLink, Play } from 'lucide-react';
import { AdminGalleryVideo } from '../../../types/admin';
import { saveGalleryVideo, deleteGalleryVideo } from '../../../lib/firebase';

interface VideoGalleryModuleProps {
  videos: AdminGalleryVideo[];
  onRefresh: () => Promise<void>;
}

export const VideoGalleryModule: React.FC<VideoGalleryModuleProps> = ({ videos, onRefresh }) => {
  const [editingVideo, setEditingVideo] = useState<AdminGalleryVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch')) {
        const id = new URL(url).searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleOpenAddModal = () => {
    setEditingVideo({
      id: `vid-${Date.now()}`,
      title: '',
      video_url: '',
      thumbnail_url: '',
      category: 'Stage Anchoring',
      description: '',
      is_published: true,
      sort_order: videos.length,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (video: AdminGalleryVideo) => {
    const updated = { ...video, is_published: !video.is_published };
    await saveGalleryVideo(updated);
    await onRefresh();
  };

  const handleDelete = async (id: string, _title?: string) => {
    await deleteGalleryVideo(id);
    await onRefresh();
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    setIsSaving(true);
    await saveGalleryVideo(editingVideo);
    setIsSaving(false);
    setIsModalOpen(false);
    setEditingVideo(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Video Gallery &amp; Showreels
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Embed stage performance recordings, anchor showreels, and crowd interaction reels ({videos.length} videos)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Video</span>
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d12] border border-white/10 text-zinc-400 text-sm space-y-3">
          <Video className="w-8 h-8 text-[#d4af37]/50 mx-auto" />
          <p>No video showreels added yet.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition cursor-pointer"
          >
            Add Your First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((vid) => {
            const embed = getEmbedUrl(vid.video_url);
            return (
              <div
                key={vid.id}
                className={`rounded-2xl bg-[#0d0d12] border overflow-hidden flex flex-col justify-between transition-all ${
                  vid.is_published ? 'border-white/10' : 'border-dashed border-zinc-700 opacity-60'
                }`}
              >
                {/* Embed or Preview */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {embed.includes('youtube.com/embed') ? (
                    <iframe
                      src={embed}
                      title={vid.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Play className="w-10 h-10 text-[#d4af37] mx-auto mb-2 opacity-80" />
                      <a
                        href={vid.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#d4af37] hover:underline flex items-center justify-center gap-1"
                      >
                        <span>Open Video Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleTogglePublish(vid)}
                      className={`p-1 rounded-md text-[10px] backdrop-blur-md transition cursor-pointer ${
                        vid.is_published
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {vid.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                    {vid.category}
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 mt-1">{vid.title}</h3>
                  {vid.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{vid.description}</p>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingVideo(vid);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Video</span>
                    </button>

                    <button
                      onClick={() => handleDelete(vid.id, vid.title)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0d0d12] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold text-white">
                {videos.some((v) => v.id === editingVideo.id) ? 'Edit Video Showreel' : 'Add New Video'}
              </h3>
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
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="e.g. Umang 2025 Grand Finale Emcee Showreel"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Video URL (YouTube / Vimeo) *
                </label>
                <input
                  type="url"
                  required
                  value={editingVideo.video_url}
                  onChange={(e) => setEditingVideo({ ...editingVideo, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingVideo.category}
                  onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                  placeholder="e.g. Stage Anchoring, Hackathon Hosting"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  placeholder="Brief note about the stage moments in this clip..."
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editingVideo.is_published}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, is_published: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                  <span>Published on Live Portfolio</span>
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
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] to-[#e4c466] hover:brightness-110 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
