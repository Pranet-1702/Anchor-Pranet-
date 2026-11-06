import React, { useState } from 'react';
import { Check, User, Sparkles, Plus, Trash2 } from 'lucide-react';
import { AdminPersonalInfo } from '../../../types/admin';
import { savePersonalInfo } from '../../../lib/firebase';

interface AboutModuleProps {
  personalInfo: AdminPersonalInfo;
  onRefresh: () => Promise<void>;
}

export const AboutModule: React.FC<AboutModuleProps> = ({ personalInfo, onRefresh }) => {
  const [info, setInfo] = useState<AdminPersonalInfo>(personalInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRoleChange = (index: number, field: 'role' | 'institution' | 'focus', value: string) => {
    const roles = [...info.roles];
    roles[index] = { ...roles[index], [field]: value };
    setInfo({ ...info, roles });
  };

  const handleAddRole = () => {
    setInfo({
      ...info,
      roles: [
        ...info.roles,
        {
          role: 'Stage Coordinator',
          institution: 'Institutional Summit',
          focus: 'Coordinated stage protocol and dignitary scheduling.',
        },
      ],
    });
  };

  const handleRemoveRole = (index: number) => {
    const roles = [...info.roles];
    roles.splice(index, 1);
    setInfo({ ...info, roles });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    const ok = await savePersonalInfo(info);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await onRefresh();
    } else {
      alert('Failed to save changes to Firebase.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            About Me &amp; Stage Persona
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Configure headline credentials, personal biography, metric counters, and institutional roles
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Profile changes saved and updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Identity */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Brand Identity &amp; Title</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={info.title}
                onChange={(e) => setInfo({ ...info, title: e.target.value })}
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Hero Tagline
            </label>
            <input
              type="text"
              value={info.tagline}
              onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Lead Stage Biography
            </label>
            <textarea
              rows={4}
              value={info.leadBio}
              onChange={(e) => setInfo({ ...info, leadBio: e.target.value })}
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Dynamic Metric Counters */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
            Metric Counters &amp; Languages
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Years of Experience
              </label>
              <input
                type="text"
                value={info.yearsExperience}
                onChange={(e) => setInfo({ ...info, yearsExperience: e.target.value })}
                placeholder="4+"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Events Hosted Counter
              </label>
              <input
                type="text"
                value={info.eventsHosted}
                onChange={(e) => setInfo({ ...info, eventsHosted: e.target.value })}
                placeholder="16+"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={info.languages?.join(', ')}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    languages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="English, Hindi, Marathi"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Institutional & Stage Roles */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Institutional Roles &amp; Leadership
            </h3>
            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-4">
            {info.roles?.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#14141c] border border-white/5 space-y-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveRole(i)}
                  className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                  title="Remove role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={r.role}
                      onChange={(e) => handleRoleChange(i, 'role', e.target.value)}
                      className="w-full bg-[#0d0d12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                      Institution / Organization
                    </label>
                    <input
                      type="text"
                      value={r.institution}
                      onChange={(e) => handleRoleChange(i, 'institution', e.target.value)}
                      className="w-full bg-[#0d0d12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                    Key Focus &amp; Responsibilities
                  </label>
                  <textarea
                    rows={2}
                    value={r.focus}
                    onChange={(e) => handleRoleChange(i, 'focus', e.target.value)}
                    className="w-full bg-[#0d0d12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
