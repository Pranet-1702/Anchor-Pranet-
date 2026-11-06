/**
 * Google Booking & Feedback Integration Configuration
 * 
 * Manages Google Sheets endpoint and Apps Script notification settings.
 * All secrets remain server-side (in Apps Script / Google Cloud), never in client code.
 */

import { BookingEnquiry, PublicFeedbackItem } from '../types';

/**
 * Central Final Booking Configuration
 * 
 * 1. Google Form Booking (Primary): Direct new tab dispatch
 * 2. WhatsApp Booking (Direct chat with pre-filled message)
 */
export const GOOGLE_FORM_BOOKING_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScjjI6JzyO-zroGxewDtgX9z_lIKdThIiYdl8HB8bF-qvuVlA/viewform?usp=dialog';

export const WHATSAPP_PHONE = '917391035544';

export const WHATSAPP_BOOKING_MESSAGE = `Hello Pranet! I visited your anchoring portfolio website and would like to enquire about booking you for an event.

Event Name: 
Event Date: 
Event Location: 
Event Type: 

Please share your availability and further details.`;

export const WHATSAPP_BOOKING_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  WHATSAPP_BOOKING_MESSAGE
)}`;

/**
 * Directly opens the verified Google Form in a new browser tab.
 */
export function openGoogleBookingForm() {
  if (typeof window !== 'undefined') {
    window.open(GOOGLE_FORM_BOOKING_URL, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Constructs a properly URL-encoded WhatsApp booking URL with optional event/service pre-filling.
 */
export function getWhatsAppBookingUrl(eventNameOrType?: string): string {
  const message = eventNameOrType
    ? `Hello Pranet! I visited your anchoring portfolio website and would like to enquire about booking you for an event.\n\nEvent Name: ${eventNameOrType}\nEvent Date: \nEvent Location: \nEvent Type: ${eventNameOrType}\n\nPlease share your availability and further details.`
    : WHATSAPP_BOOKING_MESSAGE;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp directly with the pre-filled message.
 */
export function openWhatsAppBooking(eventNameOrType?: string) {
  if (typeof window !== 'undefined') {
    window.open(getWhatsAppBookingUrl(eventNameOrType), '_blank', 'noopener,noreferrer');
  }
}

export const GOOGLE_BOOKING_CONFIG = {
  notificationEmail: 'pranetbhosale@gmail.com',
  googleFormUrl: GOOGLE_FORM_BOOKING_URL,
  whatsappPhone: WHATSAPP_PHONE,
  storageKey: 'pranet_google_booking_endpoint',
  getEndpointUrl: (): string => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pranet_google_booking_endpoint');
      if (stored && stored.trim()) return stored.trim();
    }
    return GOOGLE_FORM_BOOKING_URL;
  },
  setEndpointUrl: (url: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pranet_google_booking_endpoint', url.trim());
    }
  },
  isConfigured: (): boolean => true,
};

/**
 * Shared Google Sheets Column Headers for Bookings
 */
export const BOOKING_SHEET_HEADERS = [
  'Submitted At',
  'Full Name',
  'Email Address',
  'Phone Number',
  'Organization Name',
  'Event Type',
  'Event Date',
  'Event Time',
  'Event Location',
  'Event Duration',
  'Budget',
  'Additional Requirements',
  'Booking Status',
] as const;

/**
 * Shared Google Sheets Column Headers for Feedback
 */
export const FEEDBACK_SHEET_HEADERS = [
  'Submitted At',
  'Client Name',
  'Organization',
  'Role',
  'Event Name',
  'Star Rating',
  'Written Experience',
  'Public Consent',
] as const;

/**
 * Dispatches a booking enquiry to the Google Apps Script endpoint.
 * Returns { success: true } only when confirmed by the server.
 * Never uses opaque responses that conceal transmission failures.
 */
export async function submitBookingToEndpoint(
  enquiry: BookingEnquiry
): Promise<{ success: boolean; message: string; details?: unknown }> {
  const endpointUrl = GOOGLE_BOOKING_CONFIG.getEndpointUrl();

  if (!endpointUrl) {
    throw new Error(
      'Google Apps Script endpoint is not configured. Please open the Google Setup dialog to connect your spreadsheet endpoint.'
    );
  }

  if (
    !endpointUrl.startsWith('https://script.google.com/macros/s/') &&
    !endpointUrl.startsWith('https://docs.google.com/forms')
  ) {
    throw new Error(
      'Invalid Google endpoint URL format. It must start with https://script.google.com/macros/s/.../exec'
    );
  }

  const payload = {
    action: 'booking',
    'Full Name': enquiry.fullName.trim(),
    'Email Address': enquiry.email.trim(),
    'Phone Number': enquiry.phone.trim(),
    'Organization Name': enquiry.organization?.trim() || 'N/A',
    'Event Type': enquiry.eventType,
    'Event Date': enquiry.eventDate,
    'Event Time': enquiry.eventTime,
    'Event Location': enquiry.eventLocation.trim(),
    'Event Duration': enquiry.eventDuration,
    Budget: enquiry.budget?.trim() || 'Not specified',
    'Additional Requirements': enquiry.additionalRequirements?.trim() || 'None',
    'Booking Status': enquiry.status || 'New Booking',
    'Submitted At': enquiry.createdAt || new Date().toISOString(),
  };

  try {
    // Send as CORS-safelisted simple POST (text/plain) to avoid 405 Method Not Allowed on OPTIONS preflight
    // and follow the redirect to script.googleusercontent.com to inspect the real response.
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Google endpoint responded with HTTP status ${response.status}: ${response.statusText}`);
    }

    const result = (await response.json().catch(() => null)) as
      | { status?: string; message?: string; rowSaved?: boolean }
      | null;

    if (result && result.status === 'error') {
      throw new Error(`Google Apps Script reported an error: ${result.message || 'Execution failed'}`);
    }

    if (result && (result.status === 'success' || result.rowSaved)) {
      return {
        success: true,
        message: result.message || 'Booking request confirmed and recorded in Google Sheets.',
        details: result,
      };
    }

    // If server returned non-standard output or HTML login page (unauthorized redirect)
    throw new Error(
      'Google Apps Script did not return a valid confirmation response. Please ensure your Web App is deployed with "Who has access: Anyone".'
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';

    if (
      errorMsg.includes('Failed to fetch') ||
      errorMsg.includes('NetworkError') ||
      errorMsg.includes('CORS') ||
      errorMsg.includes('cross-origin')
    ) {
      throw new Error(
        'Unable to communicate with your Google Apps Script endpoint. This usually occurs if the Web App is not deployed with "Who has access: Anyone", or if the script URL has not been authorized. Check your Apps Script deployment permissions.'
      );
    }

    throw new Error(`Booking submission failed: ${errorMsg}`);
  }
}

/**
 * Dispatches client feedback to the Google Apps Script endpoint.
 */
export async function submitFeedbackToEndpoint(feedbackData: {
  fullName: string;
  organization?: string;
  role: string;
  eventName?: string;
  feedback: string;
  rating: number;
  publicConsent: boolean;
}): Promise<{ success: boolean; message: string; details?: unknown }> {
  const endpointUrl = GOOGLE_BOOKING_CONFIG.getEndpointUrl();

  if (!endpointUrl) {
    throw new Error(
      'Google endpoint is not configured. Please configure the Google Apps Script Web App URL.'
    );
  }

  const payload = {
    action: 'feedback',
    'Client Name': feedbackData.fullName.trim(),
    Organization: feedbackData.organization?.trim() || '',
    Role: feedbackData.role,
    'Event Name': feedbackData.eventName?.trim() || '',
    'Star Rating': feedbackData.rating,
    'Written Experience': feedbackData.feedback.trim(),
    'Public Consent': feedbackData.publicConsent ? 'Yes' : 'No',
    'Submitted At': new Date().toISOString(),
  };

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Google endpoint responded with HTTP ${response.status}`);
    }

    const result = (await response.json().catch(() => null)) as
      | { status?: string; message?: string }
      | null;

    if (result && result.status === 'error') {
      throw new Error(`Google Apps Script reported an error: ${result.message}`);
    }

    return {
      success: true,
      message: 'Feedback submitted and logged successfully.',
      details: result,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    throw new Error(`Failed to transmit feedback: ${errorMsg}`);
  }
}

/**
 * Fetches public consented feedbacks from Google Apps Script Web App
 */
export async function fetchPublicFeedbacksFromEndpoint(): Promise<PublicFeedbackItem[]> {
  const endpointUrl = GOOGLE_BOOKING_CONFIG.getEndpointUrl();
  if (!endpointUrl || !endpointUrl.startsWith('https://script.google.com')) {
    return [];
  }

  try {
    const url = new URL(endpointUrl);
    url.searchParams.set('action', 'feedback');
    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (err) {
    console.warn('Could not fetch feedback from Google endpoint:', err);
    return [];
  }
}

/**
 * Ready-to-use Google Apps Script to paste into your Google Sheet (Extensions > Apps Script).
 * It automatically sends an email notification to pranetbhosale@gmail.com, sends
 * an acknowledgment email to the client, logs bookings into "Bookings" sheet (13 columns),
 * and logs & serves consented reviews from "Feedback" sheet.
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `
/**
 * GOOGLE APPS SCRIPT: Pranet Bhosale Booking & Feedback Web App
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open or create your Google Spreadsheet.
 * 2. In Google Sheets menu, click: Extensions > Apps Script.
 * 3. Replace all code in Code.gs with this exact script.
 * 4. Click the disk icon (Save).
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Configure:
 *    - Description: "Pranet Booking & Notification API"
 *    - Execute as: "Me" (your Google account)  <-- CRITICAL!
 *    - Who has access: "Anyone"                 <-- CRITICAL! (Do NOT choose 'Only myself')
 * 8. Click "Deploy".
 * 9. Click "Authorize access" (choose your account, click Advanced > Go to Untitled project (unsafe) > Allow).
 * 10. Copy the generated Web App URL (ends in /exec).
 * 11. Open your website, click the Settings gear icon, and paste the Web App URL.
 * 
 * IMPORTANT FOR CODE UPDATES:
 * Whenever you edit this Code.gs script in Apps Script, you MUST click:
 * "Deploy" > "Manage deployments" > click pencil edit icon > Version: "New version" > "Deploy".
 * Otherwise, Google continues executing the older version of your script!
 */

// Target notification email
const NOTIFICATION_RECIPIENT = "pranetbhosale@gmail.com";

// Optional: If you created this script at script.google.com as a standalone project
// rather than through Extensions > Apps Script, paste your Google Sheet ID below:
const SPREADSHEET_ID = ""; // e.g. "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

/**
 * Helper to safely obtain the target Google Spreadsheet
 */
function getTargetSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    Logger.log("getActiveSpreadsheet() not available: " + e);
  }
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  throw new Error("Target Spreadsheet not found. If this script is standalone, please set SPREADSHEET_ID in Code.gs.");
}

function doPost(e) {
  try {
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const action = data.action || "booking";

    if (action === "feedback") {
      return handleFeedbackSubmission(data);
    } else {
      return handleBookingSubmission(data);
    }
  } catch (err) {
    Logger.log("Fatal error in doPost: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleBookingSubmission(data) {
  const ss = getTargetSpreadsheet();
  let sheet = ss.getSheetByName("Bookings");
  
  if (!sheet) {
    sheet = ss.insertSheet("Bookings");
  }

  // Ensure header row is populated and formatted if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Organization Name",
      "Event Type",
      "Event Date",
      "Event Time",
      "Event Location",
      "Event Duration",
      "Budget",
      "Additional Requirements",
      "Booking Status"
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#d4af37").setFontColor("#000000");
  }

  // Extract all 13 fields with safe fallbacks
  const clientName = data["Full Name"] || data["fullName"] || data["name"] || "New Client";
  const clientEmail = data["Email Address"] || data["email"] || data["emailAddress"] || "";
  const clientPhone = data["Phone Number"] || data["phone"] || data["phoneNumber"] || "";
  const organization = data["Organization Name"] || data["organization"] || data["company"] || "N/A";
  const eventType = data["Event Type"] || data["eventType"] || "General Event";
  const eventDate = data["Event Date"] || data["eventDate"] || "TBD";
  const eventTime = data["Event Time"] || data["eventTime"] || "TBD";
  const eventLocation = data["Event Location"] || data["eventLocation"] || data["location"] || "N/A";
  const eventDuration = data["Event Duration"] || data["eventDuration"] || data["duration"] || "N/A";
  const budget = data["Budget"] || data["budget"] || "Not specified";
  const requirements = data["Additional Requirements"] || data["additionalRequirements"] || data["requirements"] || data["description"] || "None specified";
  const bookingStatus = data["Booking Status"] || data["bookingStatus"] || data["status"] || "New Booking";
  const submittedAt = data["Submitted At"] || data["submittedAt"] || data["createdAt"] || new Date().toISOString();

  // 1. Append row to Bookings sheet (All 13 columns in exact order)
  sheet.appendRow([
    submittedAt,
    clientName,
    clientEmail,
    clientPhone,
    organization,
    eventType,
    eventDate,
    eventTime,
    eventLocation,
    eventDuration,
    budget,
    requirements,
    bookingStatus
  ]);

  Logger.log("Row successfully appended to Bookings tab for client: " + clientName);

  // 2. Send Admin Notification Email to Pranet
  const subject = "New Anchoring Booking Request — " + clientName;
  const adminHtmlBody = \`
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #d4af37; border-radius: 12px; background-color: #0c0c10; color: #fbf7ee;">
      <h2 style="color: #d4af37; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">New Stage Anchoring Request</h2>
      <p style="color: #a0a5b8; font-size: 14px;">A new booking enquiry has been received on your portfolio website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 18px; color: #fbf7ee; font-size: 13px;">
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold; width: 35%;">Client Name:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${clientName}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Email Address:</td><td style="padding: 9px; border-bottom: 1px solid #222;"><a href="mailto:\${clientEmail}" style="color: #d4af37;">\${clientEmail}</a></td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Phone Number:</td><td style="padding: 9px; border-bottom: 1px solid #222;"><a href="tel:\${clientPhone}" style="color: #d4af37;">\${clientPhone}</a></td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Organization:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${organization}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Event Type:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${eventType}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Event Date:</td><td style="padding: 9px; border-bottom: 1px solid #222; font-weight: bold; color: #fff;">\${eventDate}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Event Time:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${eventTime}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Event Location:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${eventLocation}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Event Duration:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${eventDuration}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Budget:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${budget}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Requirements / Description:</td><td style="padding: 9px; border-bottom: 1px solid #222;">\${requirements}</td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Booking Status:</td><td style="padding: 9px; border-bottom: 1px solid #222;"><span style="background-color: #22c55e22; color: #4ade80; padding: 2px 6px; border-radius: 4px; font-weight: bold;">\${bookingStatus}</span></td></tr>
        <tr><td style="padding: 9px; border-bottom: 1px solid #222; color: #d4af37; font-weight: bold;">Submitted At:</td><td style="padding: 9px; border-bottom: 1px solid #222; font-size: 11px; color: #a0a5b8;">\${submittedAt}</td></tr>
      </table>
      
      <p style="margin-top: 25px; font-size: 11px; color: #717688; text-align: center;">Pranet Bhosale · Professional Anchor & Emcee Booking Notification</p>
    </div>
  \`;

  let adminEmailSent = false;
  let adminEmailError = null;
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_RECIPIENT,
      subject: subject,
      htmlBody: adminHtmlBody,
      name: "Pranet Bhosale Portfolio"
    });
    adminEmailSent = true;
    Logger.log("Admin notification email sent successfully to: " + NOTIFICATION_RECIPIENT);
  } catch (mailErr) {
    adminEmailError = mailErr.toString();
    Logger.log("Admin notification email failed to send: " + mailErr);
  }

  // 3. Send Acknowledgment Email to Client
  let clientEmailSent = false;
  let clientEmailError = null;
  if (clientEmail && clientEmail.indexOf("@") !== -1) {
    const clientSubject = "Booking Request Received — Pranet Bhosale | Professional Anchor & Emcee";
    const clientHtmlBody = \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d4af37; border-radius: 12px; background-color: #0c0c10; color: #fbf7ee;">
        <h2 style="color: #d4af37; margin-top: 0;">Thank You for Reaching Out</h2>
        <p>Dear \${clientName},</p>
        <p>Thank you! Your booking request for <strong>\${eventType}</strong> on <strong>\${eventDate}</strong> at <strong>\${eventTime}</strong> has been received.</p>
        <p>I will review your schedule and requirements and contact you shortly to discuss availability, format curation, and next steps.</p>
        <div style="margin: 20px 0; padding: 16px; background-color: #14141e; border-left: 3px solid #d4af37; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #a0a5b8; line-height: 1.6;">
            <strong>Direct Contact:</strong> +91 7391035544 | pranetbhosale@gmail.com<br/>
            <strong>Instagram:</strong> @anchorrpranet
          </p>
        </div>
        <p style="font-size: 12px; color: #717688; font-style: italic;">Note: This email acknowledges receipt of your request. Stage dates are confirmed upon mutual agreement.</p>
      </div>
    \`;

    try {
      MailApp.sendEmail({
        to: clientEmail,
        subject: clientSubject,
        htmlBody: clientHtmlBody,
        name: "Pranet Bhosale"
      });
      clientEmailSent = true;
      Logger.log("Client acknowledgment email sent successfully to: " + clientEmail);
    } catch (mailErr) {
      clientEmailError = mailErr.toString();
      Logger.log("Client acknowledgment email failed: " + mailErr);
    }
  }

  // 4. Return confirmed JSON output
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    rowSaved: true,
    sheetName: "Bookings",
    adminEmailSent: adminEmailSent,
    clientEmailSent: clientEmailSent,
    adminEmailError: adminEmailError,
    clientEmailError: clientEmailError,
    timestamp: submittedAt,
    message: "Booking request received and recorded successfully."
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleFeedbackSubmission(data) {
  const ss = getTargetSpreadsheet();
  let sheet = ss.getSheetByName("Feedback");
  if (!sheet) {
    sheet = ss.insertSheet("Feedback");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Client Name",
      "Organization",
      "Role",
      "Event Name",
      "Star Rating",
      "Written Experience",
      "Public Consent"
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#d4af37").setFontColor("#000000");
  }

  const clientName = data["Client Name"] || data["clientName"] || data["fullName"] || "Anonymous";
  const organization = data["Organization"] || data["organization"] || "";
  const role = data["Role"] || data["role"] || "Client";
  const eventName = data["Event Name"] || data["eventName"] || "";
  const rating = data["Star Rating"] || data["rating"] || 5;
  const feedback = data["Written Experience"] || data["feedback"] || "";
  const publicConsent = data["Public Consent"] || (data["publicConsent"] ? "Yes" : "No");
  const submittedAt = data["Submitted At"] || new Date().toISOString();

  sheet.appendRow([
    submittedAt,
    clientName,
    organization,
    role,
    eventName,
    rating,
    feedback,
    publicConsent
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Feedback submitted and logged successfully."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  // Public GET endpoint: Serves only consented feedback. Never exposes booking data!
  try {
    const action = (e && e.parameter && e.parameter.action) || "feedback";
    
    if (action === "feedback") {
      const ss = getTargetSpreadsheet();
      const sheet = ss.getSheetByName("Feedback");
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
      }

      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
      }

      // Headers: Submitted At(0), Client Name(1), Organization(2), Role(3), Event Name(4), Star Rating(5), Written Experience(6), Public Consent(7)
      const publicFeedbacks = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const consent = String(row[7]).toLowerCase().trim();
        if (consent === "yes" || consent === "true" || consent === "1") {
          publicFeedbacks.push({
            id: "fb_" + i + "_" + new Date(row[0]).getTime(),
            fullName: String(row[1] || ""),
            organization: String(row[2] || ""),
            role: String(row[3] || "Client"),
            eventName: String(row[4] || ""),
            rating: Number(row[5]) || 5,
            feedback: String(row[6] || ""),
            publicConsent: true,
            submittedAt: String(row[0] || "")
          });
        }
      }

      // Reverse so newest appears first
      publicFeedbacks.reverse();

      return ContentService.createTextOutput(JSON.stringify(publicFeedbacks))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ready" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
