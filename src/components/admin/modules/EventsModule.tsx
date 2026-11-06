import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Calendar as CalendarIcon,
  Upload,
  X,
  Check,
  Building,
} from 'lucide-react';
import { AdminEvent } from '../../../types/admin';
import { saveEvent, deleteEvent, uploadMediaFile } from '../../../lib/firebase';

interface EventsModuleProps {
  events: AdminEvent[];
  onRefresh: () => Promise<void>;
}

export const EventsModule: React.FC<EventsModuleProps> = ({ events, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'technical', label: 'Technical' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'seminars', label: 'Seminars' },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || evt.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingEvent({
      id: `evt-${Date.now()}`,
      title: '',
      category: 'cultural',
      categoryLabel: 'Cultural Gala',
      organizer: '',
      location: 'Pune, Maharashtra',
      date: new Date().getFullYear().toString(),
      description: '',
      image: '/assets/aistudio/6_480be6e9.jpeg',
      imageAlt: '',
      highlights: [],
      is_published: true,
      is_featured: false,
      sort_order: events.length,
    });
    setNewHighlight('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: AdminEvent) => {
    setEditingEvent({ ...evt, highlights: evt.highlights || [] });
    setNewHighlight('');
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (evt: AdminEvent) => {
    const updated = { ...evt, is_published: !evt.is_published };
    await saveEvent(updated);
    await onRefresh();
  };

  const handleDelete = async (id: string, _title?: string) => {
    await deleteEvent(id);
    await onRefresh();
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim() || !editingEvent) return;
    setEditingEvent({
      ...editingEvent,
      highlights: [...editingEvent.highlights, newHighlight.trim()],
    });
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    if (!editingEvent) return;
    const next = [...editingEvent.highlights];
    next.splice(index, 1);
    setEditingEvent({ ...editingEvent, highlights: next });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;
    setUploadingImage(true);
    const { url, error } = await uploadMediaFile(file, 'events');
    setUploadingImage(false);
    if (url) {
      setEditingEvent({ ...editingEvent, image: url });
    } else {
      alert(`Upload failed: ${error || 'Unknown error'}`);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsSaving(true);
    await saveEvent(editingEvent);
    setIsSaving(false);
    setIsModalOpen(false);
    setEditingEvent(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Events &amp; Stage Experience
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Manage your past and upcoming stage engagements, hackathons, and institutional summits ({events.length} total)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by title, organizer, or venue..."
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

      {/* Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d12] border border-white/10 text-zinc-400 text-sm">
          No events found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`rounded-2xl bg-[#0d0d12] border overflow-hidden flex flex-col transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
                evt.is_published ? 'border-white/10' : 'border-dashed border-zinc-700 opacity-70'
              }`}
            >
              {/* Image Preview & Badges */}
              <div className="relative h-44 bg-zinc-900 overflow-hidden group">
                <img
                  src={evt.image || '/assets/aistudio/6_480be6e9.jpeg'}
                  alt={evt.imageAlt || evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/6_480be6e9.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-black/30" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30">
                    {evt.categoryLabel || evt.category}
                  </span>
                  {evt.is_featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleTogglePublish(evt)}
                    title={evt.is_published ? 'Published (Click to unpublish)' : 'Draft (Click to publish)'}
                    className={`p-1.5 rounded-lg text-xs backdrop-blur-md transition cursor-pointer ${
                      evt.is_published
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-zinc-800/80 text-zinc-400 border border-zinc-600 hover:bg-zinc-700'
                    }`}
                  >
                    {evt.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300">
                  <div className="flex items-center gap-1 font-medium">
                    <CalendarIcon className="w-3 h-3 text-[#d4af37]" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 shrink-0 text-[#d4af37]" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-white line-clamp-1">
                    {evt.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-medium mt-1">
                    <Building className="w-3 h-3 shrink-0" />
                    <span className="truncate">{evt.organizer}</span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Highlights tag list */}
                  {evt.highlights && evt.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {evt.highlights.slice(0, 2).map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-300 border border-white/5 truncate max-w-[200px]"
                        >
                          • {h}
                        </span>
                      ))}
                      {evt.highlights.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-zinc-500 font-semibold">
                          +{evt.highlights.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditModal(evt)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-[#d4af37] transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Event</span>
                  </button>

                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                    title="Delete event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0d12] border border-[#d4af37]/30 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-serif text-lg font-bold text-white">
                {events.some((e) => e.id === editingEvent.id) ? 'Edit Event Details' : 'Add New Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="e.g. Umang Annual Social Gathering 2025"
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Organizer / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.organizer}
                    onChange={(e) => setEditingEvent({ ...editingEvent, organizer: e.target.value })}
                    placeholder="e.g. Sanjay Ghodawat Institute"
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        category: e.target.value as AdminEvent['category'],
                      })
                    }
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="hackathons">Hackathons</option>
                    <option value="technical">Technical</option>
                    <option value="alumni">Alumni</option>
                    <option value="seminars">Seminars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Category Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingEvent.categoryLabel || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, categoryLabel: e.target.value })}
                    placeholder="e.g. Cultural Gala"
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Date / Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="e.g. 2025 or April 18th & 19th"
                    className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Event Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Summarize your anchoring role, stage interactions, and audience impact..."
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Image selection / upload */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Event Cover Photo
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={editingEvent.image}
                    onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                    placeholder="/assets/aistudio/... or https://..."
                    className="flex-1 bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-medium cursor-pointer transition shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
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

              {/* Highlights tags */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Key Stage Highlights
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="e.g. Awarded Best Anchor, Addressed 3000+ audience"
                    className="flex-1 bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 rounded-xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold hover:bg-[#d4af37]/30 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editingEvent.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/10 text-xs"
                    >
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editingEvent.is_published}
                    onChange={(e) => setEditingEvent({ ...editingEvent, is_published: e.target.checked })}
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                  <span>Published on Live Portfolio</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-medium">
                  <input
                    type="checkbox"
                    checked={editingEvent.is_featured}
                    onChange={(e) => setEditingEvent({ ...editingEvent, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                  <span>Feature on Hero Showcase</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] to-[#e4c466] hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
