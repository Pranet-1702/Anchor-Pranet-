import React, { useState } from 'react';
import { Check, Phone, Mail, Instagram, Linkedin, MessageSquare, MapPin, Sparkles } from 'lucide-react';
import { AdminPersonalInfo } from '../../../types/admin';
import { savePersonalInfo } from '../../../lib/firebase';

interface ContactModuleProps {
  personalInfo: AdminPersonalInfo;
  onRefresh: () => Promise<void>;
}

export const ContactModule: React.FC<ContactModuleProps> = ({ personalInfo, onRefresh }) => {
  const [contact, setContact] = useState(personalInfo.contact);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    const updated = {
      ...personalInfo,
      contact,
    };
    const ok = await savePersonalInfo(updated);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await onRefresh();
    } else {
      alert('Failed to save contact info.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Contact &amp; Social Channels
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Manage your direct telephone, WhatsApp, email, and social media presence displayed across the portfolio
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Contact Info'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Contact channels updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Phone & WhatsApp */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Telephony &amp; WhatsApp</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Formatted Phone (Display)
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="+91 7391035544"
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Raw Phone (for tel: dialing link)
            </label>
            <input
              type="text"
              value={contact.rawPhone}
              onChange={(e) => setContact({ ...contact, rawPhone: e.target.value })}
              placeholder="7391035544"
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Direct WhatsApp URL
            </label>
            <input
              type="text"
              value={contact.whatsappUrl}
              onChange={(e) => setContact({ ...contact, whatsappUrl: e.target.value })}
              placeholder="https://wa.me/917391035544"
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Email & Location */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Email &amp; Location</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Primary Business Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="pranetbhosale@gmail.com"
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Operating Location &amp; Travel Radius
            </label>
            <input
              type="text"
              value={contact.location}
              onChange={(e) => setContact({ ...contact, location: e.target.value })}
              placeholder="Pune & Maharashtra, India (Available Nationwide)"
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Social Profiles */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            <span>Social Media Presence</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={contact.instagram}
                onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                placeholder="@anchorrpranet"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Instagram Full URL
              </label>
              <input
                type="url"
                value={contact.instagramUrl}
                onChange={(e) => setContact({ ...contact, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/anchorrpranet"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                LinkedIn Handle
              </label>
              <input
                type="text"
                value={contact.linkedin}
                onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                placeholder="linkedin.com/in/pranet-bhosale"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                LinkedIn Full URL
              </label>
              <input
                type="url"
                value={contact.linkedinUrl}
                onChange={(e) => setContact({ ...contact, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/pranet-bhosale"
                className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
