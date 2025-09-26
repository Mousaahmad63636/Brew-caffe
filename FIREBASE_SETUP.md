# Better Menu - Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `better-menu-[your-name]`
4. Continue through setup (Google Analytics optional)

## Step 2: Enable Required Services

### Enable Firestore Database
1. In Firebase Console → Build → Firestore Database
2. Click "Create database" 
3. Start in **production mode** (we'll add security rules)
4. Choose your region (closest to your users)

### Enable Authentication  
1. In Firebase Console → Build → Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### Enable Storage (Not Required - We Use Base64)
**Note:** Better Menu uses client-side image compression and base64 storage, so Firebase Storage is not required. Images are compressed to 400×400px and stored directly in Firestore as optimized base64 data.

This saves costs and simplifies deployment while keeping excellent image quality.

## Step 3: Get Firebase Configuration

1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon (`</>`)
4. App nickname: `better-menu-web`
5. Register app
6. Copy the firebaseConfig object

## Step 4: Configure Environment Variables

1. In your project, copy `.env.local.example` to `.env.local`
2. Replace the placeholder values with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# NextAuth (generate a random secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-32-character-secret-key
```

## Step 5: Set Firestore Security Rules

1. In Firebase Console → Firestore Database → Rules tab

2. Replace existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to menu items and categories
    match /menuItems/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 6: Test Firebase Connection

Run the development server:
```bash
npm run dev
```

1. Visit `http://localhost:3000` 
2. Check browser console for any Firebase errors
3. You should see the menu interface (empty initially)

## Next: Create Admin User & Test Features

Let me know when you've completed the Firebase setup and I'll guide you through testing!
