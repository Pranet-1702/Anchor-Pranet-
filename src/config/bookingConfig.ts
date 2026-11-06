/**
 * Centralized Booking Configuration for Anchorr Pranet — Professional Anchor & Emcee
 * 
 * Two Primary Booking Channels:
 * 1. Google Form Booking (direct link to configured Google Form connected to Google Sheets)
 * 2. WhatsApp Booking (direct WhatsApp link to +91 7391035544 with pre-filled enquiry message)
 */

export const BOOKING_CONFIG = {
  // Official WhatsApp Booking Details
  whatsapp: {
    phoneNumber: '917391035544',
    displayNumber: '+91 7391035544',
    rawPhone: '7391035544',
    
    // Exact suggested enquiry template
    defaultMessage: `Hello Pranet! I visited your anchoring portfolio website and would like to enquire about booking you for an event.

Event Name: 
Event Date: 
Event Location: 
Event Type: 

Please share your availability and further details.`,

    /**
     * Generates WhatsApp deep link with optional event context
     */
    getUrl: (eventContext?: { title?: string; type?: string; location?: string }): string => {
      let message = BOOKING_CONFIG.whatsapp.defaultMessage;

      if (eventContext?.title || eventContext?.type) {
        message = `Hello Pranet! I visited your anchoring portfolio website and would like to enquire about booking you for an event.

Event Name: ${eventContext.title || ''}
Event Date: 
Event Location: ${eventContext.location || ''}
Event Type: ${eventContext.type || eventContext.title || ''}

Please share your availability and further details.`;
      }

      return `https://wa.me/${BOOKING_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
    },
  },

  // Google Form Booking Configuration
  googleForm: {
    // LocalStorage override key for testing or client configuration without redeploy
    storageKey: 'pranet_google_form_url',

    // Central placeholder URL — Replace this with your actual Google Form URL
    // (e.g. https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform)
    placeholderUrl: 'https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID_HERE/viewform',

    /**
     * Returns the active Google Form URL (from localStorage, env var, or placeholder)
     */
    getUrl: (): string => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('pranet_google_form_url');
        if (stored && stored.trim()) return stored.trim();
      }
      return (
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_FORM_URL) ||
        BOOKING_CONFIG.googleForm.placeholderUrl
      );
    },

    /**
     * Sets a custom Google Form URL into browser storage
     */
    setUrl: (url: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pranet_google_form_url', url.trim());
      }
    },

    /**
     * Checks if the Google Form URL has been configured with a real Google Form link
     */
    isConfigured: (): boolean => {
      const url = BOOKING_CONFIG.googleForm.getUrl();
      return Boolean(
        url &&
        url.startsWith('https://docs.google.com/forms') &&
        !url.includes('YOUR_GOOGLE_FORM_ID_HERE')
      );
    },
  },
};
