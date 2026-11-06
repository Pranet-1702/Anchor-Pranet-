import React, { useState } from 'react';
import { Plus, Mic, Trash2, Edit2, Check, X, Users, Star } from 'lucide-react';
import { AdminService } from '../../../types/admin';
import { saveService, deleteService } from '../../../lib/firebase';

interface ServicesModuleProps {
  services: AdminService[];
  onRefresh: () => Promise<void>;
}

export const ServicesModule: React.FC<ServicesModuleProps> = ({ services, onRefresh }) => {
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState('');

  const handleOpenAddModal = () => {
    setEditingService({
      id: `srv-${Date.now()}`,
      title: '',
      tagline: 'High-Impact Stage Presence',
      description: '',
      keyDeliverables: [],
      formats: ['Keynote Hosting', 'Live Stage Announcements', 'Audience Interactions'],
      recommendedAudience: 'Colleges, Corporate & Large Public Gatherings',
      is_featured: true,
      sort_order: services.length,
    });
    setNewDeliverable('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, _title?: string) => {
    await deleteService(id);
    await onRefresh();
  };

  const handleAddDeliverable = () => {
    if (!newDeliverable.trim() || !editingService) return;
    setEditingService({
      ...editingService,
      keyDeliverables: [...editingService.keyDeliverables, newDeliverable.trim()],
    });
    setNewDeliverable('');
  };

  const handleRemoveDeliverable = (index: number) => {
    if (!editingService) return;
    const next = [...editingService.keyDeliverables];
    next.splice(index, 1);
    setEditingService({ ...editingService, keyDeliverables: next });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);
    await saveService(editingService);
    setIsSaving(false);
    setIsModalOpen(false);
    setEditingService(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Anchoring &amp; Emcee Services
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Manage your professional hosting offerings, deliverables, audience formats, and event packages ({services.length} services)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-2xl bg-[#0d0d12] border border-white/10 p-6 flex flex-col justify-between transition-all hover:border-[#d4af37]/40"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <Mic className="w-5 h-5" />
                </div>
                {srv.is_featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-white">{srv.title}</h3>
              <p className="text-xs text-[#d4af37] font-semibold mt-0.5">{srv.tagline}</p>
              <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">{srv.description}</p>

              {srv.keyDeliverables && srv.keyDeliverables.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                    Key Deliverables
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {srv.keyDeliverables.map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-zinc-300 border border-white/5"
                      >
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {srv.recommendedAudience && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Target: {srv.recommendedAudience}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingService(srv);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Service</span>
              </button>

              <button
                onClick={() => handleDelete(srv.id, srv.title)}
                className="p-1 text-zinc-500 hover:text-red-400 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0d0d12] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold text-white">
                {services.some((s) => s.id === editingService.id)
                  ? 'Edit Service Package'
                  : 'Add New Service'}
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
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g. Cultural &amp; College Festivals"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingService.tagline}
                  onChange={(e) =>
                    setEditingService({ ...editingService, tagline: e.target.value })
                  }
                  placeholder="e.g. High-Voltage Stadium &amp; Auditorium Engagement"
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
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="Describe your approach, stage execution, and delivery..."
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Recommended Audience
                </label>
                <input
                  type="text"
                  value={editingService.recommendedAudience}
                  onChange={(e) =>
                    setEditingService({ ...editingService, recommendedAudience: e.target.value })
                  }
                  placeholder="e.g. 500–5,000+ Students, Alumni, Faculty &amp; Dignitaries"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Deliverables tags */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Key Deliverables
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="e.g. Ceremony Script Preparation, VIP Felicitations"
                    className="flex-1 bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 rounded-xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold hover:bg-[#d4af37]/30 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editingService.keyDeliverables?.map((d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/10 text-xs"
                    >
                      <span>{d}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(i)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editingService.is_featured}
                    onChange={(e) =>
                      setEditingService({ ...editingService, is_featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                  <span>Featured Service Package</span>
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
                  <span>{isSaving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
