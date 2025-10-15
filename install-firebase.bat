@echo off
echo Installing Firebase dependencies...
npm uninstall googleapis
npm install firebase@^10.7.1 firebase-admin@^12.0.0
echo.
echo Firebase dependencies installed successfully!
echo.
echo Next steps:
echo 1. Set up Firebase project at https://console.firebase.google.com/
echo 2. Enable Firestore Database
echo 3. Create service account and download credentials
echo 4. Update .env.local with Firebase configuration
echo 5. Run: npm run dev
echo.
pause
