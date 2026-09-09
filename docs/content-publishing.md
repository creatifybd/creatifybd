# Publishing Bengali content on Hostinger

The public site is built from `src/data/publishedRelease.json`. It does not subscribe to editable Firestore documents. React renders the complete Bengali page during the build and hydrates that same release in the browser. This removes the old English fallback → asynchronous Bengali replacement and prevents a visitor's cached Firestore document from changing the published copy.

Firestore remains the CMS draft store and the operational store for inquiries, orders and payments. A CMS save is a **draft**, not an immediate public edit. The administration banner explains this change. Three SMM offers supply the hero, pricing, comparison and WhatsApp text from the same numeric records.

## Release contract

- `id` is a unique, immutable `bn-...` identifier. Change it whenever prepared content changes.
- Locale is `bn-BD`. `contentVersion` is a positive integer; use an increasing value.
- Keep the four service IDs and three offer IDs stable. Adding a service type requires an intentional navigation/schema update.
- Approved records contain only public fields. Do not copy payment configuration, provider credentials or CRM data into the release.
- Home shows at most 12 unique featured positions. New artworks are marked `concept`; client projects require `clientPermission: true`.
- Only approved reviews with a source URL can be exported. Existing unverifiable reviews and team profiles are not deleted or silently presented as verified.
- New image versions need new filenames. The deployment retains older hashed bundles for open tabs and rollback.

`src/data/releaseSchema.js` rejects missing Bengali headline copy, old English content, duplicate IDs, invalid prices, unsafe URLs, accidental secret fields and unsupported categories. `normalizeLegacyContent` maps `about_trust.lead` → `subtitle` and `ceo_note` → `ceo_quote`; normalization is not a translation or approval step.

## Local checks

Use Node 22 and Java 21. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run content:validate
npm test -- --run
npm run test:rules
npm run build
```

Rules and migration integration tests use only the `demo-creatifybd` emulators. `--emulator` is accepted by the publication script only with the exact checked-in localhost emulator address; it never selects the production project. Production commands reject an accidentally inherited emulator environment.

`build` generates 18 public routes, Bengali account shells, sitemap and a manifest, then checks headings, language, release identity, image references, visible initial content and public dependency budgets. The public dependency graph must exclude Firebase and administration modules. Image/font/HTML bytes are separate from the JavaScript/CSS budget.

## First production publication

The main-branch workflow now fails **before any Hostinger upload** when authenticated Firebase deployment access is missing. Do not remove that check to make a deployment green.

1. Add the protected GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT_JSON` for Firebase project `creatify-bd`. Use a dedicated deployment identity with the Firestore data and Firebase Rules permissions it needs. Do not use an Owner credential or commit the JSON file. The job writes it only to a temporary, restricted file and removes it afterward.
2. Keep the existing FTP and `VITE_FIREBASE_*` settings. `VITE_RECAPTCHA_SITE_KEY` is the public reCAPTCHA v3 site key; configure and verify App Check in Firebase Console. Its enforcement state cannot be inferred from this repository.
3. Confirm the Storage service identity has the cross-service Firestore access required for `firestore.get/exists` in Storage Rules. A first-time permissions prompt must be completed by the Firebase project administrator before non-interactive rule deployment can succeed. See [Firebase's rule conditions documentation](https://firebase.google.com/docs/storage/security/rules-conditions).
4. Review the build and draft diff in the PR, and check responsive layouts in a reachable browser/staging environment. Merge only after deployment prerequisites and that visual review are complete.

The workflow runs checks, stores a recoverable build artifact, prepares the immutable Firestore release, prints the database plan, deploys tested rules, uploads assets, then uploads HTML and cache rules. It verifies the release marker on **every public route** before synchronizing the editable collections and activating `settings/publishing`.

Hostinger and Firestore have no shared transaction. Each public page therefore uses its own built snapshot throughout the session. A partial FTP upload may temporarily serve different release versions on different URLs, but a page does not replace its copy from a database listener. If publication fails, the workflow is red and must be investigated; do not claim an atomic cross-service deployment.

## Later CMS edits

1. Save changes in the administration screens. Content drafts carry their base release ID and revision. Content, portfolio and pricing saves detect concurrent edits instead of silently replacing a newer revision.
2. With explicitly configured Firebase credentials, export the draft to a **new file**, using a new release ID:

```sh
npm run content:export -- --id bn-YYYYMMDD-02 --out next-release.json
```

3. Review that file against `src/data/publishedRelease.json`: Bengali wording, numeric offer scope, asset files, client permission, feature order, source links and any removals. The exporter refuses an outdated content base, missing core service/offer draft, hidden core service, or invalid content. It never overwrites the approved file automatically.
4. Replace the committed snapshot with the reviewed file, run checks and open a PR. The main-branch workflow publishes it after merge.

Creating an immutable release before discovering a draft conflict reserves that ID. If the approved content then changes, choose a new ID. Do not edit `site_releases/{id}` manually.

## Sync behavior and recovery

Manual production commands require `FIREBASE_SERVICE_ACCOUNT_JSON` or an explicit `GOOGLE_APPLICATION_CREDENTIALS` file for the correct project. They do not search developer CLI caches.

```sh
npm run content:prepare
npm run content:plan
npm run sync:firebase          # dry-run; no content writes
npm run sync:firebase -- --apply
```

Sync changes only `settings/site`, `settings/content`, `settings/content_draft`, the release pointer and the public service/pricing/portfolio mirrors. Unrelated settings are retained. Unknown old service/pricing/portfolio records are marked hidden and unpublished, preserving their original data. Orders, payments, messages, CRM, team and reviews are not rewritten.

Each changed document gets a create-only backup under `content_release_backups/{releaseId}/documents/{encodedPath}`. The backup contains its prior state and expected replacement. Transactions compare original update times. A final transaction reads back the changed records before setting the active pointer. A differing unpublished content draft stops the plan before writes. The successfully published draft is rebased onto the new release.

If an editor changes a document while sync is running, sync stops. Earlier batches may have committed; their backups remain. The public site remains pinned to the deployed snapshot. Review the conflicting draft and backup; retry only if the desired records are unchanged, otherwise create a new reviewed release. Repeated successful sync is a no-op. Create-only backups intentionally prevent reusing an old release to overwrite a later edit.

For recovery, prefer a **forward release**: take the previous approved snapshot from Git or `site_releases`, assign a new ID/version, review any newer drafts, rebuild, deploy and sync through the same checks. For an urgent rendering failure, redeploy the previous complete build artifact (assets first, HTML second); because its copy is embedded, it can serve independently of the current CMS state. Do not force-sync the wrong release just to change the pointer.

Exact database restoration is an administrator operation: inspect each backup, compare the current record with `expectedAfter`, and restore only matching records with update-time preconditions. A record with newer edits needs manual reconciliation. Never bulk-delete collections or restore the whole database over new orders/payments. The original backups must remain immutable. There is deliberately no unguarded “reset everything” command.

The retired `sync-*` seeders now stop with instructions. Opening the Portfolio screen no longer writes hundreds of defaults; its refresh action reads drafts only.

## Hostinger cache and route checks

`public/.htaccess` serves `/route/index.html` before legacy flat exports, redirects known old `.html`/catalog URLs, revalidates HTML, caches versioned JS/CSS, and returns a Bengali shell for account routes. Missing routes return HTTP 404. Keep old hashed assets while their HTML may still be cached or held in open tabs; remove them only in a separate reviewed retention cleanup.

After deployment, verify HTML `Cache-Control`, the release marker, direct-route refreshes, valid 404 status, form success/failure, image loading and App Check. Check 320, 360, 390, 412, 768, 1024, 1440 and 1920px layouts, 200% text zoom, keyboard focus, the mobile menu and image dialog. Measure LCP, INP and CLS on representative Android and iOS devices. A passing build is not a substitute for these checks.

## Remaining operational work

Historical AI provider keys were embedded in old source and have been removed from the current modules/scripts. Rotate/revoke them at the provider; deleting current literals does not invalidate copies in Git history or old deployed bundles. The existing admin tool still supports keys supplied by the administrator in that browser. A protected server-side AI integration is a separate follow-up, not an accomplished part of this release.

Newsletter and inquiry writes now have validated rules and private reads. Client-side cooldown/honeypot behavior is not a server-enforced rate limit. Verify App Check enforcement and add a trusted submission endpoint/rate limiting if abuse requires it. Existing order-token and payment-upload contracts have not been redesigned here.

References: [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [Firebase rule tests](https://firebase.google.com/docs/rules/unit-tests), [FTP deployment action](https://github.com/SamKirkland/FTP-Deploy-Action).
