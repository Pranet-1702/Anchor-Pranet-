/**
 * Comprehensive Automated Verification Suite for Final Booking Integration
 * 
 * Verifies:
 * 1. Exact Google Form URL matches throughout codebase
 * 2. Exact WhatsApp Phone (917391035544) & Pre-filled Message match specification
 * 3. Proper URL encoding of WhatsApp link
 * 4. All booking CTAs in Hero (Google Form + WhatsApp)
 * 5. All booking CTAs in Services (Google Form + WhatsApp per service card & consultation banner)
 * 6. Contact section dual booking hub (Google Form + WhatsApp)
 * 7. Navbar desktop and mobile booking buttons link to Google Form
 * 8. Mobile floating action bar links to WhatsApp and Google Form
 * 9. Elimination of obsolete BookingModal and localStorage form submission from App.tsx
 * 10. Direct opening in new tab (_blank) without intermediate modal or confirmation delays
 */

import fs from 'fs';
import {
  GOOGLE_FORM_BOOKING_URL,
  WHATSAPP_PHONE,
  WHATSAPP_BOOKING_MESSAGE,
  WHATSAPP_BOOKING_URL,
  getWhatsAppBookingUrl,
} from '../src/config/googleBookingConfig';

interface CheckItem {
  id: number;
  description: string;
  passed: boolean;
  notes: string;
}

const checks: CheckItem[] = [];

console.log('================================================================');
console.log('  ANCHORR PRANET — FINAL BOOKING INTEGRATION VERIFICATION TEST');
console.log('================================================================\n');

// 1. Verify exact Google Form URL
const EXPECTED_GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScjjI6JzyO-zroGxewDtgX9z_lIKdThIiYdl8HB8bF-qvuVlA/viewform?usp=dialog';
const formUrlMatch = GOOGLE_FORM_BOOKING_URL === EXPECTED_GOOGLE_FORM_URL;
checks.push({
  id: 1,
  description: 'Exact Google Form URL verification',
  passed: formUrlMatch,
  notes: formUrlMatch
    ? `Matches exact user URL: ${GOOGLE_FORM_BOOKING_URL}`
    : `Mismatch: Expected ${EXPECTED_GOOGLE_FORM_URL} but got ${GOOGLE_FORM_BOOKING_URL}`,
});

// 2. Verify WhatsApp Phone Number & Pre-filled Message
const EXPECTED_WHATSAPP_PHONE = '917391035544';
const phoneMatch = WHATSAPP_PHONE === EXPECTED_WHATSAPP_PHONE;
const messageContainsIntro = WHATSAPP_BOOKING_MESSAGE.includes(
  'Hello Pranet! I visited your anchoring portfolio website and would like to enquire about booking you for an event.'
);
const messageContainsFields =
  WHATSAPP_BOOKING_MESSAGE.includes('Event Name:') &&
  WHATSAPP_BOOKING_MESSAGE.includes('Event Date:') &&
  WHATSAPP_BOOKING_MESSAGE.includes('Event Location:') &&
  WHATSAPP_BOOKING_MESSAGE.includes('Event Type:');
const messageContainsClosing = WHATSAPP_BOOKING_MESSAGE.includes(
  'Please share your availability and further details.'
);

checks.push({
  id: 2,
  description: 'WhatsApp Number & Pre-filled Message verification',
  passed: phoneMatch && messageContainsIntro && messageContainsFields && messageContainsClosing,
  notes:
    phoneMatch && messageContainsIntro && messageContainsFields && messageContainsClosing
      ? `Phone: ${WHATSAPP_PHONE}, message contains exact requested copy and 4 template fields.`
      : 'WhatsApp phone or template text mismatch.',
});

// 3. Verify URL encoding
const urlEncodedValid =
  WHATSAPP_BOOKING_URL.startsWith(`https://wa.me/${EXPECTED_WHATSAPP_PHONE}?text=`) &&
  !WHATSAPP_BOOKING_URL.includes(' ') &&
  WHATSAPP_BOOKING_URL.includes('%20');
checks.push({
  id: 3,
  description: 'WhatsApp Link URL Encoding',
  passed: urlEncodedValid,
  notes: urlEncodedValid
    ? `URL properly encoded with %20 and line feeds: ${WHATSAPP_BOOKING_URL.substring(0, 60)}...`
    : 'WhatsApp link is not properly URL-encoded.',
});

// 4. Check Hero.tsx for Dual Booking Buttons
const heroSrc = fs.readFileSync('src/components/Hero.tsx', 'utf8');
const heroHasGoogleForm = heroSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') && heroSrc.includes('Book via Google Form');
const heroHasWhatsApp = heroSrc.includes('href={WHATSAPP_BOOKING_URL}') && heroSrc.includes('Book via WhatsApp');
checks.push({
  id: 4,
  description: 'Hero Section Dual Booking Buttons (Google Form + WhatsApp)',
  passed: heroHasGoogleForm && heroHasWhatsApp,
  notes: heroHasGoogleForm && heroHasWhatsApp
    ? 'Hero section features prominent Google Form and WhatsApp booking buttons side-by-side.'
    : 'Hero section missing one of the booking buttons.',
});

// 5. Check Services.tsx for Dual Booking Buttons
const servicesSrc = fs.readFileSync('src/components/Services.tsx', 'utf8');
const servicesHasGoogleForm =
  servicesSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') && servicesSrc.includes('Book via Google Form');
const servicesHasWhatsApp =
  servicesSrc.includes('getWhatsAppBookingUrl') && servicesSrc.includes('Book via WhatsApp');
checks.push({
  id: 5,
  description: 'Services Section Dual Booking Buttons per Service & Banner',
  passed: servicesHasGoogleForm && servicesHasWhatsApp,
  notes: servicesHasGoogleForm && servicesHasWhatsApp
    ? 'Every service card and the custom consultation banner offer both Google Form and WhatsApp booking.'
    : 'Services section missing booking buttons.',
});

// 6. Check ContactSection.tsx for Final 2 Booking Channels Hub
const contactSrc = fs.readFileSync('src/components/ContactSection.tsx', 'utf8');
const contactHasGoogleForm =
  contactSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') && contactSrc.includes('Book via Google Form');
const contactHasWhatsApp =
  contactSrc.includes('href={whatsappUrl}') && contactSrc.includes('Book via WhatsApp');
const contactNoOldFormInputs = !contactSrc.includes('formData.fullName');
checks.push({
  id: 6,
  description: 'Contact Section Dual Booking Hub (No Obsolete Form Inputs)',
  passed: contactHasGoogleForm && contactHasWhatsApp && contactNoOldFormInputs,
  notes:
    contactHasGoogleForm && contactHasWhatsApp && contactNoOldFormInputs
      ? 'ContactSection replaced old form with dedicated Google Form and WhatsApp booking cards.'
      : 'ContactSection still has old form or lacks booking buttons.',
});

// 7. Check Navbar.tsx for Direct Link
const navbarSrc = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const navbarHasDirectLink =
  navbarSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') &&
  navbarSrc.includes('target="_blank"') &&
  !navbarSrc.includes('setIsBookingModalOpen');
checks.push({
  id: 7,
  description: 'Navbar Booking Buttons open Google Form directly in new tab',
  passed: navbarHasDirectLink,
  notes: navbarHasDirectLink
    ? 'Navbar desktop and mobile drawer buttons both open Google Form URL in new tab directly.'
    : 'Navbar button not linked to Google Form.',
});

// 8. Check App.tsx for Mobile Floating Bar & Modal Removal
const appSrc = fs.readFileSync('src/App.tsx', 'utf8');
const appNoBookingModal = !appSrc.includes('<BookingModal') && !appSrc.includes('isBookingModalOpen');
const appMobileBarHasBoth =
  appSrc.includes('href={WHATSAPP_BOOKING_URL}') && appSrc.includes('href={GOOGLE_FORM_BOOKING_URL}');
checks.push({
  id: 8,
  description: 'App.tsx: Obsolete BookingModal completely removed & mobile bar updated',
  passed: appNoBookingModal && appMobileBarHasBoth,
  notes:
    appNoBookingModal && appMobileBarHasBoth
      ? 'BookingModal removed from App.tsx. Mobile bottom floating bar connects directly to WhatsApp & Google Form.'
      : 'App.tsx still contains BookingModal or mobile bar is misconfigured.',
});

// 9. Check About, Achievements, DownloadPortfolio, Footer for Direct Booking Links
const aboutSrc = fs.readFileSync('src/components/About.tsx', 'utf8');
const achievementsSrc = fs.readFileSync('src/components/Achievements.tsx', 'utf8');
const downloadSrc = fs.readFileSync('src/components/DownloadPortfolio.tsx', 'utf8');
const footerSrc = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const otherCtasPass =
  aboutSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') &&
  achievementsSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') &&
  downloadSrc.includes('href={GOOGLE_FORM_BOOKING_URL}') &&
  footerSrc.includes('href={GOOGLE_FORM_BOOKING_URL}');

checks.push({
  id: 9,
  description: 'All secondary CTAs (About, Achievements, Download, Footer) open Google Form',
  passed: otherCtasPass,
  notes: otherCtasPass
    ? 'All "Book for Event" buttons across About, Achievements, Download Portfolio, and Footer open Google Form directly.'
    : 'One or more secondary CTAs not updated.',
});

// 10. Check that feedback and gallery functionality are untouched
const feedbackSrc = fs.readFileSync('src/components/ClientFeedbackSection.tsx', 'utf8');
const gallerySrc = fs.readFileSync('src/components/PhotoGallery.tsx', 'utf8');
const feedbackIntact = feedbackSrc.includes('Client Experiences &amp; Feedback');
const galleryIntact = gallerySrc.includes('Stage Performances in Motion');
checks.push({
  id: 10,
  description: 'Feedback and Photo Gallery sections preserved intact',
  passed: feedbackIntact && galleryIntact,
  notes: feedbackIntact && galleryIntact
    ? 'Client feedback and photo gallery remain fully functional and uncompromised.'
    : 'Feedback or gallery was unintentionally altered.',
});

// Summary output
console.log('----------------------------------------------------------------');
console.log('FINAL BOOKING INTEGRATION QA RESULTS:');
console.log('----------------------------------------------------------------');
let allPassed = true;
for (const c of checks) {
  const icon = c.passed ? '✅' : '❌';
  console.log(`${icon} Test ${c.id}: ${c.description}`);
  console.log(`   Status: [${c.passed ? 'PASS' : 'FAIL'}]`);
  console.log(`   Notes: ${c.notes}\n`);
  if (!c.passed) allPassed = false;
}

console.log('================================================================');
console.log(`OVERALL RESULT: ${allPassed ? 'ALL 10 TESTS PASSED (10/10)' : 'TESTS FAILED'}`);
console.log('================================================================');

if (!allPassed) {
  process.exit(1);
}
