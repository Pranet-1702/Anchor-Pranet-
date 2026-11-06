# Anchorr Pranet — Professional Anchor & Emcee Portfolio

Official portfolio and booking website for **Pranet Bhosale (Anchorr Pranet)** — professional anchor, master of ceremonies (emcee), and stage presenter trusted across Maharashtra and India for collegiate festivals, national hackathons, high-profile institutional convocation & foundation ceremonies, alumni reunions, and corporate technical seminars.

---

## 🌟 Features & Highlights

- **Luxury Visual Identity**: Bespoke dark aesthetic (`#0a0a0c`, `#111118`) with champagne gold accents (`#d4af37`, `#f4e8d1`), typography, glassmorphism, and responsive design.
- **Dual Direct Booking Workflow**:
  1. **Google Form Booking**: Direct 1-click booking via official Google Form modal/new tab.
  2. **WhatsApp Booking**: Direct 1-click booking via WhatsApp (`+91 7391035544`) with formatted pre-filled event inquiry details.
- **Verified Portfolio & Experience**:
  - Umang Annual Social Gathering 2024–25 (Winner: Best Anchor Award)
  - 12th Foundation Day Ceremony (Chief Guest Hon. Ganesh Shinde)
  - Spectrax 2K26 National Technical Summit (VIT Pune)
  - Breaking Enigma: 24-Hour National Hackathon (Enigma 4.0 powered by Unstop)
  - Three-Days State Level Entrepreneurship & Startup Development Program (MSME, Skill India, Khadi India)
  - MILAAP Alumni Meet (2024 & 2025 Editions)
  - Nimbus Technical Festival & 11th Foundation Day (Hon. Yajurvendra Mahajan)
  - Tally Prime Professional Seminar & Technical Orientation
  - Code Apex Hackathon & Tech Arena
  - Codeverse 24-Hours Hackathon
- **Interactive Lightbox Gallery**: Categorized photo showcase (All, Stage, Formal, Hackathons, Felicitations) with full-screen preview.
- **Interactive Feedback System**: Multi-criteria star ratings and testimonials submission with local persistence and Firestore sync.
- **Direct Contact & Socials**: Quick links to WhatsApp, Phone, Email, Instagram, and LinkedIn.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port indicated in your terminal).

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/                  # Static assets & photography
│   └── assets/aistudio/     # Verified high-resolution event & stage photos
├── src/
│   ├── components/          # Modular React components
│   │   ├── About.tsx        # Bio, credentials, and stage philosophy
│   │   ├── Achievements.tsx # State awards, golden trophies & certificates
│   │   ├── BookingModal.tsx # Booking overview & direct booking options
│   │   ├── ContactSection.tsx # Contact channels, direct booking, and details
│   │   ├── EventsSection.tsx  # Chronological verified event milestones
│   │   ├── FeedbackModal.tsx  # Client & attendee review submission form
│   │   ├── FeedbackSection.tsx # Verified testimonials display & rating summary
│   │   ├── Footer.tsx       # Brand footer, quick links, and credits
│   │   ├── GallerySection.tsx # Interactive filtered gallery & lightbox
│   │   ├── Hero.tsx         # Headline, stage stats, and primary booking CTAs
│   │   ├── Navbar.tsx       # Responsive sticky luxury navigation header
│   │   └── ServicesSection.tsx # Hosting formats (Festivals, Hackathons, Galas)
│   ├── config/              # Centralized configuration (Google Form, WhatsApp)
│   ├── data/                # Structured event data, achievements & gallery photos
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Root app component
│   ├── index.css            # Tailwind & styling rules
│   └── main.tsx             # Application entry point
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## 📞 Contact Information

- **Name**: Pranet Bhosale
- **Phone / WhatsApp**: +91 7391035544
- **Email**: pranetbhosale@gmail.com
- **Instagram**: [@anchorrpranet](https://instagram.com/anchorrpranet)
- **LinkedIn**: [linkedin.com/in/pranet-bhosale](https://linkedin.com/in/pranet-bhosale)
- **Base Location**: Pune & Maharashtra, India (Available Nationwide)
