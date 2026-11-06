import React, { useState } from 'react';
import { useAdminAuth, ADMIN_EMAIL } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, Sparkles, LogIn } from 'lucide-react';

interface AdminLoginProps {
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { login, loginWithGoogle, error, clearError, isFirebaseConnected } = useAdminAuth();
  const [email, setEmail] = useState<string>(ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState<boolean>(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalMessage(null);
    clearError();

    if (!password) {
      setLocalMessage('Please enter your administrator password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success && result.error) {
      setLocalMessage(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalMessage(null);
    clearError();
    setIsGoogleSubmitting(true);
    const result = await loginWithGoogle();
    setIsGoogleSubmitting(false);
    if (!result.success && result.error) {
      setLocalMessage(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#fbf7ee] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top return link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#d4af37] transition mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Return to Public Portfolio</span>
        </button>

        {/* Card */}
        <div className="bg-[#0d0d12]/90 backdrop-blur-xl border border-[#d4af37]/25 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          {/* Subtle gold accent corner bar */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/40 text-[#d4af37] mb-4 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fbf7ee] via-[#d4af37] to-[#e4c466]">
              Anchorr Pranet CMS
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#d4af37]/80 mt-1 font-semibold">
              Executive Administrative Suite
            </p>
          </div>

          {/* Whitelist Notice */}
          <div className="mb-6 p-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="text-[12px] text-zinc-300 leading-relaxed">
              Access is protected and reserved exclusively for authorized administrator{' '}
              <strong className="text-[#d4af37]">{ADMIN_EMAIL}</strong>. Public registration is permanently disabled.
            </div>
          </div>

          {/* Error Message */}
          {(localMessage || error) && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{localMessage || error}</div>
            </div>
          )}

          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full mb-6 py-3 px-4 rounded-xl font-medium text-xs text-[#fbf7ee] bg-white/5 border border-white/10 hover:border-[#d4af37]/50 hover:bg-white/10 active:scale-[0.99] transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleSubmitting ? 'Authenticating with Google...' : 'Sign In with Google Account'}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d0d12] px-2 text-zinc-500 font-mono text-[10px]">Or sign in with password</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#d4af37]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@anchorrpranet.com"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fbf7ee] placeholder-zinc-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#d4af37]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password"
                  className="w-full bg-[#14141c] border border-white/10 focus:border-[#d4af37] rounded-xl pl-10 pr-11 py-2.5 text-sm text-[#fbf7ee] placeholder-zinc-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#d4af37] transition p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] hover:brightness-110 active:scale-[0.99] transition shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Password'}</span>
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-[11px] text-zinc-500">
            Protected with Firebase Authentication &amp; Cloud Firestore Security Rules
          </div>
        </div>
      </div>
    </div>
  );
};
