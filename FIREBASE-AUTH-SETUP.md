# Firebase Authentication Setup Instructions

## 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing project (or create a new one)
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** provider
5. In **Authorized domains**, add your domain (localhost:3000 for development)

## 2. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. In **General** tab, scroll to **Your apps**
3. Select your web app or create a new one
4. Copy the Firebase configuration values

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# Firebase Client-side Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Create Admin User

1. Go to Firebase Console > Authentication > Users
2. Click **Add user**
3. Enter email and password for admin access
4. Or use the Firebase CLI: `firebase auth:import users.json`

## 5. Test Login

1. Start your development server: `npm run dev`
2. Navigate to `/admin/firebase-login`
3. Login with the email/password you created

## Important Notes

- Firebase Authentication replaces the previous NextAuth setup
- Admin routes are now protected by Firebase auth
- The login page is now at `/admin/firebase-login`
- Old `/admin/login` redirects to Firebase login

## Troubleshooting

- Ensure all environment variables are properly set
- Check Firebase Console for authentication errors
- Verify authorized domains include your development URL
- Make sure Authentication is enabled in Firebase Console
