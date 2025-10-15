@echo off
echo 🧪 Testing Category Management UI
echo ================================
echo.

echo 📋 Step 1: Testing Firebase connection...
node test-firebase.js
if %errorlevel% neq 0 (
    echo ❌ Firebase connection failed
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

echo 📋 Step 3: Migrating existing categories to Firestore...
node scripts/migrate-categories.js
if %errorlevel% neq 0 (
    echo ❌ Category migration failed
    pause  
    exit /b 1
)
echo ✅ Categories migrated successfully
echo.

echo 🚀 Starting development server...
echo.
echo 📱 Once the server starts, access:
echo   - Admin Dashboard: http://localhost:3000/admin/dashboard
echo   - Category Management: http://localhost:3000/admin/categories
echo.
echo 🔑 Admin Login:
echo   Username: brewadmin
echo   Password: BrewCaffe2025!Secure
echo.
echo ✨ Features Available:
echo   - Create/Edit/Delete Categories
echo   - Manage Subcategories  
echo   - Color scheme selection
echo   - Category ordering
echo   - Expandable category view
echo.

npm run dev
