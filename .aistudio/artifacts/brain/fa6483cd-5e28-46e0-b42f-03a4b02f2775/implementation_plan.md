# Implementation Plan: Secure Admin Panel & CMS for Anchorr Pranet

## 1. User Decisions & Architectural Alignment
Based on requirements and clarified preferences:
- **Database Initialization:** Pre-populate Supabase database with all existing portfolio data, verified events, categories, achievements, services, personal info, and photo records from `src/data/portfolioData.ts`.
- **Admin Authentication:** Supabase Auth using email and password, strictly whitelisted to `pranetbhosale@gmail.com`. Public registration and signup endpoints are disabled. Session persistence with auto-refresh and route guards.
- **Offline / Unconfigured Public Resilience:** If Supabase is unreachable, unconfigured, or empty, the public website gracefully falls back to the existing built-in static data (`portfolioData.ts`), guaranteeing 100% uptime for portfolio visitors.
- **Image & Asset Storage:** Supabase Storage bucket (`portfolio-media`) for newly uploaded high-res event images, certificates, and thumbnails, with multi-file drag-and-drop, automated slugging, and instant preview. Existing `/assets/aistudio/*` images remain supported.

---

## 2. Core Concept & Security Model
The Anchorr Pranet Admin Panel is a high-performance, single-tenant CMS embedded directly in the application at `/admin` (with public portfolio remaining at `/`).

### Security Architecture:
1. **Frontend Authentication Guard:**
   - Client checks active Supabase Auth session via `AdminAuthContext`.
   - Explicit email verification: `user.email?.toLowerCase() === 'pranetbhosale@gmail.com'`. Any other authenticated email is immediately logged out and shown an "Unauthorized Access" screen.
   - Route switcher in `App.tsx` handles `/admin` cleanly without full-page reloads, supporting browser history and deep linking.
2. **Database-Level Row Level Security (RLS):**
   - Tables: `events`, `gallery_images`, `gallery_categories`, `gallery_videos`, `achievements`, `services`, `feedbacks`, `site_settings`, `contact_inquiries`.
   - **Public (anon):** Read-only `SELECT` access on published items (`is_published = true`). Unauthenticated visitors can only `INSERT` new feedback (status: `pending`) and contact messages.
   - **Admin (authenticated):** `ALL` (Insert, Select, Update, Delete) restricted by checking `auth.jwt() ->> 'email' = 'pranetbhosale@gmail.com'`.
3. **Storage Security:**
   - Storage bucket `portfolio-media`: Public read access for images; authenticated write/delete restricted to admin.

---

## 3. UX & Visual Design (Luxury Black & Gold Theme)
Adhering to the established portfolio identity and frontend design standards:
- **Color Palette:**
  - Background: Deep obsidian `#070709` and dark card surface `#0d0d12` with subtle golden borders (`border-[#d4af37]/20`).
  - Accents: Metallic gold gradient `linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #aa771c 100%)`.
  - Typography: Serif accent headers (Cinzel/Playfair feel), crisp sans-serif metrics and labels (Inter/Plus Jakarta Sans).
- **Navigation (12 CMS Modules):**
  1. **Overview / Dashboard:** Metric counters (Total Events, Gallery Photos, Videos, Pending Reviews, Unread Inquiries), quick action shortcuts, recent activity log.
  2. **Events & Experience:** Add/edit/delete events, categories, event dates, venues, attendee scale, highlights tags, cover images, and publish toggle.
  3. **Photo Gallery:** Multi-image upload to Supabase Storage, caption editor, aspect ratio tagging, category assignment, order sorting.
  4. **Video Gallery:** YouTube / Vimeo / Drive video embeds, titles, event tags, stage descriptions.
  5. **Achievements & Honors:** Awards, recognitions, years, issuing bodies, certificate photo URLs.
  6. **Testimonials Moderation:** Real-time feedback review (Pending, Approved, Rejected), rating filters, feature-on-homepage toggle.
  7. **About Me & Persona:** Biography paragraphs, key statistics (Events hosted, audience reach, years experience), stage persona highlights.
  8. **Services & Offerings:** Corporate, Wedding, Cultural, Sports anchoring packages, deliverables, bullet points.
  9. **Contact & Social Links:** Phone, WhatsApp number, email, Instagram, LinkedIn, YouTube, booking links.
  10. **Website Settings:** SEO meta tags, Google Form booking URL override, hero announcement banner toggle, maintenance mode.
  11. **Inquiries / Messages:** Viewer for messages submitted via the website contact form.
  12. **Sign Out:** Secure session termination and redirect.
- **Responsive Layout:**
  - Desktop: Collapsible gold-bordered sidebar with badge indicators and sticky top header.
  - Mobile & Tablet: Drawer menu with backdrop blur, full touch optimization, bottom action bars.

---

## 4. Architecture & Data Flow

```
                      +-----------------------------+
                      |   Visitor / Client Browser  |
                      +--------------+--------------+
                                     |
               Public URLs: /, /feedback
                                     v
                       +---------------------------+
                       |    Public Portfolio UI    |
                       | (Hero, Events, Gallery...)|
                       +-------------+-------------+
                                     |
                                     v
                       +---------------------------+
                       |  Dynamic Data Provider /  |
                       |       Custom Hooks        |
                       +------+-------------+------+
                              |             |
           (If Supabase Live) |             | (If Supabase Empty / Offline)
                              v             v
             +--------------------+    +----------------------+
             |  Supabase Database |    | Built-in Fallback    |
             |  (Read Published)  |    | (src/data/portfolio) |
             +--------------------+    +----------------------+

                                    ***

                      +-----------------------------+
                      |    Admin Browser (/admin)   |
                      +--------------+--------------+
                                     |
                          Route Guard & Auth Check
                                     v
                       +---------------------------+
                       |  AdminAuthContext & Login |
                       |  pranetbhosale@gmail.com  |
                       +-------------+-------------+
                                     |
                                     v
                       +---------------------------+
                       |     Admin Dashboard       |
                       |  (12 Management Modules)  |
                       +-------------+-------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
    +--------------------+                       +--------------------+
    | Supabase DB (CRUD) |                       |  Supabase Storage  |
    | (RLS Admin Policy) |                       | ('portfolio-media')|
    +--------------------+                       +--------------------+
```

---

## 5. Database Schema & Migration Script (`schema.sql`)

```sql
-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  year INT NOT NULL,
  location TEXT NOT NULL,
  attendees TEXT,
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Gallery Images Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT '3/4',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Video Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'Stage Highlights',
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Award',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  icon_name TEXT DEFAULT 'Mic',
  is_featured BOOLEAN DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Ensure Feedbacks Table (Enhanced for CMS Moderation)
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  organization TEXT,
  role TEXT NOT NULL,
  event_name TEXT,
  feedback TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  public_consent BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at TIMESTAMPTZ
);

-- 8. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT,
  event_date TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Create Site Settings Table (Key-Value)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Security Policies: Public Select for published content
CREATE POLICY "Public read published events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published images" ON public.gallery_images FOR SELECT USING (is_published = true);
CREATE POLICY "Public read categories" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Public read published videos" ON public.gallery_videos FOR SELECT USING (is_published = true);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read approved feedback" ON public.feedbacks FOR SELECT USING (status = 'approved' AND public_consent = true);
CREATE POLICY "Public insert pending feedback" ON public.feedbacks FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Public insert contact inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

-- Admin Full Access Policies (Restricted to pranetbhosale@gmail.com)
CREATE POLICY "Admin manage events" ON public.events FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage images" ON public.gallery_images FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage categories" ON public.gallery_categories FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage videos" ON public.gallery_videos FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage achievements" ON public.achievements FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage services" ON public.services FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage feedbacks" ON public.feedbacks FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL TO authenticated USING (auth.jwt()->>'email' = 'pranetbhosale@gmail.com') WITH CHECK (auth.jwt()->>'email' = 'pranetbhosale@gmail.com');
```

---

## 6. Implementation Stages (Rollout Plan)

### Stage 1: Database Types & Services Setup
- Define comprehensive TypeScript models in `src/types/admin.ts`.
- Enhance `src/lib/supabase.ts` with helper functions for:
  - Database seeding (one-click "Sync Initial Portfolio Data" inside admin).
  - Storage file upload to `portfolio-media` bucket with auto-generated clean URLs.
  - CRUD operations across all tables.
- Create ready-to-run SQL script accessible in admin settings for easy Supabase setup.

### Stage 2: Admin Authentication & Routing
- Create `src/context/AdminAuthContext.tsx` providing `user`, `session`, `isAdmin`, `login(email, password)`, `logout()`.
- Implement `AdminLogin.tsx` with a luxurious black-and-gold card, password visibility toggle, error states, and notice for authorized email only.
- Update `App.tsx` routing to recognize `/admin` and sub-paths, rendering the Admin Shell when navigating to `/admin`.

### Stage 3: Admin Layout & Navigation Shell
- Create `src/components/admin/AdminLayout.tsx`:
  - Gold-trimmed sidebar with active state highlights, smooth collapse, and icons for each of the 12 modules.
  - Header with current user badge (`pranetbhosale@gmail.com`), live preview shortcut (opens `/` in new tab), database connection indicator, and logout button.
  - Responsive mobile drawer for seamless smartphone access.

### Stage 4: Admin Management Modules (12 Modules)
1. **Dashboard Overview:** Key statistics cards, quick database seed button, recent reviews, and recent inquiries.
2. **Events Manager:** List view, modal for creating/editing events (all fields including image URL or direct file upload, highlights tag manager, date picker, category dropdown).
3. **Photo Gallery Manager:** Grid view with multi-file drag-and-drop uploader directly to Supabase Storage, inline title and category editor, delete modal, reorder controls.
4. **Video Gallery Manager:** YouTube video embed preview, add/edit/delete video links and stage descriptions.
5. **Achievements Manager:** Award title, organization, year, certificate upload, order adjustment.
6. **Testimonials Moderation:** Tabbed view (Pending / Approved / Rejected), single-click Approve/Reject, rating display, "Feature on Homepage" toggle.
7. **About Me Manager:** Bio editor, stats counter editor (events, audience, cities), stage persona bullet points.
8. **Services Manager:** Service packages editor, bullet points, featured badges.
9. **Contact & Social Manager:** Update phone number, WhatsApp booking number, email, social profile links.
10. **Website Settings Manager:** Google Form booking URL override, banner announcement text, SEO settings, database migration SQL copy helper.
11. **Inquiries Manager:** Inbox for direct contact messages, status toggles (New/Replied/Archived).
12. **Sign Out Handler:** Clears Supabase session and redirects safely.

### Stage 5: Public Website Dynamic Integration with Fallback
- Create custom React hooks: `usePortfolioData()` providing events, gallery images, videos, achievements, services, testimonials, and settings.
- Hook checks Supabase:
  - If Supabase returns records, use the live dynamic data.
  - If Supabase returns empty, is not configured, or experiences network disruption, immediately use `portfolioData.ts`.
- Connect `EventsExperience.tsx`, `PhotoGallery.tsx`, `Achievements.tsx`, `Services.tsx`, `About.tsx`, and `ClientFeedbackSection.tsx` to the hook.

### Stage 6: Build Verification & Testing
- Run `compile_applet` to verify TypeScript and build integrity.
- Verify zero runtime regressions on public homepage (`/`), feedback page (`/feedback`), Google Form booking links, and WhatsApp CTAs.
- Verify admin route (`/admin`) login flow, dashboard responsiveness, and data operations.
