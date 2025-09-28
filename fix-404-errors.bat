@echo off
echo 🚨 404 Error Troubleshooting
echo ============================
echo.

echo 📋 Step 1: Check if server is running...
echo Please make sure the development server is running.
echo.

echo 📋 Step 2: Test basic pages...
echo Open these URLs in your browser:
echo.
echo 🔍 Diagnostic page: http://localhost:3000/admin/diagnostic
echo 🔍 Simple add item: http://localhost:3000/admin/simple-add-item
echo 🔍 Dashboard: http://localhost:3000/admin/dashboard
echo.

echo 📋 Step 3: Check authentication...
echo If you see login page, use these credentials:
echo Username: brewadmin
echo Password: BrewCaffe2025!Secure
echo.

echo 📋 Step 4: Check for compilation errors...
echo Look for red error messages in the terminal running npm run dev
echo Common issues:
echo - Import/export syntax errors
echo - Missing dependencies
echo - TypeScript compilation errors
echo.

echo 📋 Step 5: Clear cache and restart...
echo Try these commands if pages still don't load:
echo.
echo npm install
echo rm -rf .next
echo npm run dev
echo.

echo 🔧 Quick fix attempts:
echo 1. Stop the dev server (Ctrl+C)
echo 2. Run: npm install
echo 3. Run: npm run dev
echo 4. Wait for "ready - started server on 0.0.0.0:3000"
echo 5. Try accessing: http://localhost:3000/admin/diagnostic
echo.

echo 📱 If diagnostic page works but main pages don't:
echo The issue is likely with component imports or Firebase connection.
echo Run: npm run test-firebase
echo.

echo 📱 If diagnostic page doesn't work:
echo The issue is with Next.js routing or authentication.
echo Check the terminal running npm run dev for error messages.
echo.

echo Press any key to continue...
pause > nul
