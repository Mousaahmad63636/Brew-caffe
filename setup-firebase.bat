@echo off
echo =====================================
echo Firebase Setup - Online Menu Project
echo =====================================
echo.

echo Step 1: Installing Firebase dependencies...
call npm uninstall googleapis
call npm install firebase@^10.7.1 firebase-admin@^12.0.0

echo.
echo Step 2: Creating environment file...
if not exist .env.local (
    copy .env.local.example .env.local
    echo .env.local created from template
) else (
    echo .env.local already exists
)

echo.
echo =====================================
echo Installation Complete!
echo =====================================
echo.
echo NEXT STEPS:
echo.
echo 1. Create Firebase Project:
echo    https://console.firebase.google.com/
echo    - Create new project
echo    - Enable Firestore Database (test mode)
echo    - Generate service account key
echo.
echo 2. Update .env.local with Firebase credentials:
echo    - FIREBASE_PROJECT_ID
echo    - FIREBASE_PRIVATE_KEY_ID  
echo    - FIREBASE_PRIVATE_KEY
echo    - FIREBASE_CLIENT_EMAIL
echo    - FIREBASE_CLIENT_ID
echo.
echo 3. Change admin credentials in .env.local:
echo    - ADMIN_USERNAME
echo    - ADMIN_PASSWORD
echo    - NEXTAUTH_SECRET (generate strong secret)
echo.
echo 4. Start development server:
echo    npm run dev
echo.
echo 5. Test admin login:
echo    http://localhost:3000/admin/login
echo.
echo See Firebase Setup Guide for detailed instructions.
echo.
pause
