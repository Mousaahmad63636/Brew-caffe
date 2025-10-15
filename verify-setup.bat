@echo off
echo =====================================
echo Firebase Setup Verification
echo =====================================
echo.

echo Checking dependencies...
call npm list firebase firebase-admin 2>nul
if %errorlevel% neq 0 (
    echo ❌ Firebase dependencies not installed
    echo Run: npm install firebase firebase-admin
    goto :end
) else (
    echo ✅ Firebase dependencies installed
)

echo.
echo Checking environment file...
if exist .env.local (
    echo ✅ .env.local exists
    
    findstr "FIREBASE_PROJECT_ID=" .env.local >nul
    if %errorlevel% equ 0 (
        echo ✅ Firebase project ID configured
    ) else (
        echo ❌ Firebase project ID missing
    )
    
    findstr "FIREBASE_CLIENT_EMAIL=" .env.local >nul
    if %errorlevel% equ 0 (
        echo ✅ Firebase client email configured
    ) else (
        echo ❌ Firebase client email missing
    )
    
    findstr "ADMIN_USERNAME=" .env.local >nul
    if %errorlevel% equ 0 (
        echo ✅ Admin username configured
    ) else (
        echo ❌ Admin username missing
    )
) else (
    echo ❌ .env.local file missing
    echo Run setup-firebase.bat first
)

echo.
echo Checking project structure...
if exist "services\firestoreService.js" (
    echo ✅ Firestore service exists
) else (
    echo ❌ Firestore service missing
)

if exist "lib\firebase.js" (
    echo ✅ Firebase configuration exists
) else (
    echo ❌ Firebase configuration missing
)

echo.
echo =====================================
echo Next: Start server with 'npm run dev'
echo Then test: http://localhost:3000/admin/login
echo =====================================

:end
pause
