@echo off
echo 🔧 Setting up Categories Database Structure
echo ==========================================
echo.

echo 📋 Step 1: Testing Firebase connection...
node test-firebase.js
if %errorlevel% neq 0 (
    echo ❌ Firebase connection failed - please check configuration
    pause
    exit /b 1
)
echo ✅ Firebase connection successful
echo.

echo 📋 Step 2: Migrating categories to Firestore...
node scripts/migrate-categories.js
if %errorlevel% neq 0 (
    echo ❌ Category migration failed
    pause
    exit /b 1
)
echo ✅ Categories migrated successfully
echo.

echo 📋 Step 3: Testing categories service...
node scripts/test-categories.js
if %errorlevel% neq 0 (
    echo ❌ Categories service test failed
    pause
    exit /b 1
)
echo ✅ Categories service working correctly
echo.

echo 🎉 Database setup complete!
echo.
echo 📊 Your Firestore now contains:
echo   - categories collection with main categories
echo   - Subcategories nested within each category
echo   - Color schemes and ordering data
echo.
echo 🔥 Firebase Console: https://console.firebase.google.com/project/brew-caffe-9c83f/firestore
echo.
echo 📋 Next steps:
echo   1. Build admin category management UI
echo   2. Update existing components to use dynamic categories
echo   3. Test the complete system
echo.
pause
