import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Code,
  Layers,
} from 'lucide-react';
import {
  GOOGLE_BOOKING_CONFIG,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  BOOKING_SHEET_HEADERS,
  FEEDBACK_SHEET_HEADERS,
} from '../config/googleBookingConfig';

interface GoogleSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const GoogleSetupModal: React.FC<GoogleSetupModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [endpointInput, setEndpointInput] = useState(
    GOOGLE_BOOKING_CONFIG.getEndpointUrl()
  );
  const [copiedScript, setCopiedScript] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    GOOGLE_BOOKING_CONFIG.setEndpointUrl(endpointInput);
    setSaveSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!endpointInput || !endpointInput.trim()) {
      setTestResult({ success: false, message: 'Please enter a Web App URL to test.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(endpointInput.trim(), {
        method: 'GET',
        redirect: 'follow',
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          setTestResult({
            success: true,
            message: 'Endpoint verified! Your Google Apps Script Web App is live and properly responding.',
          });
          return;
        }
      }
      setTestResult({
        success: false,
        message: 'Endpoint responded, but did not return valid JSON. Verify that "Who has access: Anyone" is selected in Apps Script.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setTestResult({
        success: false,
        message: `Connection failed (${msg}). Please verify "Execute as: Me" and "Who has access: Anyone".`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-setup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040406]/95 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-[#0d0d14] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(212,175,55,0.2)] text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close setup modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#fbf7ee] hover:text-[#d4af37] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37] mb-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets &amp; Apps Script Architecture</span>
            </div>
            <h3
              id="google-setup-title"
              className="font-display text-2xl font-bold text-[#fbf7ee] tracking-tight uppercase"
            >
              Google Integration &amp; Email Notifications
            </h3>
            <p className="text-xs sm:text-sm text-[#9fa5b8] mt-1 font-light leading-relaxed">
              Every stage booking request writes directly into your private Google Spreadsheet and automatically triggers an email notification to <strong className="text-[#d4af37]">pranetbhosale@gmail.com</strong>.
            </p>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveUrl} className="space-y-3 p-4 rounded-2xl bg-[#14141e] border border-white/5">
            <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
              Google Apps Script Web App URL
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c12] border border-white/10 focus:border-[#d4af37] text-xs sm:text-sm font-mono text-[#fbf7ee] focus:outline-none"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-[#d4af37] bg-white/5 hover:bg-white/10 border border-[#d4af37]/30 transition cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  {isTesting ? 'Testing...' : 'Test URL'}
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#d4af37] text-black hover:brightness-110 transition cursor-pointer whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {saveSuccess && (
              <p className="text-xs text-emerald-400 font-medium">
                ✓ Google endpoint saved successfully!
              </p>
            )}
            <p className="text-[11px] text-[#8e94a8]">
              {GOOGLE_BOOKING_CONFIG.isConfigured() ? (
                <span className="text-emerald-400">✓ Active: Form submissions dispatch to your Google endpoint.</span>
              ) : (
                <span className="text-amber-400">Pending URL: Submissions are protected in local device memory until your Web App URL is connected above.</span>
              )}
            </p>
          </form>

          {/* 3 Step Instruction Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
              Step-by-Step Setup Guide:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#b0b6c8]">
              <div className="p-3.5 rounded-xl bg-[#12121a] border border-white/5 space-y-1.5">
                <span className="font-bold text-[#d4af37] block">1. Open Google Sheet</span>
                <p>Create a Google Spreadsheet. The script will automatically create two formatted tabs: <strong>Bookings</strong> and <strong>Feedback</strong>.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#12121a] border border-white/5 space-y-1.5">
                <span className="font-bold text-[#d4af37] block">2. Paste Apps Script</span>
                <p>In your spreadsheet, click <em>Extensions &gt; Apps Script</em>. Delete existing code, paste the script below, and click Save.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#12121a] border border-white/5 space-y-1.5">
                <span className="font-bold text-[#d4af37] block">3. Deploy as Web App</span>
                <p>
                  Click <em>Deploy &gt; New deployment</em> &gt; Web app.<br/>
                  • <strong>Execute as:</strong> Me<br/>
                  • <strong>Who has access:</strong> <span className="text-amber-400 font-bold">Anyone</span> (NOT 'Only myself')
                </p>
              </div>
            </div>
          </div>

          {/* Schema Reference */}
          <div className="p-3.5 rounded-xl bg-[#101016] border border-white/5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#d4af37] font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Spreadsheet Column Headers Reference:</span>
            </div>
            <div className="text-[11px] text-[#9fa5b8] space-y-1">
              <div>
                <strong className="text-white">Bookings Sheet:</strong> {BOOKING_SHEET_HEADERS.join(', ')}
              </div>
              <div>
                <strong className="text-white">Feedback Sheet:</strong> {FEEDBACK_SHEET_HEADERS.join(', ')}
              </div>
            </div>
          </div>

          {/* Script Viewer & Copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Google Apps Script Template (Email Dispatcher, Logger &amp; Public Feed)</span>
              </span>

              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#d4af37] transition cursor-pointer"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-black/80 font-mono text-[11px] text-[#c0c5d8] overflow-x-auto max-h-48 border border-white/10">
              {GOOGLE_APPS_SCRIPT_TEMPLATE}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs text-[#8c92a6]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Notification emails route securely through Google Apps Script. Zero secrets or passwords exposed in browser.</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
