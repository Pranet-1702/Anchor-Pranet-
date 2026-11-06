import React, { useState } from 'react';
import {
  Calendar,
  Image as ImageIcon,
  Video,
  Award,
  MessageSquare,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { AdminNavTab } from '../../../types/admin';
import { seedInitialFirebaseData } from '../../../lib/firebase';

interface DashboardModuleProps {
  onNavigateTab: (tab: AdminNavTab) => void;
  stats: {
    eventsCount: number;
    photosCount: number;
    videosCount: number;
    achievementsCount: number;
    testimonialsPending: number;
    testimonialsApproved: number;
    inquiriesNew: number;
  };
  isFirebaseConnected?: boolean;
  onRefreshData: () => Promise<void>;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigateTab,
  stats,
  isFirebaseConnected,
  onRefreshData,
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const res = await seedInitialFirebaseData();
    setSeedResult(res);
    setSeeding(false);
    if (res.success) {
      await onRefreshData();
    }
  };

  const metricCards = [
    {
      title: 'Events & Experiences',
      count: stats.eventsCount,
      tab: 'events' as AdminNavTab,
      icon: Calendar,
      color: 'from-amber-500/20 to-transparent',
      borderColor: 'border-amber-500/30',
      actionText: 'Manage Events',
    },
    {
      title: 'Photo Gallery',
      count: stats.photosCount,
      tab: 'gallery' as AdminNavTab,
      icon: ImageIcon,
      color: 'from-[#d4af37]/20 to-transparent',
      borderColor: 'border-[#d4af37]/30',
      actionText: 'Upload Photos',
    },
    {
      title: 'Video Gallery',
      count: stats.videosCount,
      tab: 'videos' as AdminNavTab,
      icon: Video,
      color: 'from-yellow-500/20 to-transparent',
      borderColor: 'border-yellow-500/30',
      actionText: 'Embed Videos',
    },
    {
      title: 'Achievements',
      count: stats.achievementsCount,
      tab: 'achievements' as AdminNavTab,
      icon: Award,
      color: 'from-orange-500/20 to-transparent',
      borderColor: 'border-orange-500/30',
      actionText: 'Manage Awards',
    },
    {
      title: 'Pending Reviews',
      count: stats.testimonialsPending,
      subtext: `${stats.testimonialsApproved} approved live`,
      tab: 'testimonials' as AdminNavTab,
      icon: MessageSquare,
      color: stats.testimonialsPending > 0 ? 'from-rose-500/20 to-transparent' : 'from-emerald-500/20 to-transparent',
      borderColor: stats.testimonialsPending > 0 ? 'border-rose-500/40' : 'border-emerald-500/30',
      badge: stats.testimonialsPending > 0 ? `${stats.testimonialsPending} New` : undefined,
      actionText: 'Moderate Testimonials',
    },
    {
      title: 'New Inquiries',
      count: stats.inquiriesNew,
      tab: 'inquiries' as AdminNavTab,
      icon: Mail,
      color: stats.inquiriesNew > 0 ? 'from-amber-500/20 to-transparent' : 'from-blue-500/20 to-transparent',
      borderColor: stats.inquiriesNew > 0 ? 'border-amber-500/40' : 'border-blue-500/30',
      badge: stats.inquiriesNew > 0 ? `${stats.inquiriesNew} Unread` : undefined,
      actionText: 'View Messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-[#0d0d12] via-[#14141e] to-[#0d0d12] border border-[#d4af37]/25 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Firebase Master Administration Suite</span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-wide">
              Welcome back, <span className="text-[#d4af37]">Pranet</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              Manage your stage portfolio, upload high-resolution event photographs to Firebase Storage, moderate client testimonials in Cloud Firestore, and adjust website settings with real-time public synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#e4c466] hover:brightness-110 text-[#0a0a0c] transition disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              title="Uploads all current website events, photos, awards, and services into your Firebase database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Syncing to Firebase...' : 'Sync Website Data to Firebase'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/20 transition cursor-pointer"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Helpful Info Banner */}
        {!seedResult && (
          <div className="mt-5 p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">One-Click Cloud Sync:</strong>{' '}
                <span className="text-zinc-300">
                  Click the gold <strong className="text-[#d4af37]">&quot;Sync Website Data to Firebase&quot;</strong> button above whenever you want to copy all your existing portfolio events, photos, and achievements into Cloud Firestore.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Database Seed Notification */}
        {seedResult && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
              seedResult.success
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border border-red-500/40 text-red-200'
            }`}
          >
            {seedResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <div className="flex-1 font-medium">{seedResult.message}</div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-[#0d0d12] border ${card.borderColor} rounded-2xl p-6 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.color} rounded-bl-full pointer-events-none opacity-50`} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
                    <Icon className="w-5 h-5" />
                  </div>
                  {card.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {card.badge}
                    </span>
                  )}
                </div>

                <div className="text-3xl font-extrabold text-[#fbf7ee] tracking-tight">
                  {card.count}
                </div>
                <div className="text-sm font-semibold text-zinc-300 mt-1">
                  {card.title}
                </div>
                {card.subtext && (
                  <div className="text-xs text-zinc-500 mt-0.5">{card.subtext}</div>
                )}
              </div>

              <button
                onClick={() => onNavigateTab(card.tab)}
                className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#d4af37] hover:text-[#f3e5ab] transition cursor-pointer group"
              >
                <span>{card.actionText}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Action Bar */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4">
          Quick Administrative Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab('events')}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition">
              + New Event
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Add stage performance or hackathon
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('gallery')}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition">
              + Upload Media
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Upload photos to Firebase Storage
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('testimonials')}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition">
              Review Feedbacks
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Approve or reject client testimonials
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition">
              Website Config
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Booking URLs, banners &amp; Firebase settings
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
