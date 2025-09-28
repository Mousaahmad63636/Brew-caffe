@echo off
echo 🚀 Starting Da-Menuuu-Brew with new Firebase account...
echo.

echo 📋 Checking environment...
if not exist .env.local (
    echo ❌ .env.local file not found!
    echo Please ensure Firebase configuration is complete.
    pause
    exit /b 1
)

echo ✅ Environment file found
echo.

echo 🔧 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo 🧪 Testing Firebase connection...
node test-firebase.js
if %errorlevel% neq 0 (
    echo ❌ Firebase connection test failed
    echo Please check your .env.local configuration
    pause
    exit /b 1
)

echo ✅ Firebase connection successful
echo.

echo 🌐 Starting development server...
echo.
echo 📍 Access your application:
echo   - Public Menu: http://localhost:3000
echo   - Admin Dashboard: http://localhost:3000/admin
echo.
echo 🔑 Admin Credentials:
echo   - Username: brewadmin
echo   - Password: BrewCaffe2025!Secure
echo.

npm run dev
