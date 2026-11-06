import React, { useState } from 'react';
import {
  Settings,
  Check,
  Database,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AdminSiteSettings } from '../../../types/admin';
import {
  saveSiteSettings,
  seedInitialFirebaseData,
  testFirebaseConnection,
  isFirebaseConfigured,
} from '../../../lib/firebase';
import firebaseConfig from '../../../../firebase-applet-config.json';
import { GOOGLE_FORM_BOOKING_URL } from '../../../config/googleBookingConfig';

interface SettingsModuleProps {
  settings: AdminSiteSettings;
  isFirebaseConnected?: boolean;
  onRefresh: () => Promise<void>;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<AdminSiteSettings>({
    googleFormBookingUrl: settings.googleFormBookingUrl || GOOGLE_FORM_BOOKING_URL,
    whatsAppBookingNumber: settings.whatsAppBookingNumber || '917391035544',
    announcementBanner: settings.announcementBanner || {
      enabled: false,
      text: 'Available for College Festivals, Corporate Events & National Hackathons Across India',
      link: '',
    },
    seoTitle: settings.seoTitle || 'Pranet Bhosale | Professional Anchor & Emcee',
    seoDescription:
      settings.seoDescription ||
      'Official personal brand and portfolio of Pranet Bhosale — award-winning professional anchor and emcee for cultural festivals, corporate events, hackathons, and institutional summits.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    tested: boolean;
    connected: boolean;
    error?: string;
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    const ok = await saveSiteSettings(formData);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await onRefresh();
    } else {
      alert('Failed to save settings.');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    const result = await testFirebaseConnection();
    setConnectionResult({
      tested: true,
      connected: result.connected,
      error: result.error,
    });
    setTestingConnection(false);
  };

  const handleResyncInitialData = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const res = await seedInitialFirebaseData();
    setIsSyncing(false);
    setSyncStatus(res.message);
    if (res.success) {
      await onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Website Configuration &amp; Firebase
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Configure central booking URLs, announcement banners, and inspect Firebase services
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Website configuration updated successfully!</span>
        </div>
      )}

      {/* Booking URLs & Call-to-Action Settings */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Central Booking Integration</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Google Form Booking URL
            </label>
            <input
              type="url"
              required
              value={formData.googleFormBookingUrl}
              onChange={(e) =>
                setFormData({ ...formData, googleFormBookingUrl: e.target.value })
              }
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Every "Book Now", "Hire Me", and "Book an Event" button throughout the site opens this form.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              WhatsApp Booking Number (Country Code + Phone)
            </label>
            <input
              type="text"
              required
              value={formData.whatsAppBookingNumber}
              onChange={(e) =>
                setFormData({ ...formData, whatsAppBookingNumber: e.target.value })
              }
              placeholder="917391035544"
              className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Announcement Bar on Top of Portfolio
            </h3>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
              <input
                type="checkbox"
                checked={formData.announcementBanner?.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBanner: {
                      enabled: e.target.checked,
                      text: formData.announcementBanner?.text || '',
                      link: formData.announcementBanner?.link || '',
                    },
                  })
                }
                className="w-4 h-4 accent-[#d4af37] rounded"
              />
              <span>Enable Banner</span>
            </label>
          </div>

          {formData.announcementBanner?.enabled && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Banner Text
                </label>
                <input
                  type="text"
                  value={formData.announcementBanner?.text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBanner: {
                        ...formData.announcementBanner!,
                        text: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Now taking bookings for 2026 National College Festivals & Summits"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Optional Click Link
                </label>
                <input
                  type="text"
                  value={formData.announcementBanner?.link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBanner: {
                        ...formData.announcementBanner!,
                        link: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. #contact or https://..."
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Firebase Database & Services Section */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Firebase Firestore &amp; Storage Setup
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Target Project:{' '}
                <code className="text-[#d4af37] font-mono">{firebaseConfig.projectId}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handleResyncInitialData}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/30 transition cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Data to Firestore'}</span>
            </button>
          </div>
        </div>

        {connectionResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              connectionResult.connected
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border border-red-500/40 text-red-200'
            }`}
          >
            {connectionResult.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <div>
              {connectionResult.connected
                ? 'Firebase Firestore connection is active and responding!'
                : `Firebase connection test notice: ${connectionResult.error}`}
            </div>
          </div>
        )}

        {syncStatus && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            {syncStatus}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-[#14141c] border border-white/5 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Active Firebase Configuration:</span>
            </div>
            <ul className="space-y-1 text-zinc-400 font-mono text-[11px]">
              <li>Project ID: <span className="text-white">{firebaseConfig.projectId}</span></li>
              <li>Firestore DB: <span className="text-white">{firebaseConfig.firestoreDatabaseId}</span></li>
              <li>Storage Bucket: <span className="text-white">{firebaseConfig.storageBucket}</span></li>
              <li>Auth Domain: <span className="text-white">{firebaseConfig.authDomain}</span></li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#14141c] border border-white/5 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-[#d4af37]" />
              <span>Security &amp; Permissions:</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Admin permissions are strictly enforced for{' '}
              <strong className="text-[#d4af37]">pranetbhosale@gmail.com</strong> across both
              Firebase Authentication and Cloud Firestore Security Rules. Public visitors have read-only access to published content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
