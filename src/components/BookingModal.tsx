import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  User,
  DollarSign,
  FileSpreadsheet,
  Settings,
  Mail,
  Phone,
} from 'lucide-react';
import { BookingEnquiry, EVENT_TYPES, EVENT_DURATIONS } from '../types';
import {
  GOOGLE_BOOKING_CONFIG,
  submitBookingToEndpoint,
} from '../config/googleBookingConfig';
import { GoogleSetupModal } from './GoogleSetupModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  prefilledService,
}) => {
  // Initial form values factory
  const getInitialFormState = (service?: string) => ({
    fullName: '',
    email: '',
    phone: '',
    organization: '', // Optional
    eventType: (service || EVENT_TYPES[0]) as string,
    eventDate: '', // Separate date input
    eventTime: '', // Separate time input
    eventLocation: '',
    eventDuration: EVENT_DURATIONS[1] as string,
    additionalRequirements: '',
  });

  const [formData, setFormData] = useState(getInitialFormState(prefilledService));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingEnquiry | null>(null);
  const [isGoogleSetupOpen, setIsGoogleSetupOpen] = useState(false);

  // When prefilledService changes or modal opens fresh, initialize properly
  useEffect(() => {
    if (isOpen) {
      if (!isSuccess) {
        setFormData((prev) => ({
          ...prev,
          eventType: prefilledService || prev.eventType || EVENT_TYPES[0],
        }));
      }
    }
  }, [isOpen, prefilledService, isSuccess]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    // If was on success screen, reset for the next opening so it starts clean
    if (isSuccess) {
      setIsSuccess(false);
      setSubmittedData(null);
      setFormData(getInitialFormState(prefilledService));
    }
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  if (!isOpen) return null;

  // Today's date in YYYY-MM-DD for min date picker constraint
  const todayStr = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // 1. Full Name (Required)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // 2. Email Address (Required)
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 3. Phone Number (Required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    } else if (!/^[0-9+ \-()]{8,18}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // 4. Organization Name is OPTIONAL (no validation check)

    // 5. Event Type (Required)
    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    // 6. Event Date (Required, separate input)
    if (!formData.eventDate.trim()) {
      newErrors.eventDate = 'Event date is required';
    }

    // 7. Event Time (Required, separate input)
    if (!formData.eventTime.trim()) {
      newErrors.eventTime = 'Event time is required';
    }

    // 8. Event Location (Required)
    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = 'Event location/city is required';
    }

    // 9. Event Duration (Required)
    if (!formData.eventDuration.trim()) {
      newErrors.eventDuration = 'Event duration is required';
    }

    // 10. Additional Requirements is OPTIONAL

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const enquiryRecord: BookingEnquiry = {
      id: `PB-${Date.now().toString(36).toUpperCase()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      organization: formData.organization.trim() || undefined,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      eventDateTime: `${formData.eventDate} at ${formData.eventTime}`,
      eventLocation: formData.eventLocation.trim(),
      eventDuration: formData.eventDuration.trim(),
      additionalRequirements: formData.additionalRequirements.trim() || undefined,
      status: 'New Booking',
      createdAt: new Date().toISOString(),
    };

    // 1. Always save locally as immediate safety backup
    try {
      const existing = JSON.parse(localStorage.getItem('pranet_enquiries_store') || '[]');
      localStorage.setItem('pranet_enquiries_store', JSON.stringify([enquiryRecord, ...existing]));
    } catch (e) {
      console.warn('Local backup error:', e);
    }

    // 2. Dispatch to configured Google Apps Script Web App / Google Forms
    const endpointConfigured = GOOGLE_BOOKING_CONFIG.isConfigured();

    if (!endpointConfigured) {
      // If endpoint is not yet configured, inform the user clearly rather than falsely claiming Google received it.
      // However, preserve their inputs so nothing is lost!
      setIsSubmitting(false);
      setSubmitError(
        'Google Sheets endpoint is not yet configured. Please click the Settings gear icon in the top right to paste your Google Apps Script Web App URL, or send this booking directly via WhatsApp.'
      );
      return;
    }

    try {
      await submitBookingToEndpoint(enquiryRecord);

      // Submission confirmed!
      // Requirement: Save snapshot for confirmation screen, then CLEAR form fields
      setSubmittedData(enquiryRecord);
      setFormData(getInitialFormState(prefilledService));
      setErrors({});
      setSubmitError(null);
      setIsSuccess(true);
    } catch (err: unknown) {
      // Never clear form on error - preserve values for user retry
      const message = err instanceof Error ? err.message : 'Submission failed';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppBookingLink = (enquiry: BookingEnquiry) => {
    const text = encodeURIComponent(
      `Hello Pranet! I would like to book you for an event:\n\n` +
        `• Name: ${enquiry.fullName}\n` +
        `• Email: ${enquiry.email}\n` +
        `• Phone: ${enquiry.phone}\n` +
        `• Organization: ${enquiry.organization || 'N/A'}\n` +
        `• Event Type: ${enquiry.eventType}\n` +
        `• Event Date: ${enquiry.eventDate}\n` +
        `• Event Time: ${enquiry.eventTime}\n` +
        `• Location: ${enquiry.eventLocation}\n` +
        `• Duration: ${enquiry.eventDuration}\n` +
        `• Requirements: ${enquiry.additionalRequirements || 'Standard compering'}\n\n` +
        `Ref ID: ${enquiry.id}`
    );
    return `https://wa.me/917391035544?text=${text}`;
  };

  const startNewBooking = () => {
    setFormData(getInitialFormState(prefilledService));
    setErrors({});
    setSubmitError(null);
    setSubmittedData(null);
    setIsSuccess(false);
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040406]/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
        onClick={handleClose}
      >
        <div
          className="relative max-w-2xl w-full bg-[#0d0d14] border border-[#d4af37]/35 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(212,175,55,0.2)] text-left my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close booking modal"
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#fbf7ee] hover:text-[#d4af37] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess && submittedData ? (
            /* Confirmation Screen with EXACT requested copy */
            <div className="py-8 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-2xl font-bold text-[#fbf7ee]">
                  Booking Request Received
                </h3>
                {/* EXACT REQUIRED CONFIRMATION TEXT */}
                <p className="text-sm sm:text-base text-[#e5c07b] max-w-md mx-auto leading-relaxed font-serif italic">
                  “Thank you! Your booking request has been received. I will contact you shortly to discuss availability and confirm the event.”
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14141e] border border-white/5 max-w-md mx-auto text-xs text-[#a3a9be] space-y-1.5 text-left">
                <div>
                  <span className="text-white font-medium">Client:</span> {submittedData.fullName}
                  {submittedData.organization ? ` (${submittedData.organization})` : ''}
                </div>
                <div>
                  <span className="text-white font-medium">Event:</span> {submittedData.eventType}
                </div>
                <div>
                  <span className="text-white font-medium">Date &amp; Time:</span> {submittedData.eventDate} at {submittedData.eventTime}
                </div>
                <div>
                  <span className="text-white font-medium">Location:</span> {submittedData.eventLocation} ({submittedData.eventDuration})
                </div>
                <div className="text-[10px] text-[#d4af37] pt-1 font-mono">
                  Reference: {submittedData.id}
                </div>
              </div>

              {/* Instant WhatsApp Dispatch & Next Steps */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppBookingLink(submittedData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366] text-black hover:bg-[#20ba59] transition shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Fast Copy via WhatsApp</span>
                </a>
                <button
                  onClick={startNewBooking}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-[#d4af37] bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d4af37] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Stage Booking &amp; Availability</span>
                  </div>
                  <h3
                    id="booking-modal-title"
                    className="font-display text-2xl sm:text-3xl font-bold text-[#fbf7ee] uppercase tracking-tight"
                  >
                    Book Pranet Bhosale
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9fa5b8] mt-1 font-light">
                    Submit your event parameters. Requests log directly to Google Sheets with automated notifications.
                  </p>
                </div>

                {/* Google Configuration Link */}
                <button
                  type="button"
                  onClick={() => setIsGoogleSetupOpen(true)}
                  title="Configure Google Sheets & Email Notifications"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8e94a8] hover:text-[#d4af37] border border-white/5 transition cursor-pointer shrink-0"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Google Integration Status Indicator */}
              <div className="p-3 rounded-xl bg-[#12121c] border border-white/5 flex items-center justify-between text-xs text-[#8e94a8]">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    Google Sheets &amp; Email:{' '}
                    {GOOGLE_BOOKING_CONFIG.isConfigured() ? (
                      <strong className="text-emerald-400">Connected to Google Endpoint</strong>
                    ) : (
                      <strong className="text-amber-400">Setup Pending (URL Configurable)</strong>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGoogleSetupOpen(true)}
                  className="text-[11px] text-[#d4af37] hover:underline"
                >
                  Setup Guide
                </button>
              </div>

              {submitError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-rose-200">{submitError}</p>
                      <p className="text-[11px] text-rose-300/80">
                        All your entered booking specifications have been preserved below. You can retry submission or send directly to Pranet via WhatsApp right now.
                      </p>
                    </div>
                  </div>
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/917391035544?text=${encodeURIComponent(
                        `Hello Pranet! I tried to submit a booking on your website:\n\n` +
                          `• Name: ${formData.fullName || 'Client'}\n` +
                          `• Email: ${formData.email}\n` +
                          `• Phone: ${formData.phone}\n` +
                          `• Organization: ${formData.organization || 'N/A'}\n` +
                          `• Event: ${formData.eventType}\n` +
                          `• Date: ${formData.eventDate}\n` +
                          `• Time: ${formData.eventTime}\n` +
                          `• Location: ${formData.eventLocation}\n` +
                          `• Duration: ${formData.eventDuration}\n` +
                          `• Requirements: ${formData.additionalRequirements || 'Standard compering'}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#25D366] text-black hover:brightness-110 transition shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Instantly via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsGoogleSetupOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#d4af37] bg-white/5 hover:bg-white/10 transition cursor-pointer"
                    >
                      Check Endpoint Settings
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* 1. Full name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Vikramaditya Shinde"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                          errors.fullName ? 'border-rose-500' : 'border-white/10 focus:border-[#d4af37]'
                        } text-sm text-[#fbf7ee] placeholder-[#555b70] focus:outline-none transition`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. organizer@company.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                          errors.email ? 'border-rose-500' : 'border-white/10 focus:border-[#d4af37]'
                        } text-sm text-[#fbf7ee] placeholder-[#555b70] focus:outline-none transition`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* 2. Phone number & Organization (OPTIONAL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                          errors.phone ? 'border-rose-500' : 'border-white/10 focus:border-[#d4af37]'
                        } text-sm text-[#fbf7ee] placeholder-[#555b70] focus:outline-none transition`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Organization / Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. JSPM Pune / Tech Mahindra"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] placeholder-[#555b70] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* 3. Event Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                    Event Type <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#101018] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Split Event Date & Event Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Event Date <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                        errors.eventDate ? 'border-rose-500' : 'border-white/10 focus:border-[#d4af37]'
                      } text-sm text-[#fbf7ee] focus:outline-none transition scheme-dark`}
                    />
                    {errors.eventDate && <p className="text-[11px] text-rose-400 mt-1">{errors.eventDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Event Time <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                        errors.eventTime ? 'border-rose-500' : 'border-white/10 focus:border-[#d4af37]'
                      } text-sm text-[#fbf7ee] focus:outline-none transition scheme-dark`}
                    />
                    {errors.eventTime && <p className="text-[11px] text-rose-400 mt-1">{errors.eventTime}</p>}
                  </div>
                </div>

                {/* 5. Event Location & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Event Location / City <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      placeholder="e.g. Pune / Mumbai / Goa"
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#13131c] border ${
                        errors.eventLocation ? 'border-rose-500' : 'border-white/10 focus:border-[#d4af37]'
                      } text-sm text-[#fbf7ee] placeholder-[#555b70] focus:outline-none transition`}
                    />
                    {errors.eventLocation && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.eventLocation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                      Event Duration <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.eventDuration}
                      onChange={(e) => setFormData({ ...formData, eventDuration: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] focus:outline-none transition"
                    >
                      {EVENT_DURATIONS.map((dur) => (
                        <option key={dur} value={dur} className="bg-[#101018] text-white">
                          {dur}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Additional Requirements */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    placeholder="Describe run-of-show, VIP protocols, language preference (English, Hindi, Marathi), or special stage requirements..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13131c] border border-white/10 focus:border-[#d4af37] text-sm text-[#fbf7ee] placeholder-[#555b70] focus:outline-none transition resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#8e94a8]">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Instant notification to pranetbhosale@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#d0d4e4] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3e3a9] to-[#d4af37] text-[#0a0a0c] hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Sending Request...' : 'Submit Booking Request'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Google Setup Guide Modal */}
      <GoogleSetupModal
        isOpen={isGoogleSetupOpen}
        onClose={() => setIsGoogleSetupOpen(false)}
      />
    </>
  );
};
