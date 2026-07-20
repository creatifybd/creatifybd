# CreatifyBD Admin Dashboard Redesign — Handoff Prompt for Continuation

Paste everything below into your new IDE / AI coding assistant to continue this work.

---

## Project Context

This is **CreatifyBD** (github.com/binashad7-bit/creatifybd), a React + Vite + Firebase digital agency website. I'm in the middle of **Phase 3: a comprehensive redesign of the admin dashboard** — a top-class professional/creative/user-friendly UX overhaul, missing feature coverage, and RBAC (role-based access control). Everything must be **English-only** and use a **premium light theme** everywhere (no dark theme remnants anywhere in `/admin` or `/login`).

Tech stack: React (JS, not TS), Vite, Firebase (Firestore + Auth, no Cloud Functions/Admin SDK — everything is client-side), react-hot-toast for notifications, lucide-react for icons, framer-motion for animation, react-helmet-async for SEO tags.

## Already Completed (do NOT redo this — verify it's present, then build on top of it)

1. **RBAC system**:
   - `src/context/AuthContext.jsx` — fetches role from Firestore `admins/{lowercased-email}` doc; falls back to a `LEGACY_OWNER_EMAILS` array for pre-existing owner accounts that don't yet have an `admins` doc.
   - `src/components/ProtectedRoute.jsx` — shows a light-themed "Access restricted" screen when a non-owner tries to access an owner-only route; supports a `requireOwner` prop.
   - `firestore.rules` — has `isLegacyOwner()`, `isRegisteredAdmin()`, `adminRole()`, `isOwner()`, `isEditorOrAbove()` helper functions and rules for the new `admins` collection.
   - `src/pages/admin/AdminUsers.jsx` (NEW) — owner-only page to add/remove/change roles of admin users. **Important limitation**: since there's no Cloud Functions/Admin SDK, new admins must have a Firebase Auth account created manually via the Firebase Console *before* they can be added to the `admins` collection here. This page just manages the Firestore `admins/{email}` documents (role assignment), not Auth account creation.
   - `src/pages/AdminDashboard.jsx` — added "Case Studies" and "Admin Users" nav items, gated to owner role only; logout now uses a confirm modal instead of `window.confirm`.

2. **Case Studies feature** (new admin CRUD + public wiring):
   - `src/pages/admin/CaseStudiesManager.jsx` (NEW) — full CRUD over Firestore `case_studies/{id}` docs. Curated (built-in) case studies from static data can be edited/hidden (not deleted); fully custom ones can be deleted. Edit modal covers about/challenge/solution/results/testimonial/hero image/color fields.
   - `src/pages/public/CaseStudiesPage.jsx` and `src/pages/public/CaseStudyPage.jsx` — merge Firestore `case_studies` overrides with static `detailedCaseStudies` data via `onSnapshot`, filtering out `hidden` items, and supporting fully custom (non-curated) entries.

3. **Global confirm modal + toast system** (replacing all `window.confirm`/`window.alert`):
   - `src/context/ConfirmContext.jsx` (NEW) — provides a `useConfirm()` hook returning a promise-based confirm dialog: `const ok = await confirm({ title, description, confirmLabel, tone: 'danger' })`. This must be wrapped around the app (check `src/App.jsx` — it should already be wired in as a provider).
   - Every admin page has been converted from `window.confirm`/`alert` to `useConfirm()` + `toast` (react-hot-toast): `Settings.jsx`, `Services.jsx`, `Messages.jsx`, `PricingManager.jsx`, `MediaLibrary.jsx`, `Portfolio.jsx`, `AdminReviews.jsx`, `Overview.jsx`.

4. **Light theme conversion**:
   - `src/pages/Login.jsx` — fully converted from dark (#0f0f0f page, #161616 card, #1a1a1a inputs) to a premium light theme matching the public site (white card, light gray inputs, `var(--adm-*)`-style hex equivalents since Login is outside the admin CSS scope).
   - `src/pages/admin/PricingManager.jsx` — was rewritten with a heavy dark-theme modal (previously used `#111`/`#333`/white text); now fully light-themed using `var(--adm-*)` CSS variables and matches the rest of the admin UI. Also gained a tabbed category view (Social/Branding/Web/Video), a "Seed Data" button for first-time setup, and an "Most Popular"/"Hidden" plan badge system.
   - `src/pages/admin/Testimonials.jsx` — converted from dark inline styles to light theme (`var(--adm-txt)`, `var(--adm-dim)`, `var(--adm-red-soft)`), and gained a search box + bulk select/hide/delete toolbar (`adm-search-box`, `bulk-action-bar` CSS classes — these are defined in `src/admin.css`).

5. **Bulk actions + search** added to:
   - `src/pages/admin/Testimonials.jsx` (search + bulk hide/delete)
   - `src/pages/admin/Portfolio.jsx` (search + bulk hide/show/delete-custom-only; curated items can only be hidden, never deleted, matching the Case Studies pattern)

6. **Page-level SEO overrides** (new lightweight feature):
   - `src/hooks/usePageSEO.js` (NEW) — a hook that reads `settings.page_seo[pageKey]` (from `SettingsContext`) and falls back to a page's hardcoded default `{title, description}` if the admin hasn't set an override.
   - `src/pages/admin/Settings.jsx` — added a "Page SEO Overrides" section with per-page title/description override fields for: Home, Services, Portfolio, Pricing, About, Contact, Reviews. Stored under `settings.page_seo.{pageKey}.{title|description}` in the `settings/site` Firestore doc.
   - Wired `usePageSEO()` into: `src/pages/Home.jsx`, `src/pages/public/ServicesPage.jsx`, `src/pages/public/PortfolioPage.jsx`, `src/pages/public/PricingPage.jsx`, `src/pages/public/AboutPage.jsx`, `src/pages/public/ContactPage.jsx`, `src/pages/public/ReviewsPage.jsx`.

7. **New/added CSS** in `src/admin.css`:
   - `.adm-search-box` — the search input pill used across admin list pages.
   - `.adm-tab-btn` / `.adm-tab-btn.active` — tab buttons (used in PricingManager's category tabs).
   - (Pre-existing) `.bulk-action-bar`, `.admin-btn-danger`, `.admin-card`, `.admin-input`, `.admin-btn-primary`, `.admin-btn-secondary`, `.admin-icon-btn`, `.adm-modal-overlay`, `.adm-page-header`, `.adm-page-title`, `.adm-page-desc`, `.setting-label` — all light-theme, all using CSS custom properties prefixed `--adm-*` (defined at the top of `admin.css`, themed off `--brand-red`, `--ink`, `--muted`, etc.)

All of the above has been **pushed to the `main` branch of `github.com/binashad7-bit/creatifybd`** already (via the GitHub Contents API, one file at a time). Pull the latest `main` before continuing.

## What Still Needs To Be Done

Please work through this list in order. After each numbered item, do a quick self-check (does it build/typecheck, does it visually match the light theme, does it follow the existing patterns above) before moving to the next.

### 1. Verify the pushed state and get the app running
- Clone/pull the latest `main` branch.
- Run `npm install` (or `pnpm install` if the project has switched to pnpm) and start the dev server.
- Confirm the admin dashboard loads at `/admin`, login works, and there are no console errors related to `ConfirmContext`, `AuthContext`, or `usePageSEO`.
- Double check `src/App.jsx` wraps the app in `<ConfirmProvider>` (or whatever it's named) — if it's missing, every `useConfirm()` call in admin pages will throw. Add the provider if it's not there.

### 2. QA pass on everything listed as "Already Completed" above
Since none of this was manually tested in a live browser (only reviewed via code), please:
- Log in as an owner account and confirm: Case Studies nav item and Admin Users nav item are visible; log in as a non-owner (editor) role and confirm they are hidden, and that navigating directly to `/admin/case-studies` or `/admin/users` shows the "Access restricted" screen (via `requireOwner` on `ProtectedRoute`).
- Test the Admin Users page: adding an existing Firebase Auth user's email with a role, changing a role, removing a user. Confirm Firestore security rules actually enforce this (try mutating `admins/{email}` as a non-owner directly via the console/devtools and confirm it's rejected).
- Test Case Studies CRUD: edit a curated case study, hide it (confirm it disappears from the public Case Studies list and detail page), create a fully custom one, delete the custom one (confirm curated ones can't be permanently deleted, only hidden).
- Test every "Delete"/"Reset"/"Seed" action across Settings, Services, Messages, PricingManager, MediaLibrary, Portfolio, AdminReviews, Overview — confirm the custom confirm modal appears (not a native browser `confirm()`), is light-themed, and works correctly on both confirm and cancel.
- Test Portfolio search + bulk actions (select multiple, bulk hide, bulk show, bulk delete — confirm curated items are skipped/protected in bulk delete).
- Test Testimonials search + bulk actions similarly.
- Verify Login.jsx renders correctly in light theme with no leftover dark-theme flashes.
- Verify PricingManager's category tabs, "Seed Data" flow (only shows when the `pricing` collection is empty), and the "Most Popular"/"Hidden" badges render correctly.
- Test the new Page SEO Overrides section in Settings: set an override for one page (e.g. Home), save, reload the actual public page, and use browser devtools or view-source to confirm the `<title>` and meta description reflect the override. Then clear the override and confirm it falls back to the default.

### 3. Extend bulk actions + search to remaining list-based admin pages
`Testimonials.jsx` and `Portfolio.jsx` already have search + bulk select/hide/delete. Apply the **same pattern** (same CSS classes: `adm-search-box`, `bulk-action-bar`, same `useConfirm()`-gated bulk delete that protects curated/built-in items) to:
- `src/pages/admin/AdminReviews.jsx` (reviews list)
- `src/pages/admin/Messages.jsx` (contact messages list — bulk mark-as-read/unread + bulk delete)
- `src/pages/admin/MediaLibrary.jsx` (media assets grid — bulk delete)
- Any other list/grid-style admin page not yet covered (check `AdminGigs.jsx`, `AdminOrders.jsx`, `ContentManager.jsx`, `PaymentVerification.jsx` — these were NOT touched in this phase and may still have `window.confirm`/dark theme leftovers or be missing search/bulk actions entirely. **Audit these four files first** — grep for `window.confirm` and `alert(` and for dark hex colors like `#111`, `#161616`, `#1a1a1a`, `rgba(255,255,255,` to find anything missed).

### 4. Full dark-theme audit across the entire `/admin` and `/login` surface
Run a repo-wide search for these patterns and fix any remaining hits (convert to the `var(--adm-*)` system used everywhere else):
```
grep -rn "window.confirm\|alert(" src/pages/admin src/pages/Login.jsx src/pages/AdminDashboard.jsx
grep -rn "#0f0f0f\|#161616\|#1a1a1a\|#111\b\|rgba(255,255,255," src/pages/admin src/pages/Login.jsx src/pages/AdminDashboard.jsx src/components/admin
```
Fix anything the grep turns up that wasn't already covered above. Pay special attention to `AdminGigs.jsx`, `AdminOrders.jsx`, `ContentManager.jsx`, and `PaymentVerification.jsx`, which were not part of this session's scope.

### 5. Missing feature coverage — items still not built
- **Page-level SEO for remaining pages**: the `usePageSEO` hook + Settings UI currently covers Home, Services, Portfolio, Pricing, About, Contact, Reviews. Extend `page_seo` keys/UI/wiring to any other indexable public pages that exist (e.g. individual `ServiceCategoryPage.jsx`, `GigsCatalogPage.jsx`, `TeamPage.jsx`, `LegalPage.jsx`/`PrivacyPolicyPage.jsx`, `ProcessPage.jsx`) if they have hardcoded `<SEO>` props and would benefit from admin overrides.
- **Audit trail / activity log**: there is currently no record of who (which admin) performed which action (e.g. who hid a portfolio item, who deleted a review). Consider adding a lightweight `activity_log` Firestore collection written to on key mutations (delete, hide, role change), and an admin page to view it (owner-only). This was flagged as a "missing feature" in the original redesign brief but not started.
- **Dashboard analytics on Overview.jsx**: check whether the Overview page has real, useful stats (message count, portfolio count, testimonials count, average review rating, pending orders if applicable) or if it's still mostly a "seed demo data" utility page. If it's thin, add real at-a-glance KPI cards using the light theme + `admin-card` styling.
- **Responsive/mobile QA for the admin dashboard**: this phase focused on desktop admin UX. Do a pass on mobile/tablet breakpoints for the admin sidebar, tables/grids, and modals — confirm nothing overflows or is unusable on a phone-width viewport.
- **Accessibility pass**: confirm all icon-only buttons (`admin-icon-btn`) have `aria-label` or `title` attributes, confirm modal focus trapping/`Escape`-to-close works on `ConfirmContext` and all custom modals (PricingManager's form modal, Portfolio's form modal, CaseStudiesManager's edit modal), and confirm color contrast in the light theme meets WCAG AA (especially `var(--adm-dim)` text on white backgrounds).

### 6. Final verification before considering Phase 3 done
- Run the project's lint/build command and fix any errors or warnings introduced by this session's changes.
- Re-grep for any remaining `window.confirm`/`alert(` anywhere under `src/` (not just `admin`) to be safe.
- Do a full manual click-through of every admin nav item as both an owner and a non-owner test account.
- Commit and push to `main` once everything above is verified working.

## Key Conventions to Follow (do not deviate)
- **No native `window.confirm`/`window.alert`/`window.prompt`** anywhere in admin code — always use `useConfirm()` from `src/context/ConfirmContext.jsx` for confirmations and `toast` from `react-hot-toast` for feedback messages.
- **No dark theme** anywhere in `/admin` or `/login` — always use the `--adm-*` CSS custom properties defined in `src/admin.css` (e.g. `var(--adm-txt)`, `var(--adm-dim)`, `var(--adm-bg)`, `var(--adm-border)`, `var(--adm-red)`, `var(--adm-danger)`) rather than hardcoded dark hex values.
- **English-only** UI copy in the admin dashboard (the public site has bilingual EN/BN content in some places — that's intentional and should NOT be changed — but admin-only UI must stay English).
- **Curated/built-in content can be hidden but not permanently deleted**; fully custom content created via the admin can be deleted. This pattern is already established in Portfolio, Testimonials, and Case Studies — follow it for any new content type.
- **No Cloud Functions / Firebase Admin SDK** — this project only has client-side Firestore/Auth. Any "admin creates a new admin" flow is necessarily limited to assigning a role to an *existing* Firebase Auth account (created manually via Firebase Console), not creating the Auth account itself.
- Reuse existing shared admin CSS classes (`admin-card`, `admin-btn-primary`, `admin-btn-secondary`, `admin-btn-danger`, `admin-icon-btn`, `admin-input`, `setting-label`, `adm-page-header`, `adm-page-title`, `adm-page-desc`, `adm-search-box`, `bulk-action-bar`, `adm-tab-btn`, `adm-modal-overlay`) instead of inventing new ad hoc styles, to keep the dashboard visually consistent.
