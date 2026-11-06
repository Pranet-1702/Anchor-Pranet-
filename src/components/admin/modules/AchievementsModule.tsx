import React, { useState } from 'react';
import { Plus, Award, Trash2, Edit2, Check, X, Upload, Calendar, Building } from 'lucide-react';
import { AdminAchievement } from '../../../types/admin';
import { saveAchievement, deleteAchievement, uploadMediaFile } from '../../../lib/firebase';

interface AchievementsModuleProps {
  achievements: AdminAchievement[];
  onRefresh: () => Promise<void>;
}

export const AchievementsModule: React.FC<AchievementsModuleProps> = ({
  achievements,
  onRefresh,
}) => {
  const [editingAchievement, setEditingAchievement] = useState<AdminAchievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOpenAddModal = () => {
    setEditingAchievement({
      id: `ach-${Date.now()}`,
      title: '',
      subtitle: 'Institutional Honor',
      organization: '',
      year: new Date().getFullYear().toString(),
      description: '',
      image: '/assets/aistudio/6_480be6e9.jpeg',
      imageAlt: '',
      verifiedBadge: 'Verified Institutional Honor',
      sort_order: achievements.length,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, _title?: string) => {
    await deleteAchievement(id);
    await onRefresh();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAchievement) return;
    setUploadingImage(true);
    const { url, error } = await uploadMediaFile(file, 'certificates');
    setUploadingImage(false);
    if (url) {
      setEditingAchievement({ ...editingAchievement, image: url });
    } else {
      alert(`Upload failed: ${error || 'Unknown error'}`);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement) return;
    setIsSaving(true);
    await saveAchievement(editingAchievement);
    setIsSaving(false);
    setIsModalOpen(false);
    setEditingAchievement(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Achievements &amp; Honors
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Manage your official recognitions, awards, and verified institutional certificates ({achievements.length} total)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="rounded-2xl bg-[#0d0d12] border border-white/10 p-5 flex flex-col sm:flex-row gap-4 justify-between transition-all hover:border-[#d4af37]/40"
          >
            {ach.image && (
              <div className="w-full sm:w-28 h-28 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                <img
                  src={ach.image}
                  alt={ach.imageAlt || ach.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/6_480be6e9.jpeg';
                  }}
                />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                    {ach.verifiedBadge || 'Verified Honor'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Calendar className="w-3 h-3 text-[#d4af37]" />
                    <span>{ach.year}</span>
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold text-white mt-1">{ach.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                  <Building className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{ach.organization}</span>
                </div>

                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setEditingAchievement(ach);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Award</span>
                </button>

                <button
                  onClick={() => handleDelete(ach.id, ach.title)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0d0d12] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold text-white">
                {achievements.some((a) => a.id === editingAchievement.id)
                  ? 'Edit Achievement'
                  : 'Add New Achievement'}
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
                  Award / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingAchievement.title}
                  onChange={(e) =>
                    setEditingAchievement({ ...editingAchievement, title: e.target.value })
                  }
                  placeholder="e.g. Best Anchor Award (2024–2025)"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Organization / Body *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.organization}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, organization: e.target.value })
                    }
                    placeholder="e.g. Sanjay Ghodawat Institute"
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Year / Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.year}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, year: e.target.value })
                    }
                    placeholder="e.g. 2024–2025"
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Verified Badge Text
                </label>
                <input
                  type="text"
                  value={editingAchievement.verifiedBadge || ''}
                  onChange={(e) =>
                    setEditingAchievement({ ...editingAchievement, verifiedBadge: e.target.value })
                  }
                  placeholder="e.g. Official Institutional Recognition"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingAchievement.description}
                  onChange={(e) =>
                    setEditingAchievement({ ...editingAchievement, description: e.target.value })
                  }
                  placeholder="Describe the context, citation, and stage significance..."
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Certificate / Award Photo
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingAchievement.image || ''}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, image: e.target.value })
                    }
                    placeholder="/assets/aistudio/... or https://..."
                    className="flex-1 bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-medium cursor-pointer transition shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  <span>{isSaving ? 'Saving...' : 'Save Achievement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
