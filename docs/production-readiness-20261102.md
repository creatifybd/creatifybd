# CreatifyBD production correction — 2 November 2026

Status: **NOT YET PRODUCTION READY — BLOCKERS REMAIN**. This document distinguishes verified local changes from production deployment. See GitHub Actions for the subsequent deployment result.

## Confirmed baseline

- Source baseline: main `f75a5b7631afa8e0f85dbfe25bc5325f1d9f5704`.
- Production HTML retrieved during this review still carried build timestamp `2026-09-07T19:35:31.512Z`; homepage and graphic-design route had the same H1/body. Production sitemap had 37 URLs.
- Last deployment run `34349860544` failed at Firebase credential preflight; no website upload occurred in that run.
- Public manifest reported 51,090 records. HEAD requests for two referenced data chunks returned HTTP 200/application-json. No contact records were downloaded for this verification or reproduced here.
- Historical files remain recoverable from the baseline commit; checksums/paths only are in `private-data-removal-manifest.json`. Git history was not rewritten. This also means historical public-repository exposure remains an owner remediation decision.

## Implemented

- Remove static CRM JSON exports and spreadsheet from current source/build; no production CRM records deleted. CRM reads authenticated Firestore only. Add data-directory deny rule and root deny rules for stale exports.
- Hostinger workflow contains legacy data before Firebase-dependent publication, backs up existing access rule, verifies denial using HEAD only, and later backs up current public pages/config before full publication. Retain old hashed assets for rollback. TLS certificate validation required.
- Release `bn-20261102-01`: broader Bangladesh-focused hero, eight selected homepage examples, service-first sequence, business needs and FAQ sections, restrained light About section.
- Four service pages now explain audience, deliverables, inputs, limitations, workflow, pricing approach and FAQs; sample/client/concept labels are explicit. Existing artwork preserved.
- Founder-led About/Team copy, improved policy presentation/privacy explanation; no fabricated clients, awards, metrics or registration. Existing commercial prices and refund/revision commitments preserved pending owner decisions.
- Contact supports optional business/budget/timeline, Bangladesh phone validation, in-flight duplicate guard, retained draft on error. Admin notes no longer falsely claim an outbound reply was sent. Newsletter removed; analytics disabled until a consent/measurement workflow exists.
- Legacy anonymous order-token portal replaced with direct support; records retained privately. Orders/payment proofs/CRM/drafts require admin access; admin email identities must be verified. This intentionally changes legacy portal access to protect internal notes/customer details.
- `/privacy-policy` permanently redirects to `/privacy`; unique page metadata/body/canonical checks and live route/status/cache/sitemap verification added.
- Security dependency updates and patched gRPC override; no force downgrade of Firebase.

## QA evidence

- 19 unit tests passed: validation, optional fields, in-flight duplicate submission, retry/success and error boundary/release tests.
- Six Firestore/Storage emulator scenarios passed, including unverified identity denial, private orders/CRM, notes permissions, allowed editor upload/denied anonymous upload, publication backup/archive/idempotency and preservation of unrelated records.
- Production build: 18 Bengali rendered routes (17 canonical pages + privacy alias); unique titles/descriptions/body for canonical pages; image/HTML checks passed. Final bundle values recorded in build output; roughly 104 KB gzip JS/CSS for homepage, excluding images/font/HTML.
- Cloud Chrome real layout checks used same-origin iframe viewport widths 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 across 17 public pages: 170 cases, no document horizontal overflow, all had H1 and no observed broken loaded images. This is desktop Chrome at varying layout widths, not real mobile-device testing or a full visual/contrast audit of every element.
- Browser interactions: mobile menu opens; portfolio packaging filter yields four cards; lightbox opens, next changes work, Escape closes; empty contact submission identifies three invalid fields without making a backend write.
- npm audit after updates: 0 critical, 0 high, 18 moderate dependency findings remain. Do not equate a clean high/critical count with a complete penetration test.
- Actual LCP/INP/CLS, throttled Lighthouse and real Android/iPhone results are unmeasured. No scores or lag-free claims.

## Outstanding release gates

1. Verify deployment completion/live release and all routes; GitHub commit/build success alone is insufficient.
2. Protected Firebase service-account credential, Storage cross-service IAM, App Check enforcement and a controlled production inquiry/admin readback must be verified. No live inquiry submitted during local QA.
3. Prices/scope, payment milestones/cancellation and conflicting legacy refund language need owner decision. See `pricing-decision-bn.md`; proposed scopes/prices were NOT applied.
4. Historical lead data and prior AI keys in Git history require owner-approved history remediation/provider key rotation; no force push or irreversible cleanup performed.
5. Real mobile-device/accessibility/performance QA and remaining moderate dependency review.
6. Genuine case studies/testimonials need approved project information; no invented case study results were added.

## Recovery

Use the workflow's pre-publication HTML/config artifact plus retained remote hashed assets for a reviewed restore. Preserve the new data access block during any rollback. Firestore content publishing creates document backups and uses update-time guards; follow `content-publishing.md` for forward recovery. Never restore public lead exports. Backups have 30-day artifact retention; archive needed rollback material privately before expiry.
