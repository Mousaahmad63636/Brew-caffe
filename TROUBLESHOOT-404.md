# 🚨 404 Error Troubleshooting Guide

## Issue: Cannot access admin pages (add-item, categories) - getting 404 errors

### 🔍 Quick Diagnosis

**Step 1: Test Basic Routing**
Try these simplified test pages first:
- http://localhost:3000/admin/diagnostic
- http://localhost:3000/admin/simple-add-item  
- http://localhost:3000/admin/simple-categories

If these work → Issue is with complex components
If these don't work → Issue is with routing/authentication

---

## 🔧 Solution Steps

### 1. **Restart Development Server Properly**
```bash
# Stop current server (Ctrl+C)
cd C:\Users\Ahmad\Desktop\Da-menuuu-brew
npm install
npm run dev
```

Wait for: `ready - started server on 0.0.0.0:3000`

### 2. **Check Authentication Status**
- Go to: http://localhost:3000/admin/firebase-login
- Login with:
  - **Username:** brewadmin  
  - **Password:** BrewCaffe2025!Secure

### 3. **Test Firebase Connection**
```bash
npm run test-firebase
```

### 4. **Clear Next.js Cache**
```bash
# Stop server first
rmdir /s .next
npm run dev
```

### 5. **Check Console Errors**
- Open browser DevTools (F12)
- Look for red errors in Console tab
- Check Network tab for failed requests

---

## 🐛 Common Causes & Fixes

### **Component Import Errors**
**Symptoms:** Pages load but show blank/error
**Fix:** Check browser console for import errors

### **Authentication Blocking**
**Symptoms:** Automatic redirect to login
**Fix:** Login with admin credentials above

### **Firebase Configuration**
**Symptoms:** Service errors in console
**Fix:** Run `npm run test-firebase`

### **Next.js Compilation**
**Symptoms:** Server shows compilation errors  
**Fix:** Check terminal running `npm run dev`

### **Service Integration Issues**
**Symptoms:** "getAllCategories is not a function"
**Fix:** Check if services are properly exported

---

## 📱 Testing Workflow

### **Phase 1: Basic Connectivity**
1. ✅ Start: http://localhost:3000/admin/diagnostic
2. ✅ Login: Use admin credentials if redirected
3. ✅ Navigate: Test diagnostic page links

### **Phase 2: Simple Components**  
1. ✅ Test: http://localhost:3000/admin/simple-add-item
2. ✅ Test: http://localhost:3000/admin/simple-categories
3. ✅ Check: Browser console for errors

### **Phase 3: Complex Components**
1. ✅ Test: http://localhost:3000/admin/add-item
2. ✅ Test: http://localhost:3000/admin/categories  
3. ✅ Test: http://localhost:3000/admin/dashboard

---

## ⚡ Quick Fixes

### **Most Common Issue: Service Import Errors**
If you see import/export errors:

1. **Check menuService.js imports:**
   ```javascript
   // Should be:
   import categoriesService from './categoriesService';
   ```

2. **Check component imports:**
   ```javascript
   // Should be:
   import { getCategoryOptions } from '../services/menuService';
   ```

### **Authentication Issue:**
If constantly redirected to login:
1. Clear browser cookies/localStorage
2. Login again with admin credentials
3. Check AuthContext is working

### **Firebase Connection Issue:**
If categories service fails:
1. Check `.env.local` file exists
2. Run `npm run test-firebase`  
3. Run `npm run migrate-categories`

---

## 🆘 Emergency Fallback

If nothing works, use these working URLs:
- **Diagnostic:** http://localhost:3000/admin/diagnostic
- **Simple Add:** http://localhost:3000/admin/simple-add-item
- **Simple Categories:** http://localhost:3000/admin/simple-categories

These simplified pages will help identify the exact issue.

---

## 📞 Next Steps

1. **Run:** `./fix-404-errors.bat` for guided troubleshooting
2. **Test:** Simplified pages first to isolate the issue
3. **Check:** Browser console and server terminal for specific errors
4. **Report:** Specific error messages for targeted fixes

The 404 errors are likely due to component compilation issues or authentication problems, not missing files.
