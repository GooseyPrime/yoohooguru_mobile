# YooHoo Guru – Website Functions & Content (Merged Spec)

## Part A — Original (verbatim from websitefunctionsandcontent.txt)
feat(core + marketplace): Wire CTAs, unify Firebase auth, ship Angel’s List MVP + SkillShare MVP
Why

Site renders, but core actions are disconnected or stubbed:

Home CTAs navigate inconsistently; some buttons alert instead of doing anything useful.

Users are asked to re-authenticate unnecessarily; duplicate account errors aren’t handled clearly.

Angel’s List and SkillShare screens are present but not functional: no real browse/apply/match integrations.

Onboarding/licensing requirements exist but aren’t enforced in flows.

This PR lands a minimum working marketplace:

(0) Wire CTAs and route shells properly.

(1) Unify Firebase auth across pages; consistent error handling.

(2) Angel’s List MVP: create/browse/apply + simple featured placement.

(3) SkillShare MVP: skill discovery, suggestions, and basic AI matches, with profile skill data kept current.

Scope
0) Wire primary CTAs and routes (no dead buttons)

Front-end (React Router v6)

Ensure Home tiles do what they say:

“Explore Angel’s List →” → /angels-list (not an alert).

“Explore Skills” → /skills.

Convert any “Book Now” alerts on Angel’s List to real flows:

“View Angels” → category filtered listing view inside AngelsListPage.

“Apply Now” (private) → opens application sheet/modal; if not authenticated, redirect to Login → back to job.

Confirm Header nav links and hero buttons navigate via client routing (no full reloads): frontend/src/components/Header.js, frontend/src/screens/HomePage.js.

Acceptance

Clicking each CTA reaches the correct screen without full page reloads.

Browser back/forward works correctly.

No alerts for primary flows; actions either navigate or open a real form.

1) Unify auth/session & error handling (Firebase; no mock paths in prod)

Behavioral contract

Single sign-in (Firebase client) persists across all pages (including Angels ↔ Skills) without re-prompts.

Authorization to backend: include Authorization: Bearer <idToken> on API calls (aligns with backend/src/middleware/auth.js).

Rehydration: on reload, AuthContext restores the Firebase user and refreshes ID token; protected actions wait for auth ready.

Error mapping (frontend):

auth/email-already-in-use → “This email is already registered. Try signing in instead.”

auth/wrong-password or auth/invalid-credential → “Email or password is incorrect.”

Network/unexpected → “We couldn’t reach the server. Please try again.”

No mocking in prod: honor FIREBASE_NO_MOCKING_POLICY.md & FIREBASE_IMPLEMENTATION_SUMMARY.md (already in repo). Frontend must not fall back to mock auth when envs are set.

Front-end tasks

frontend/src/contexts/AuthContext.js

Ensure production path refuses mocks and actually uses Firebase env (the file already validates; enforce same UX in SPA).

Provide getIdToken() helper; all API clients import it to send Authorization: Bearer.

Expose currentUser, loading, and signIn/signUp/signOut with friendly error codes (map Firebase errors to UX).

Back-end tasks

Auth middleware already expects Bearer token (backend/src/middleware/auth.js); ensure all new routes use requireAuth or optionalAuth correctly.

CORS: rely on getCorsOrigins in backend/src/config/appConfig.js; make sure front-end origin is set at deploy time.

Acceptance

Sign-in once → navigate Skills ↔ Angels ↔ Dashboard with no re-auth.

Reload on a protected action (e.g., apply) resumes smoothly.

Sign-up with existing email yields email-exists copy + single-click switch to sign-in.

2) Angel’s List MVP (jobs/rentals)

Routes/APIs (existing)

Create job: POST /api/angels/jobs (private)

Browse jobs: GET /api/angels/jobs?category=&city=&page=&limit= (public)

Get job: GET /api/angels/jobs/:jobId (public)

Apply to job: POST /api/angels/jobs/:jobId/apply (private)

Poster applications: GET /api/angels/jobs/:jobId/applications (private, owner only)

Update application: PUT /api/angels/jobs/:jobId/applications/:applicantId (owner)

Mark complete: PUT /api/angels/jobs/:jobId/complete (owner)

My activity: GET /api/angels/my-activity (private)

Front-end integrations

frontend/src/screens/AngelsListPage.js

Replace local arrays + alerts with real list from GET /api/angels/jobs.

Filters: category, city, price range (UI scope minimal but wired).

Card CTAs:

View Details → drawer/modal shows job (GET /api/angels/jobs/:jobId).

Apply Now (auth required) → POST .../apply; if not authed, redirect to Login, then back to job.

Badges: surface Verified/License/Insurance if present in user profile (see below).

Create listing (MVP surface)

From Angels page, “Post a Listing” (auth required) → wizard (title, description ≥240 chars, category, city/ZIP, hourly/fixed price).

Enforce prohibited/regulated categories and doc requirements before allowing submission.

Onboarding & Enforcement

Use existing onboarding flow (frontend/src/screens/onboarding/*) to collect ID, licenses, insurance, payout (if relevant).

Gate creation/application if category requires docs:

If missing → block action with tooltip + link to Onboarding Requirements/Documents.

If expired → disable apply/post with actionable error; prompt re-upload.

Prohibited tasks list and independent contractor acknowledgment must be displayed during application (copy block in modal).

(Repo includes liability components; use them in the apply flow.)

Featured placement (MVP)

Add simple boolean featured on job:

Front-end: “Feature this listing” upsell (Stripe Checkout link stub).

Back-end: persist featured and sort featured jobs to top (simple weight).

Acceptance

Users can post jobs in allowed categories; prohibited categories blocked at UI + API.

Jobs browse with filters; details drawer loads.

Users can apply; posters can review/manage applications.

Docs/insurance requirement is enforced at creation/apply time.

Featured listings pin above non-featured in the category.

3) SkillShare MVP (Skill Sharing Marketplace)

Routes/APIs (existing)

Browse skills: GET /api/skills?category=&city=&limit=&offset=

Skill detail: GET /api/skills/:skillName

Autocomplete: GET /api/skills/suggestions/autocomplete?search=&limit=

Matches for user: GET /api/skills/matches/:userId?limit=&minScore=

Exchange pairs (analysis): GET /api/skills/exchange-pairs?limit=&minScore=

Front-end integrations

frontend/src/screens/SkillsPage.js

Load categories (via getSkillCategoriesForDisplay) and popular skills (API).

Wire search to autocomplete endpoint; selecting a suggestion filters the list.

“Find a teacher”/“Learn this” actions → if private action, gate on auth; otherwise show recommended profiles from matches.

Surface AI match results (use GET /api/skills/matches/:userId with minScore and limit controls); display match score and why (the API returns matchDetails you can summarize).

Profile skill management

Ensure POST/PUT /api/auth/profile (already in backend/src/routes/auth.js) supports updating skillsOffered / skillsWanted so matches reflect user intent.

Acceptance

Skills page loads popular skills and supports typed autocomplete.

Users can set skills offered/wanted in profile; matches update within the session.

Matches panel renders with score and explanatory bullets (from matchDetails).

Private actions (contact/apply/book) require sign-in and route correctly.

Cross-cutting: Profiles, Docs, Payout, and Liability

Profiles: GET/PUT /api/auth/profile stores skillsOffered, skillsWanted, location, availability, badges.

Documents: onboarding screens capture ID, licenses, insurance; badge states shown on list cards (both Angels & Skills).

Payouts: keep Stripe Connect pieces staged in the account area (frontend/src/screens/account/PayoutsPanel.js), but do not block unpaid-only flows for MVP where not required.

Liability / Terms banners: inject disclosure blocks into Apply and any booking/engagement confirmation step (the repo includes a liability demo component; reuse its content/format).

Analytics (name exactly; ship from both hubs)

cta_click { label: "explore_angels" | "explore_skills", page: "/" }

list_view { hub: "angels" | "skills", category, city, total }

job_created { jobId, category, city, featured }

job_applied { jobId, category, city }

skills_autocomplete { query, hits }

matches_viewed { userId, returned, minScore }

onboarding_block { where: "angels_create|angels_apply|skills_action", reason: "missing_license|missing_insurance|expired_doc" }

auth_error { code: "email_exists|wrong_password|network|unknown" }

Accessibility & UX Quality

All CTAs and toggles are keyboard-operable; focus states visible (keep repo’s outlines).

Route transitions update document titles (e.g., “Angel’s List – Yoohoo Guru”, “SkillShare – Yoohoo Guru”).

Auth/Apply modals announce errors via an aria-live="assertive" region.

Avoid layout shifts on auth rehydration; show a brief skeleton if absolutely needed.

Config & Environments

Frontend

Firebase env must be real in prod/staging (no demo/mocks). See FIREBASE_IMPLEMENTATION_SUMMARY.md and guarded checks in AuthContext.

Optional (later): map/hero background keys (Unsplash/Maps), but keep disabled unless provided.

Backend

Confirm CORS origins via getCorsOrigins() for your deploy hosts.

Rate limiting stays enabled (src/index.js) to protect new endpoints.

Firebase Admin initialized at boot; project IDs must pass the anti-mock checks.

QA Checklist (must pass)

CTAs & Routing

Home → “Explore Angel’s List” → /angels-list.

Home → “Explore Skills” → /skills.

Header links for Angels/Skills work; back/forward works; no full reloads.

Auth

Sign in once → navigate Angels ↔ Skills ↔ Dashboard with no re-auth.

Sign up using existing email → see email already registered message + switch to login.

Refresh on /angels-list and /skills retains auth state; protected actions wait until AuthContext.loading=false.

Angel’s List

Create listing in allowed category; prohibited categories blocked with clear message.

Browse shows live data from API; filters affect results.

View Details shows real job data; Apply Now posts to /apply.

Poster can view/manage applications; completing a job updates status.

SkillShare

Skills page loads popular skills; autocomplete returns suggestions.

Updating profile skills changes matches; matches display score + “why”.

Private actions correctly gate on sign-in and then continue flow.

Docs/Badges

Missing/expired documents block gated actions with actionable copy and link to Onboarding.

No console errors during any of the above.

Rollout

Configure Firebase env for front and back (no emulator/mock strings in prod/staging).

CORS: add deployed front-end origin(s) to CORS_ALLOWED_ORIGINS or equivalent.

Seed categories (if needed) via backend/src/scripts/seedCategories.js.

Feature flags: leave booking, skillListing, userProfiles true; keep experimental flags off.

Deploy backend → then frontend.

Risks & Mitigations

Auth token handling: ensure every private API call sends Authorization: Bearer <idToken>; add a retry on token refresh.

Docs enforcement regressions: limit scope to apply/create gates; log blocked attempts for quick triage.

Traffic spikes on GET /api/angels/jobs: paginate (page, limit) and cache category lists.

Out of Scope (tracked for next PR)

Location-aware homepage background (Unsplash/landmark) and integrated map with privacy jitter & tag pins (stubs exist in HomePage).

Real-time chat, advanced reviews, certifications, org tools.

Advertiser slot registry and targeting.

Exchanges booking/escrow UI (the /api/exchanges is placeholder; we’re focusing on apply/match first).

Definition of Done

A user can:

Explore Angel’s List and SkillShare via working CTAs.

Sign in once and move across hubs seamlessly.

Create an Angel’s List listing (if allowed) and apply to others.

Browse SkillShare skills, use autocomplete, and see AI-ranked matches based on their profile skills.

Encounter clear, enforced rules for prohibited/regulated work and missing docs.

Do all of the above without mock services and with production-safe Firebase config.

---
## Part B — Additional Information (verbatim from additionalinfo.txt)
Standard Subdomain Architecture Template
Each subdomain (e.g., outdoors.yoohoo.guru, cooking.yoohoo.guru) will be a self-contained microsite built from the following page templates. The key is that all data displayed (gurus, skills, blog posts) is dynamically filtered by the backend based on the subdomain the user is visiting.

1. Global Elements (Consistent Across a Single Subdomain)
Header:

Logo: A themed version of the YooHoo Guru logo (e.g., outdoors.yoohoo.guru might have a logo with a mountain or tree).

Navigation: Home | Find a Guru | Learn a Skill | Blog | About

User Actions: Login / Signup / My Dashboard.

Footer:

Links to the main yoohoo.guru site, other subdomains, Terms of Service, Privacy Policy, and social media.

Theming: Colors, fonts, and imagery will be unique to the subdomain's category to create an immersive experience.

2. Page Specifications & User Experience
Each subdomain will have the following core pages:

A. Homepage (/) - The Welcome Mat
Function: To instantly communicate the purpose of the subdomain and guide users to key actions.

Content & UX:

Hero Section: A large, high-quality background image or video relevant to the category (e.g., a crackling campfire for outdoors).

Headline: "Master the Wilderness."

Sub-headline: "Learn essential outdoor skills from seasoned experts."

Primary CTA: A prominent "Find Your Guru" search bar.

Featured Skills: Visually appealing cards showcasing popular sub-categories (e.g., on outdoors, cards for "Marksmanship," "Survival," "Fishing"). Clicking a card takes the user to that specific skill page.

Featured Gurus: A horizontally scrolling carousel of top-rated or new gurus in that category, building trust and showcasing talent.

"How it Works" Section: A simple 3-step graphic explaining the process: Find, Book, Learn.

Featured Blog Posts: Cards linking to the 2-3 most recent blog articles, demonstrating fresh content and expertise.

B. Learn a Skill (/skills & /skills/{sub-category}) - The Guided Discovery
Function: To provide a clear, drill-down path for users to discover specific skills without being overwhelmed.

Content & UX:

Main Skills Page (/skills): Displays the main sub-categories as large, clickable cards (e.g., outdoors.yoohoo.guru/skills shows cards for "Wilderness Skills," "Marksmanship," "Recreation").

Sub-Category Page (/skills/marksmanship):

Header: "Marksmanship Skills"

Content: A grid of cards for the individual skills within that sub-category (e.g., "Archery," "Firearms Safety," "Skeet Shooting"). Each card shows the skill name, a brief description, and the number of available gurus.

Action: Clicking a specific skill (e.g., "Archery") takes the user to the main /gurus page, pre-filtered to show only Archery gurus.

C. Find a Guru (/gurus) - The Directory
Function: To allow users to browse, filter, and find the perfect instructor.

Content & UX:

Main View: A grid or list of Guru profile cards. Each card displays:

Profile Picture

Name & Tagline (e.g., "Certified Archery Instructor")

Star Rating

Primary Skills

Starting Rate (e.g., "$50/hr")

Filtering & Sorting (Sidebar):

Filter by Skill: (Dropdown menu, pre-filled if coming from a skill page).

Filter by Location: (Enter city or zip).

Filter by Availability: (Date picker).

Filter by Price Range: (Slider).

Sort by: Top Rated, Most Reviews, Price (Low to High).

D. Blog (/blog & /blog/{post-title}) - The Content Hub
Function: To capture organic search traffic, establish authority, and provide value to users. This is where your make.com content will live.

Content & UX:

Blog Listing Page (/blog):

A clean, modern layout (like a grid or list) of all blog posts for that subdomain.

Each entry shows a feature image, title, author, date, and a short excerpt.

A sidebar can feature "Popular Posts" and blog categories.

Individual Blog Post Page (/blog/{post-title}):

Layout: Clean, readable typography with a large feature image at the top.

Content: The full article generated by your make.com scenario.

Engagement: Social share buttons and a comment section.

Internal Linking: The post should naturally link to relevant skill pages or guru profiles on the subdomain to drive conversions.

Specific Example: handyman.yoohoo.guru
This subdomain is special because it serves a two-sided marketplace. The structure will be slightly different.

Homepage (/):

Hero Section: A clear choice for the user:

A large button on the left: "Find a Pro" (for people who need help).

A large button on the right: "Find a Job" (for handymen).

Pages:

/find-a-pro: This is the Guru Directory from the template above, but framed as finding a service provider. Filters would include "Service Needed" (Plumbing, Electrical, etc.).

/find-a-job: This is the Angel's List. It's a directory of job postings with filters for job type, location, and budget.

/blog: Will feature content like "5 DIY Fixes for a Leaky Faucet" or "When to Call a Professional Electrician."

This structure ensures a logical, intuitive, and highly functional experience that is perfectly tailored to each niche, all while being powered by a consistent and scalable technical architecture.

---
## Part C — Integrated Insights from the Standard Subdomain Architecture (applied where unique/useful)
The following points are integrated to enrich structure and UX while staying consistent with the repo’s naming (SkillShare, Angel’s List) and routing. These are additive notes to guide Copilot and reviewers:
- Each **subdomain** (e.g., `outdoors.yoohoo.guru`, `cooking.yoohoo.guru`) should keep the same core IA but filter content dynamically by subdomain, including Gurus, Skills, and Blog posts. Use themed logo/branding per subdomain.
- **Homepage (per subdomain):** prominent hero, “Find Your Guru” search, featured skills, featured gurus carousel, mini “How it works,” and latest blog posts to demonstrate freshness and drive internal linking.
- **Learn a Skill (/skills):** surface sub-categories as large cards; drill into `/skills/{sub-category}` to reveal specific skills with counts, then deep-link to pre-filtered Guru directory.
- **Find a Guru (/gurus):** directory with profile cards (photo, tagline, rating, key skills, starting rate) and robust filters (skill, location/ZIP, availability, price range) plus sorting (rating, reviews, price).
- **Blog:** grid/list with feature images, date, author; post pages should link contextually back to relevant skills or gurus to improve conversion.
- For **handyman.yoohoo.guru**, offer a split-CTA hero (“Find a Pro” vs “Find a Job”), mapping to the directory vs. Angel’s List respectively.

These patterns align with your existing hubs: **SkillShare** (skills discovery/matching) and **Angel’s List** (jobs/rentals), and can be rolled out to category-specific subdomains without forking core logic. (See citation in the chat body.)
