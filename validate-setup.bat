@echo off
echo 🧪 Da-Menuuu-Brew System Validation
echo =====================================
echo.

echo 📋 Checking project files...
if not exist .env.local (
    echo ❌ .env.local missing
    goto :error
)
if not exist lib\firebase.js (
    echo ❌ Firebase server config missing  
    goto :error
)
if not exist lib\firebaseClient.js (
    echo ❌ Firebase client config missing
    goto :error
)
echo ✅ All configuration files present
echo.

echo 🔐 Validating environment variables...
findstr /C:"brew-caffe-9c83f" .env.local >nul
if %errorlevel% neq 0 (
    echo ❌ Project ID not configured
    goto :error
)
findstr /C:"firebase-adminsdk-fbsvc" .env.local >nul  
if %errorlevel% neq 0 (
    echo ❌ Service account email not configured
    goto :error
)
echo ✅ Environment variables configured
echo.

echo 🔥 Testing Firebase connection...
node test-firebase.js
if %errorlevel% neq 0 (
    echo ❌ Firebase connection failed
    goto :error
)
echo.

echo ✅ ALL SYSTEMS READY!
echo.
echo 🎉 Your Da-Menuuu-Brew system is fully configured with Brew-Caffe Firebase account
echo.
echo 🚀 To start the application:
echo    ./start-brew-caffe.bat
echo.
echo 📱 URLs after starting:
echo    Public Menu: http://localhost:3000  
echo    Admin Panel: http://localhost:3000/admin
echo.
echo 🔑 Admin Login:
echo    Username: brewadmin
echo    Password: BrewCaffe2025!Secure
goto :end

:error
echo.
echo ❌ VALIDATION FAILED
echo Please check the configuration and try again.
pause

:end
