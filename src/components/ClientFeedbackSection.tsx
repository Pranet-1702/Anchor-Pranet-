import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertCircle,
  Share2,
  Calendar,
  Send,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { FeedbackRole, PublicFeedbackItem } from '../types';
import {
  GOOGLE_BOOKING_CONFIG,
  fetchPublicFeedbacksFromEndpoint,
  submitFeedbackToEndpoint,
} from '../config/googleBookingConfig';
import { submitFeedback, fetchApprovedTestimonials } from '../lib/firebase';
import { ShareFeedbackModal } from './ShareFeedbackModal';
import { GoogleSetupModal } from './GoogleSetupModal';

export const ClientFeedbackSection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<PublicFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGoogleSetupOpen, setIsGoogleSetupOpen] = useState(false);
  const [isModerationInfoOpen, setIsModerationInfoOpen] = useState(false);

  // Form State
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const roleLabelMap: Record<string, string> = {
    event_organizer: 'Event Organizer',
    client: 'Corporate Client / Sponsor',
    faculty_coordinator: 'Faculty Coordinator',
    co_host: 'Co-Host / Stage Partner',
    attendee: 'Attendee / Delegate',
    other: 'Collaborator',
  };

  const sanitizeInput = (text: string) => text.replace(/[<>]/g, '').trim();

  // Load public consented feedbacks from Cloud Firestore & Google Apps Script
  const loadFeedbacks = useCallback(async () => {
    setLoading(true);

    // Purge any stale unmoderated local cache (e.g. demo feedback)
    try {
      localStorage.removeItem('pranet_public_feedbacks');
    } catch (e) {
      // ignore
    }

    let fetchedItems: PublicFeedbackItem[] = [];

    // 1. Fetch official approved testimonials directly from Cloud Firestore
    try {
      const firestoreFeedbacks = await fetchApprovedTestimonials();
      if (firestoreFeedbacks && firestoreFeedbacks.length > 0) {
        firestoreFeedbacks.forEach((fb) => {
          fetchedItems.push({
            id: fb.id,
            fullName: fb.full_name || (fb as unknown as { fullName?: string }).fullName || 'Anonymous Client',
            organization: fb.organization || undefined,
            role: fb.role || 'Event Organizer',
            eventName: fb.event_name || (fb as unknown as { eventName?: string }).eventName || undefined,
            feedback: fb.feedback || (fb as unknown as { feedbackText?: string }).feedbackText || '',
            rating: fb.rating || 5,
            publicConsent: fb.public_consent ?? true,
            isFeatured: fb.is_featured,
            submittedAt: fb.created_at || new Date().toISOString(),
          });
        });
      }
    } catch (fbErr) {
      console.warn('Failed to load approved testimonials from Firestore:', fbErr);
    }

    // 2. Also merge from Google Apps Script Web App if configured
    if (GOOGLE_BOOKING_CONFIG.isConfigured()) {
      try {
        const sheetItems = await fetchPublicFeedbacksFromEndpoint();
        if (sheetItems && sheetItems.length > 0) {
          sheetItems.forEach((item) => {
            if (item && item.publicConsent && !fetchedItems.some((f) => f.id === item.id)) {
              fetchedItems.push(item);
            }
          });
        }
      } catch (err) {
        console.warn('Failed to load from Google endpoint:', err);
      }
    }

    setFeedbacks(fetchedItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      errors.feedbackText = 'Please provide at least 10 characters of genuine feedback.';
    }
    if (!publicConsent) {
      errors.publicConsent = 'Explicit consent is required to display your review publicly.';
    }
    if (rating < 1 || rating > 5) {
      errors.rating = 'Please select a star rating between 1 and 5.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetFormFields = () => {
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
    setSubmitError(null);

    // Anti-spam honeypot
    if (honeypot) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    const newFeedbackItem: PublicFeedbackItem = {
      id: `fb_${Date.now()}`,
      fullName: sanitizeInput(fullName),
      organization: organization.trim() ? sanitizeInput(organization) : undefined,
      role: roleLabelMap[role] || role,
      eventName: eventName.trim() ? sanitizeInput(eventName) : undefined,
      feedback: sanitizeInput(feedbackText),
      rating,
      publicConsent,
      submittedAt: new Date().toISOString(),
    };

    // 1. Dispatch to Firebase Firestore
    try {
      const fbResult = await submitFeedback({
        full_name: newFeedbackItem.fullName,
        organization: newFeedbackItem.organization || null,
        role: newFeedbackItem.role,
        event_name: newFeedbackItem.eventName || null,
        feedback: newFeedbackItem.feedback,
        rating: newFeedbackItem.rating,
        public_consent: newFeedbackItem.publicConsent,
      });

      if (!fbResult.success) {
        setSubmitError(fbResult.error || 'Failed to submit review to database. Please try again.');
        setIsSubmitting(false);
        return;
      }
    } catch (fbErr) {
      console.error('Firebase feedback error:', fbErr);
      setSubmitError('An unexpected error occurred while saving your review.');
      setIsSubmitting(false);
      return;
    }

    // 2. Dispatch to Google Apps Script endpoint if configured
    const endpointConfigured = GOOGLE_BOOKING_CONFIG.isConfigured();
    if (endpointConfigured) {
      try {
        await submitFeedbackToEndpoint({
          fullName: newFeedbackItem.fullName,
          organization: newFeedbackItem.organization,
          role: newFeedbackItem.role,
          eventName: newFeedbackItem.eventName,
          feedback: newFeedbackItem.feedback,
          rating: newFeedbackItem.rating,
          publicConsent: newFeedbackItem.publicConsent,
        });
      } catch (err: unknown) {
        console.warn('Google endpoint feedback error:', err);
      }
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    resetFormFields();
  };

  return (
    <section
      id="feedback"
      className="py-20 lg:py-28 bg-[#08080c] relative border-t border-white/5"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-80 bg-[radial-gradient(ellipse,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community &amp; Client Reflections</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fbf7ee] uppercase tracking-tight">
            Client Experiences &amp; Feedback
          </h2>
          <p className="text-sm sm:text-base text-[#9fa5b8]">
            “Every event is a story. Here's what the experience means to the people who make it special.”
          </p>

          <div className="pt-3 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {/* Action 1: Share Your Experience */}
            <button
              onClick={() => {
                setIsFormOpen(true);
                setSubmitSuccess(false);
                setSubmitError(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3e3a9] to-[#d4af37] text-[#0a0a0c] hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Share Your Experience</span>
            </button>

            {/* Action 2: Share Feedback Link */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#14141e] hover:bg-[#1a1a28] text-[#fbf7ee] border border-[#d4af37]/35 hover:border-[#d4af37] active:scale-95 transition cursor-pointer shadow-md"
            >
              <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Share Feedback Link</span>
            </button>

            {/* Action 3: Refresh Feed */}
            <button
              onClick={loadFeedbacks}
              title="Refresh Feedback Feed"
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-medium text-[#7a8094] hover:text-[#d4af37] bg-white/5 hover:bg-white/10 border border-white/5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Action 4: Google Sheets Moderation Info */}
            <button
              onClick={() => setIsModerationInfoOpen(true)}
              title="Google Sheets Feedback Storage Info"
              className="inline-flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-medium text-[#7a8094] hover:text-[#d4af37] bg-white/5 hover:bg-white/10 border border-white/5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sheets Sync</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK DISPLAY: Real Consented Testimonials OR Dignified Empty State */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#8c91a4] space-y-2">
            <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#d4af37]" />
            <p>Checking feedback records...</p>
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#111118] border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] text-left relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <Star
                          key={starVal}
                          className={`w-4 h-4 ${
                            starVal <= item.rating
                              ? 'text-[#d4af37] fill-[#d4af37]'
                              : 'text-white/10'
                          }`}
                        />
                      ))}
                    </div>

                    {item.eventName && (
                      <span className="text-[11px] font-medium text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 truncate max-w-[140px]">
                        {item.eventName}
                      </span>
                    )}
                  </div>

                  {/* Rendered safely as plain text in React, protected from XSS */}
                  <p className="text-sm text-[#d5daea] font-light leading-relaxed italic">
                    “{item.feedback}”
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#fbf7ee] tracking-tight">
                      {item.fullName}
                    </h4>
                    <p className="text-xs text-[#8c91a4]">
                      {item.organization ? `${item.organization} · ` : ''}
                      <span className="text-[#d4af37] font-medium">
                        {item.role}
                      </span>
                    </p>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]/60" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State: Pure, Genuine Invitation — No Fabricated Reviews */
          <div className="max-w-2xl mx-auto rounded-3xl bg-[#111118]/80 border border-white/10 p-8 sm:p-12 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
              <MessageSquare className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#fbf7ee]">
                Be the First to Share Your Experience
              </h3>
              <p className="text-xs sm:text-sm text-[#9fa5b8] max-w-md mx-auto leading-relaxed font-light">
                Have you organized an event, shared a stage, or attended a ceremony hosted by Pranet? We maintain an authentic record with zero fabricated reviews.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setSubmitSuccess(false);
                  setSubmitError(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-[#d4af37] text-[#fbf7ee] hover:text-[#0a0a0c] border border-white/10 hover:border-[#d4af37] transition cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Your Event Reflection</span>
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-[#d4af37] border border-[#d4af37]/30 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Link with Organizers</span>
              </button>
            </div>
          </div>
        )}

        {/* IN-PAGE SUBMISSION MODAL */}
        {isFormOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040406]/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
            onClick={() => setIsFormOpen(false)}
          >
            <div
              className="relative max-w-xl w-full bg-[#0d0d14] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(212,175,55,0.2)] text-left my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFormOpen(false)}
                aria-label="Close form modal"
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#fbf7ee] hover:text-[#d4af37] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-[#fbf7ee]">
                      Thank You For Your Feedback
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9fa5b8] max-w-md mx-auto leading-relaxed">
                      Your experience has been recorded and will appear publicly with your permission. Thank you for supporting authentic stage artistry!
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-[#fbf7ee] transition cursor-pointer"
                    >
                      Return to Website
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37] mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Authentic Reflections</span>
                    </div>
                    <h3
                      id="feedback-modal-title"
                      className="font-display text-2xl font-bold text-[#fbf7ee] uppercase tracking-tight"
                    >
                      Share Your Experience
                    </h3>
                    <p className="text-xs text-[#9fa5b8] mt-1">
                      Your feedback helps future organizers understand stage performance, professionalism, and audience impact.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Rating Selector */}
                    <div>
                      <label className="block text-xs font-medium text-[#d4af37] uppercase tracking-wider mb-1.5">
                        Your Rating *
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
                                className={`w-7 h-7 ${
                                  isFilled
                                    ? 'text-[#d4af37] fill-[#d4af37]'
                                    : 'text-white/20'
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="text-xs font-semibold text-[#fbf7ee] ml-2">
                          {rating} / 5 Stars
                        </span>
                      </div>
                      {formErrors.rating && (
                        <p className="text-[11px] text-rose-400 mt-1">{formErrors.rating}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#d4af37] uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Dr. Amit Patil"
                          className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                            formErrors.fullName
                              ? 'border-rose-500'
                              : 'border-white/10 focus:border-[#d4af37]'
                          } text-sm text-[#fbf7ee] focus:outline-none transition`}
                        />
                        {formErrors.fullName && (
                          <p className="text-[11px] text-rose-400 mt-1">
                            {formErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#d4af37] uppercase tracking-wider mb-1.5">
                          Organization / College (Optional)
                        </label>
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. JSPM Jayawantrao Sawant"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#d4af37] uppercase tracking-wider mb-1.5">
                          Your Role / Relationship *
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
                          <option value="other">Other Collaborator</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#d4af37] uppercase tracking-wider mb-1.5">
                          Event Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="e.g. Umang 2024, Spectrax"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#d4af37] uppercase tracking-wider mb-1.5">
                        Your Feedback &amp; Experience *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Describe Pranet's stage presence, audience command, voice modulation, schedule handling..."
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                          formErrors.feedbackText
                            ? 'border-rose-500'
                            : 'border-white/10 focus:border-[#d4af37]'
                        } text-sm text-[#fbf7ee] focus:outline-none transition resize-none`}
                      />
                      {formErrors.feedbackText && (
                        <p className="text-[11px] text-rose-400 mt-1">
                          {formErrors.feedbackText}
                        </p>
                      )}
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={publicConsent}
                          onChange={(e) => setPublicConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 text-[#d4af37] focus:ring-[#d4af37] bg-[#14141e] cursor-pointer"
                        />
                        <span className="text-xs text-[#9fa5b8]">
                          I grant permission to publish this feedback and my name publicly on Pranet Bhosale's professional website.
                        </span>
                      </label>
                      {formErrors.publicConsent && (
                        <p className="text-[11px] text-rose-400 mt-1">
                          {formErrors.publicConsent}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#d0d4e4] transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3e3a9] to-[#d4af37] text-[#0a0a0c] hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-60"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Share Your Experience'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GOOGLE SHEETS MODERATION MODAL */}
        {isModerationInfoOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="moderation-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040406]/95 backdrop-blur-md animate-fadeIn overflow-y-auto"
            onClick={() => setIsModerationInfoOpen(false)}
          >
            <div
              className="relative max-w-xl w-full bg-[#0d0d14] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(212,175,55,0.2)] text-left my-8 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModerationInfoOpen(false)}
                aria-label="Close dialog"
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#fbf7ee] hover:text-[#d4af37] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets Storage &amp; Moderation</span>
              </div>

              <h3 id="moderation-title" className="font-display text-xl font-bold text-[#fbf7ee]">
                How Feedback Is Stored &amp; Published
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#a0a5b8] leading-relaxed">
                <p>
                  1. All client submissions log directly to the <strong className="text-white">Feedback</strong> tab of your Google Spreadsheet.
                </p>
                <p>
                  2. Only feedback where the client selected <strong className="text-white">&quot;I grant permission to publish&quot;</strong> is eligible to be shown in the public feed.
                </p>
                <p>
                  3. If you ever want to hide or unpublish a review, simply open your Google Sheet, navigate to the <strong>Feedback</strong> tab, and change the <em>Public Consent</em> column from &quot;Yes&quot; to &quot;No&quot;.
                </p>
                <p>
                  4. The public feed only reads the Feedback tab and never exposes your private Bookings sheet!
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsModerationInfoOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#d4af37] text-black hover:brightness-110 transition cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Feedback Modal */}
      <ShareFeedbackModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Google Setup Guide Modal */}
      <GoogleSetupModal
        isOpen={isGoogleSetupOpen}
        onClose={() => setIsGoogleSetupOpen(false)}
      />
    </section>
  );
};
