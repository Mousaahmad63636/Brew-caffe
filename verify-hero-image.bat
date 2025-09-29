@echo off
echo ================================
echo Hero Image Setup Verification
echo ================================
echo.

echo [1/4] Checking formidable package...
if exist "node_modules\formidable" (
    echo ✓ formidable is installed
) else (
    echo ✗ formidable NOT found
    echo   Run: npm install formidable
    goto :error
)
echo.

echo [2/4] Checking public/hero-images directory...
if exist "public\hero-images" (
    echo ✓ Hero images directory exists
) else (
    echo ✗ Directory NOT found - creating it...
    mkdir "public\hero-images"
    echo ✓ Created public\hero-images
)
echo.

echo [3/4] Checking Firebase client setup...
if exist "lib\firebaseClient.js" (
    echo ✓ Firebase client configuration exists
) else (
    echo ✗ Firebase client NOT found
    goto :error
)
echo.

echo [4/4] Checking service files...
if exist "services\heroImageService.js" (
    echo ✓ Hero image service exists
) else (
    echo ✗ Hero image service NOT found
    goto :error
)
echo.

echo ================================
echo ✓ All checks passed!
echo ================================
echo.
echo Your hero image feature is ready to use!
echo.
echo Next steps:
echo 1. Start dev server: npm run dev
echo 2. Go to: http://localhost:3000/admin/hero-image
echo 3. Upload your hero image
echo.
pause
exit /b 0

:error
echo.
echo ================================
echo ✗ Setup incomplete
echo ================================
echo.
echo Please fix the errors above and run this script again.
echo.
pause
exit /b 1
