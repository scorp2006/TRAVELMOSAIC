# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `tripmosaic` (or your choice)
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

## Step 2: Enable Services

### Firestore Database
1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Choose "Start in **test mode**" (we'll add security rules later)
4. Select location (closest to your users)
5. Click "Enable"

### Authentication
1. In Firebase Console → Build → Authentication
2. Click "Get started"
3. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google**:
   - Click "Google"
   - Toggle "Enable"
   - Enter support email
   - Click "Save"

### Storage
1. In Firebase Console → Build → Storage
2. Click "Get started"
3. Start in **test mode**
4. Choose same location as Firestore
5. Click "Done"

### Functions (Optional for now)
- We'll set this up in Phase 5 for AI generation

## Step 3: Get Firebase Config

1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" → Click Web icon (</>)
3. Register app:
   - App nickname: "TripMosaic Web"
   - Don't check "Firebase Hosting" yet
   - Click "Register app"
4. **Copy the firebaseConfig object**

## Step 4: Add Config to Project

1. In your project, create `.env` file in root:
   ```bash
   cp .env.example .env
   ```

2. Paste your Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=tripmosaic-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tripmosaic-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=tripmosaic-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
   ```

3. **Add `.env` to `.gitignore`** (already done)

## Step 5: Test Authentication

1. Start dev server: `npm run dev`
2. Go to Login page
3. Try signing up with email/password
4. Check Firebase Console → Authentication → Users to see new user

## Security Rules (We'll add in Phase 2)

Firestore and Storage are currently in test mode - **anyone can read/write**.
We'll add proper security rules when implementing trip collaboration features.

---

## Troubleshooting

### "Firebase config not found"
- Make sure `.env` file exists in project root
- Restart dev server after adding `.env`

### "Email already in use"
- User already exists, try login instead

### "Operation not allowed"
- Email/Password or Google auth not enabled in Firebase Console

---

Ready to build! 🚀
