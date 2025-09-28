# Firebase Account Migration - Brew-Caffe Setup

# Firebase Account Migration - Brew-Caffe Setup

## ✅ MIGRATION COMPLETE

### Project Details
- **Project Name:** Brew-Caffe  
- **Project ID:** brew-caffe-9c83f
- **Firebase Console:** https://console.firebase.google.com/project/brew-caffe-9c83f

### Completed Configuration
- ✅ Client-side Firebase config updated
- ✅ Server-side service account configured  
- ✅ Environment variables set
- ✅ Admin credentials configured
- ✅ Firebase connection test script created

### Admin Access
- **Username:** `brewadmin`
- **Password:** `BrewCaffe2025!Secure`
- **Admin URL:** http://localhost:3000/admin

## 🚀 Quick Start

### Option 1: Automated Start (Recommended)
```bash
./start-brew-caffe.bat
```

### Option 2: Manual Start
```bash
# Test Firebase connection
node test-firebase.js

# Start development server
npm run dev
```

## 🔧 Firebase Collections Structure
The system uses these Firestore collections:
- `menuItems` - Restaurant menu items with categories, prices, allergens
- `test` - Used for connection testing

## 📱 Application URLs
- **Public Menu:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Menu Management:** http://localhost:3000/admin/menu-items

## 🔐 Security Notes
- Never commit .env.local to git (already in .gitignore)
- Keep service account JSON file secure
- Use strong admin credentials

## 🧪 Testing
After setup, test the connection:
```bash
npm run dev
```

Visit:
- Public menu: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin
