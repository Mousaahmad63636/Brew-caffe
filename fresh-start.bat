@echo off
echo 🎯 Fresh Start: Dynamic Menu System
echo ===================================
echo.

echo 📋 Step 1: Testing Firebase connection...
node test-firebase.js
if %errorlevel% neq 0 (
    echo ❌ Firebase connection failed
    echo Please check your .env.local configuration
    pause
    exit /b 1
)
echo ✅ Firebase connection successful
echo.

echo 📋 Step 2: Clearing existing categories...
echo This will remove all categories and start fresh.
set /p confirm="Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

node scripts/clear-categories.js
if %errorlevel% neq 0 (
    echo ❌ Failed to clear categories
    pause
    exit /b 1
)
echo ✅ Categories cleared successfully
echo.

echo 📋 Step 3: Testing categories service...
node scripts/test-categories.js
if %errorlevel% neq 0 (
    echo ❌ Categories service test failed
    pause
    exit /b 1
)
echo ✅ Categories service working
echo.

echo 🎉 FRESH START COMPLETE!
echo.
echo 🌟 Your system is now ready with 0 categories.
echo You have complete control to create your menu structure from scratch!
echo.
echo 🚀 Starting development server...
echo.
echo 📱 Next Steps:
echo   1. Go to: http://localhost:3000/admin/categories
echo   2. Click "Add Category" to create your first category
echo   3. Add subcategories to organize your menu items
echo   4. Go to: http://localhost:3000/admin/add-item
echo   5. Start adding menu items to your custom categories
echo.
echo 🔑 Admin Login:
echo   Username: brewadmin
echo   Password: BrewCaffe2025!Secure
echo.
echo ✨ Benefits of Starting Fresh:
echo   - Complete control over your menu structure
echo   - No unwanted predefined categories
echo   - Custom color schemes for each category
echo   - Organized exactly how YOU want it
echo.

npm run dev
