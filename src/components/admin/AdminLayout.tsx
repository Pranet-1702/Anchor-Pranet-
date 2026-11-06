import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  Video,
  Award,
  MessageSquare,
  User,
  Mic,
  Phone,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminNavTab } from '../../types/admin';

interface AdminLayoutProps {
  currentTab: AdminNavTab;
  onSelectTab: (tab: AdminNavTab) => void;
  pendingReviewsCount: number;
  newInquiriesCount: number;
  onNavigateToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  pendingReviewsCount,
  newInquiriesCount,
  onNavigateToSite,
  children,
}) => {
  const { user, logout, isFirebaseConnected } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminNavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'events' as AdminNavTab, label: 'Events & Stage', icon: Calendar },
    { id: 'gallery' as AdminNavTab, label: 'Photo Gallery', icon: ImageIcon },
    { id: 'videos' as AdminNavTab, label: 'Video Showreels', icon: Video },
    { id: 'achievements' as AdminNavTab, label: 'Achievements', icon: Award },
    {
      id: 'testimonials' as AdminNavTab,
      label: 'Feedback & Reviews',
      icon: MessageSquare,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'about' as AdminNavTab, label: 'About & Persona', icon: User },
    { id: 'services' as AdminNavTab, label: 'Services', icon: Mic },
    { id: 'contact' as AdminNavTab, label: 'Contact & Socials', icon: Phone },
    {
      id: 'inquiries' as AdminNavTab,
      label: 'Booking Inquiries',
      icon: Mail,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined,
      badgeColor: 'bg-sky-500 text-white',
    },
    { id: 'settings' as AdminNavTab, label: 'Website Settings', icon: Settings },
  ];

  const handleTabClick = (tab: AdminNavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (err) {
      console.warn('Logout notice:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#fbf7ee] flex flex-col md:flex-row font-sans selection:bg-[#d4af37] selection:text-[#0a0a0c]">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d0d12] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide">Anchorr Pranet</div>
            <div className="text-[10px] text-[#d4af37] uppercase font-semibold">CMS Admin</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:text-white transition cursor-pointer"
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d12] border-r border-[#d4af37]/20 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-sm font-bold text-white tracking-wide">
                  Anchorr Pranet
                </h1>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                  Executive CMS
                </div>
              </div>
            </div>

            {/* Connection status badge */}
            <div className="mt-4 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-zinc-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                }`}
              />
              <span className="truncate">
                {isFirebaseConnected ? 'Firebase Live' : 'Local Fallback'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent text-[#d4af37] border-l-2 border-[#d4af37] font-bold shadow-[inset_0_1px_0_0_rgba(212,175,55,0.2)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-[#d4af37]' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        item.badgeColor || 'bg-[#d4af37] text-black'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with User and Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/5">
            <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0">
              P
            </div>
            <div className="truncate flex-1">
              <div className="text-[11px] font-bold text-white truncate">
                {user?.email || 'pranetbhosale@gmail.com'}
              </div>
              <div className="text-[9px] text-[#d4af37] font-semibold">Administrator</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0d0d12]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              CMS Module &rarr;
            </span>
            <span className="text-sm font-bold text-white capitalize">
              {navItems.find((n) => n.id === currentTab)?.label || currentTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToSite}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
            >
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 bg-rose-500/10 border border-rose-500/30 transition cursor-pointer disabled:opacity-50"
              title="Sign out of the admin panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}
    </div>
  );
};
