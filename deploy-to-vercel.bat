@echo off
echo ================================
echo Deploy to Vercel
echo ================================
echo.
echo This will deploy your latest changes to Vercel
echo.
pause

echo.
echo [1/2] Committing changes to git...
git add .
git commit -m "Update hero image to use base64 storage (like menu items)"

echo.
echo [2/2] Pushing to Vercel...
git push

echo.
echo ================================
echo Deployment Started!
echo ================================
echo.
echo Vercel will automatically deploy your changes.
echo Check: https://vercel.com/dashboard
echo.
echo Wait 2-3 minutes for deployment to complete.
echo Then test on: https://brew-and-crepe.vercel.app
echo.
pause
