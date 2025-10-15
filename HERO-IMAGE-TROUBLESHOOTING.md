# Hero Image Troubleshooting Guide

## Error: 500 & 405 Status Codes

### Problem
```
/api/hero-image:1 Failed to load resource: the server responded with a status of 500 ()
/api/hero-image:1 Failed to load resource: the server responded with a status of 405 ()
Upload error: SyntaxError: Failed to execute 'json' on 'Response'
```

### Causes & Solutions

#### 1. Formidable Not Installed
**Symptom**: 500 error immediately on upload attempt

**Solution**:
```bash
npm install formidable
```

Or run:
```bash
.\install-formidable.bat
```

**Verify**:
```bash
.\verify-hero-image.bat
```

#### 2. Directory Permissions
**Symptom**: 500 error with "EACCES" or "EPERM" in server console

**Solution**:
- Ensure `/public/hero-images/` directory exists
- Check write permissions on the directory
- On Windows, run as Administrator if needed

**Quick Fix**:
```bash
mkdir public\hero-images
```

#### 3. API Route Issues
**Symptom**: 405 Method Not Allowed

**Cause**: API route not handling method correctly

**Solution**: Already fixed in latest code update. Restart dev server:
```bash
npm run dev
```

#### 4. JSON Parsing Error
**Symptom**: "Unexpected end of JSON input"

**Cause**: Server returning non-JSON response (often HTML error page)

**Solution**:
1. Check server console for actual error
2. Restart dev server
3. Clear browser cache
4. Check Network tab in DevTools for actual response

## Step-by-Step Fix

### 1. Install Dependencies
```bash
npm install formidable
```

### 2. Verify Directory Structure
```bash
# Check if directory exists
dir public\hero-images

# If not, create it
mkdir public\hero-images
```

### 3. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Start fresh
npm run dev
```

### 4. Clear Browser Cache
- Open DevTools (F12)
- Go to Network tab
- Right-click → Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### 5. Test Upload
1. Go to http://localhost:3000/admin/hero-image
2. Select a small test image (< 1MB)
3. Click Upload
4. Check browser console for errors
5. Check server console for errors

## Debugging Commands

### Check Server Console
Look for these error messages:
```
Form parse error: [error details]
Upload error: [error details]
Delete error: [error details]
```

### Check Browser Console
Open DevTools (F12) → Console tab
Look for:
- Network errors
- JavaScript errors
- Failed fetch requests

### Check Network Tab
Open DevTools (F12) → Network tab
- Find the `/api/hero-image` request
- Check Status code
- Preview the Response
- Look at Request Headers

## Common Solutions

### Solution 1: Fresh Install
```bash
# Remove node_modules
rmdir /s /q node_modules

# Fresh install
npm install

# Install formidable
npm install formidable

# Restart
npm run dev
```

### Solution 2: Check Environment Variables
Ensure `.env.local` has all Firebase configs:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Solution 3: Manual File Test
Try creating a file manually:
```bash
# Create test file
echo test > public\hero-images\test.txt

# If this fails, you have permission issues
```

### Solution 4: Update API Route
The API route has been updated to handle errors better. Make sure you have the latest version from the fix.

## Verification Checklist

Run verification script:
```bash
.\verify-hero-image.bat
```

Manual verification:
- [ ] `formidable` package installed
- [ ] `/public/hero-images/` directory exists
- [ ] Directory is writable
- [ ] Dev server running without errors
- [ ] Can access admin page
- [ ] No console errors on page load

## Still Having Issues?

### Check Server Logs
1. Look at terminal where `npm run dev` is running
2. Find the error message
3. Copy the full error stack trace

### Check File Paths
All paths should use:
- `/public/hero-images/` (with forward slashes)
- Not `\public\hero-images\` (backslashes only in Windows commands)

### Test with cURL
Test API directly:
```bash
curl http://localhost:3000/api/hero-image
```

Should return:
```json
{"path":null}
```

Or if hero exists:
```json
{
  "filename":"hero-1234567890.jpg",
  "path":"/hero-images/hero-1234567890.jpg",
  "uploadedAt":"2025-01-15T10:30:00.000Z"
}
```

## Prevention

### Always After Pull/Clone
```bash
npm install
.\verify-hero-image.bat
```

### Before Deployment
```bash
# Test upload locally
# Verify files created in /public/hero-images/
# Check Firestore has metadata
```

## Contact Support

If none of these solutions work:
1. Copy full error from server console
2. Copy error from browser console  
3. Share Network tab screenshot
4. Provide steps to reproduce

---

**Last Updated**: January 2025
**Version**: 2.0
