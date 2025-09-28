@echo off
echo 🚀 Testing Complete Dynamic Categories System
echo ============================================
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

echo 📋 Step 2: Testing categories service...
node scripts/test-categories.js
if %errorlevel% neq 0 (
    echo ❌ Categories service test failed
    pause
    exit /b 1
)
echo ✅ Categories service working
echo.

echo 📋 Step 3: Ensuring categories are migrated...
node scripts/migrate-categories.js
if %errorlevel% neq 0 (
    echo ❌ Category migration failed
    pause
    exit /b 1
)
echo ✅ Categories migrated/updated successfully
echo.

echo 📋 Step 4: Testing dynamic integration...
node scripts/test-dynamic-integration.js
if %errorlevel% neq 0 (
    echo ❌ Dynamic integration test failed
    pause
    exit /b 1
)
echo ✅ Dynamic integration working
echo.

echo 🎉 ALL TESTS PASSED!
echo.
echo ✨ Dynamic Categories System Status:
echo   - ✅ Categories stored in Firestore
echo   - ✅ Menu service uses dynamic categories
echo   - ✅ Form dropdowns populate from Firestore
echo   - ✅ Main category navigation supports dynamic colors
echo   - ✅ Subcategory sliders work with dynamic data
echo   - ✅ Admin category management ready
echo.
echo 🚀 Starting development server...
echo.
echo 📱 Test these features:
echo   1. Public Menu: http://localhost:3000
echo      - Check category navigation with dynamic colors
echo      - Verify subcategory sliders work
echo      - Test menu item display
echo.
echo   2. Admin Dashboard: http://localhost:3000/admin/dashboard
echo      - Access category management
echo      - Test adding new categories/subcategories
echo      - Try adding menu items with dynamic category dropdowns
echo.
echo   3. Admin Categories: http://localhost:3000/admin/categories
echo      - Create/edit/delete categories
echo      - Manage subcategories
echo      - Change color schemes
echo.
echo 🔑 Admin Login:
echo   Username: brewadmin
echo   Password: BrewCaffe2025!Secure
echo.

npm run dev
