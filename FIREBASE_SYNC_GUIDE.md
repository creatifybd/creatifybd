# Firebase Data Sync Guide

## Overview

This project uses Firebase Firestore as the **single source of truth** for all website content. This ensures that:
- Admin dashboard updates immediately reflect on the live website
- No conflicts between codebase and Firebase data
- Consistent data across all components

## Data Flow

```
┌─────────────────┐
│  Codebase       │
│  (Defaults)     │
└────────┬────────┘
         │
         │ sync:firebase script
         ▼
┌─────────────────┐
│  Firebase       │◄─────────┐
│  Firestore      │          │
│  (Source of     │          │
│   Truth)        │          │
└────────┬────────┘          │
         │                   │
         │ onSnapshot        │ Admin Dashboard
         ▼                   │ Updates
┌─────────────────┐          │
│  SettingsContext│──────────┘
│  (Real-time)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  All Components │
│  (Display Data) │
└─────────────────┘
```

## Proper Workflow

### 1. Updating Content via Admin Dashboard (Recommended)

**Use this for day-to-day content updates:**

1. Go to `/admin` in your browser
2. Navigate to the section you want to edit (e.g., Site Control Center)
3. Make changes using the form fields or JSON editor
4. Click "Save Changes" or "Publish Site Content"
5. Changes immediately sync to Firebase
6. All website components automatically update via SettingsContext

**No code changes needed - Firebase is the source of truth.**

### 2. Updating Codebase Defaults

**Use this when you want to change the default structure or initial values:**

1. Update default values in:
   - `src/pages/admin/ContentManager.jsx` (defaultContent object)
   - `src/config/siteConfig.js` (siteConfig object)
2. Run the sync script to update Firebase:
   ```bash
   npm run sync:firebase
   ```
3. This will:
   - Read defaults from codebase
   - Merge with existing Firebase data (preserves your changes)
   - Update Firestore with merged data
   - Only update missing fields, not overwrite existing data

### 3. Initial Setup

**First time setup or after major codebase changes:**

1. Download Firebase service account key:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `firebase-service-account.json` in project root
   - ⚠️ **Never commit this file to git** (already in .gitignore)

2. Run the sync script:
   ```bash
   npm run sync:firebase
   ```

3. This will initialize Firestore with all default values from codebase

## Data Locations

### Firestore Collections

- **settings/content** - Homepage content, visibility, sections
- **settings/site** - Brand settings, colors, contact info
- **settings/payment** - Payoneer, DBBL, trade license details

### Codebase Files

- **src/pages/admin/ContentManager.jsx** - Default content structure
- **src/config/siteConfig.js** - Default site configuration
- **src/context/SettingsContext.jsx** - Real-time Firebase listener

## Troubleshooting

### Issue: Changes not showing on website

**Solution:**
1. Check browser console for Firebase errors
2. Verify SettingsContext is loading (check Network tab)
3. Ensure Firebase rules allow read access
4. Try hard refresh (Ctrl+Shift+R)

### Issue: Admin dashboard shows old data

**Solution:**
1. Check if Firebase has the latest data
2. Run sync script: `npm run sync:firebase`
3. This will merge codebase defaults with Firebase data

### Issue: Conflict between codebase and Firebase

**Solution:**
1. Firebase is always the source of truth
2. Admin dashboard updates Firebase directly
3. Codebase defaults are only used as fallbacks
4. Run sync script to align defaults with Firebase

### Issue: Sync script fails

**Solution:**
1. Ensure `firebase-service-account.json` exists in project root
2. Verify the file has correct permissions
3. Check that you have Firestore write permissions
4. Ensure firebase-admin is installed: `npm install firebase-admin --save-dev`

## Best Practices

1. **Always use Admin Dashboard** for content updates
2. **Only update codebase defaults** for structural changes
3. **Run sync script** after updating codebase defaults
4. **Never manually edit Firebase** - use admin dashboard
5. **Keep service account key secure** - never commit to git
6. **Test changes** in preview before publishing

## Technical Details

### SettingsContext

The `SettingsContext` uses Firebase's `onSnapshot` for real-time updates:

```javascript
const unsubContent = onSnapshot(doc(db, 'settings', 'content'), (snap) => {
  if (snap.exists()) setContent(snap.data());
});
```

This means:
- Components automatically receive updates when Firebase changes
- No manual refresh needed
- Changes propagate instantly across the app

### Merge Strategy

The sync script uses a smart merge strategy:

```javascript
function mergeData(existing, defaults) {
  // Preserves existing data
  // Only updates missing fields
  // Deep merges nested objects
}
```

This ensures:
- Your Firebase changes are never overwritten
- Only new fields from codebase are added
- Existing data remains intact

## Security Notes

- Firebase service account key has full admin access
- Keep it secure and never share it
- Already added to .gitignore
- Consider using environment variables for production
- Firestore rules control public read access
- Admin authentication controls write access
