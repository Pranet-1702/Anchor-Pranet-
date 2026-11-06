import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  ShieldCheck,
  Building,
  User,
  Calendar,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { FeedbackRole, PublicFeedbackItem } from '../types';
import {
  GOOGLE_BOOKING_CONFIG,
  submitFeedbackToEndpoint,
} from '../config/googleBookingConfig';
import { submitFeedback } from '../lib/firebase';
import { ShareFeedbackModal } from './ShareFeedbackModal';

interface FeedbackPageProps {
  onNavigateHome: () => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onNavigateHome }) => {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<FeedbackRole>('event_organizer');
  const [eventName, setEventName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [publicConsent, setPublicConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const roleLabelMap: Record<FeedbackRole, string> = {
    event_organizer: 'Event Organizer',
    client: 'Corporate Client / Sponsor',
    faculty_coordinator: 'Faculty Coordinator',
    co_host: 'Co-Host / Stage Partner',
    attendee: 'Attendee / Delegate',
    other: 'Collaborator',
  };

  const sanitizeInput = (text: string) => text.replace(/[<>]/g, '').trim();

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      errors.feedbackText = 'Please provide at least 10 characters describing your experience.';
    }
    if (!publicConsent) {
      errors.publicConsent = 'Consent is required to display your review on the portfolio.';
    }
    if (rating < 1 || rating > 5) {
      errors.rating = 'Please select a star rating between 1 and 5.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFullName('');
    setOrganization('');
    setRole('event_organizer');
    setEventName('');
    setFeedbackText('');
    setRating(5);
    setHoverRating(0);
    setPublicConsent(false);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Anti-spam honeypot
    if (honeypot) return;

    if (!validate()) return;

    setIsSubmitting(true);

    const feedbackPayload = {
      fullName: sanitizeInput(fullName),
      organization: organization.trim() ? sanitizeInput(organization) : undefined,
      role: roleLabelMap[role] || role,
      eventName: eventName.trim() ? sanitizeInput(eventName) : undefined,
      feedback: sanitizeInput(feedbackText),
      rating,
      publicConsent,
    };

    // 1. Dispatch to Firebase Firestore
    try {
      const fbResult = await submitFeedback({
        full_name: feedbackPayload.fullName,
        organization: feedbackPayload.organization || null,
        role: feedbackPayload.role,
        event_name: feedbackPayload.eventName || null,
        feedback: feedbackPayload.feedback,
        rating: feedbackPayload.rating,
        public_consent: feedbackPayload.publicConsent,
      });

      if (!fbResult.success) {
        setServerError(fbResult.error || 'Failed to submit feedback to database. Please try again.');
        setIsSubmitting(false);
        return;
      }
    } catch (fbErr) {
      console.error('Firebase feedback submission error:', fbErr);
      setServerError('An unexpected error occurred while saving your feedback.');
      setIsSubmitting(false);
      return;
    }

    // 2. Dispatch to Google Apps Script endpoint if configured
    if (GOOGLE_BOOKING_CONFIG.isConfigured()) {
      try {
        await submitFeedbackToEndpoint(feedbackPayload);
      } catch (err: unknown) {
        console.warn('Google feedback endpoint error:', err);
      }
    }

    // Clear any stale local feedback items
    try {
      localStorage.removeItem('pranet_public_feedbacks');
    } catch (e) {
      // ignore
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#fbf7ee] font-sans selection:bg-[#d4af37] selection:text-[#0a0a0c] pt-8 pb-20 px-4 sm:px-6 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-8">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#c5c9d8] hover:text-[#d4af37] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#d4af37] bg-white/5 hover:bg-[#d4af37]/15 border border-[#d4af37]/30 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pranet Bhosale · Professional Anchor &amp; Emcee</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight uppercase text-[#fbf7ee]">
            Share Your Experience
          </h1>
          <p className="text-sm sm:text-base text-[#9fa5b8] max-w-lg mx-auto font-light leading-relaxed">
            Your feedback helps me make every event more memorable.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl bg-[#0d0d14] border border-[#d4af37]/35 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(212,175,55,0.15)] text-left">
          {submitSuccess ? (
            <div className="py-10 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-[#fbf7ee]">
                  Experience Recorded Successfully
                </h3>
                <p className="text-xs sm:text-sm text-[#9fa5b8] max-w-md mx-auto leading-relaxed">
                  Thank you for taking the time to share your genuine thoughts! Your reflection has been recorded and will appear on the portfolio with your public permission.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                >
                  Submit Another Reflection
                </button>
                <button
                  onClick={onNavigateHome}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-black hover:brightness-110 transition cursor-pointer"
                >
                  View Main Portfolio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="website_url_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {serverError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Star Rating from 1 to 5 */}
              <div>
                <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                  Star Rating (1 to 5) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled =
                      hoverRating > 0 ? starVal <= hoverRating : starVal <= rating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition transform hover:scale-110 focus:outline-none"
                        aria-label={`Rate ${starVal} out of 5 stars`}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            isFilled
                              ? 'text-[#d4af37] fill-[#d4af37]'
                              : 'text-white/20'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-[#fbf7ee] ml-3">
                    {rating} of 5 Stars
                  </span>
                </div>
                {formErrors.rating && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.rating}</p>
                )}
              </div>

              {/* Full Name & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anand Kulkarni"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                      formErrors.fullName
                        ? 'border-rose-500'
                        : 'border-white/10 focus:border-[#d4af37]'
                    } text-sm text-[#fbf7ee] focus:outline-none transition`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                    Organization or Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. SGI Atigre / JSPM Pune"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Role & Event Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                    Role or Relationship *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as FeedbackRole)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                  >
                    <option value="event_organizer">Event Organizer</option>
                    <option value="faculty_coordinator">Faculty Coordinator</option>
                    <option value="client">Corporate Client / Sponsor</option>
                    <option value="co_host">Co-Host / Stage Partner</option>
                    <option value="attendee">Attendee / Audience Member</option>
                    <option value="other">Collaborator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                    Event Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Umang 2024, Spectrax 2k26"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Feedback Description */}
              <div>
                <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                  Genuine Written Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share details regarding Pranet's stage presence, audience command, voice modulation, schedule handling, or collaborative energy..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                    formErrors.feedbackText
                      ? 'border-rose-500'
                      : 'border-white/10 focus:border-[#d4af37]'
                  } text-sm text-[#fbf7ee] focus:outline-none transition resize-none`}
                />
                {formErrors.feedbackText && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.feedbackText}</p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publicConsent}
                    onChange={(e) => setPublicConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 text-[#d4af37] focus:ring-[#d4af37] bg-[#14141e] cursor-pointer"
                  />
                  <span className="text-xs text-[#9fa5b8] leading-relaxed">
                    I grant permission for Pranet Bhosale to display this feedback and my name publicly on his professional website and portfolio.
                  </span>
                </label>
                {formErrors.publicConsent && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.publicConsent}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7e1d] text-[#0a0a0c] hover:brightness-110 active:scale-98 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#73798c] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]/60" />
                <span>Protected with client consent and direct Google Sheet recording.</span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Share Feedback Modal */}
      <ShareFeedbackModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
