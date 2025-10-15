@echo off
echo ================================
echo Hero Image Cleanup Script
echo ================================
echo.
echo This script removes files that are no longer needed
echo after switching to base64 image storage.
echo.
pause

echo.
echo [1/3] Removing hero-images folder...
if exist "public\hero-images\" (
    rmdir /s /q "public\hero-images"
    echo ✓ Removed public\hero-images folder
) else (
    echo ✓ Folder already removed
)

echo.
echo [2/3] Removing old installation scripts...
if exist "install-formidable.bat" (
    del "install-formidable.bat"
    echo ✓ Removed install-formidable.bat
) else (
    echo ✓ Script already removed
)

if exist "verify-hero-image.bat" (
    del "verify-hero-image.bat"
    echo ✓ Removed verify-hero-image.bat
) else (
    echo ✓ Script already removed
)

echo.
echo [3/3] Cleanup complete!
echo.
echo ================================
echo Summary
echo ================================
echo.
echo ✓ Hero images now stored as base64 in Firestore
echo ✓ No file upload needed
echo ✓ No formidable package needed
echo ✓ Consistent with menu items storage
echo.
echo You can now:
echo 1. Go to /admin/hero-image
echo 2. Upload your hero image
echo 3. It will be saved directly to Firestore
echo.
pause
