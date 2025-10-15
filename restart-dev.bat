@echo off
echo ================================
echo Clearing Next.js Cache
echo ================================
echo.

echo [1/3] Stopping any running dev servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo [2/3] Deleting Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Deleted .next folder
) else (
    echo ✓ Cache already clean
)

echo.
echo [3/3] Starting fresh dev server...
echo.
npm run dev
