# Better Menu - Professional Restaurant Menu System

A modern, professional restaurant menu management system built with Next.js 14, TypeScript, Firebase, and Tailwind CSS.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Firebase Firestore + Firebase Auth
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod

## 📦 Current Implementation Status

### ✅ Completed Components

#### Authentication System
- `/auth/login` - Professional login page with form validation
- `AuthGuard` - Route protection for admin areas
- `AuthService` - Firebase authentication integration
- User session management with Zustand

#### Admin Dashboard
- `/admin` - Main admin dashboard with statistics
- `AdminLayout` - Responsive sidebar navigation
- `DashboardOverview` - Analytics and quick actions
- Real-time data synchronization

#### Menu Management
- `/admin/menu-items` - Comprehensive menu items manager
- `/admin/menu-items/add` - Add new menu items
- `MenuItemForm` - Full-featured form with validation
- `MenuItemsManager` - List, filter, edit, delete items
- CRUD operations with real-time updates
- **Smart Image Upload** - Drag-and-drop with client-side compression (no Firebase Storage needed)

#### Core Pages
- `/` - Main menu page with professional interface

#### Menu Components
- `MenuHeader` - Hero section with branding and animations
- `MenuSearch` - Advanced search with filtering
- `CategoryNavigation` - Horizontal scrolling category selector  
- `MenuGrid` - Responsive grid layout for menu items
- `MenuItemCard` - Detailed item cards with badges and metadata

#### UI Components (shadcn/ui)
- Alert, Avatar, Badge, Button, Card
- Dialog, Dropdown Menu, Form, Input, Label
- Progress, Select, Separator, Skeleton, Switch
- Tabs, Textarea, Toast, Toaster

#### Custom Components
- Loading Spinner & States
- Empty State
- Alert Message
- Confirmation Dialog

#### Services & State
- `MenuService` - Firebase CRUD operations
- `AuthService` - Authentication management
- `menuStore` - Menu data state management
- `authStore` - Authentication state management
- Real-time Firebase synchronization

#### Types & Utils
- TypeScript interfaces for Menu, Category, MenuItem, User
- Utility functions (formatting, slugify, etc.)
- Seed data utility for initial categories

### 🚧 Next Steps
- Category management interface
- User roles and permissions
- Order management system
- Analytics and reporting

## 🎨 Design Features

- Professional gradient hero section
- Smooth Framer Motion animations
- Modern glass-morphism effects
- Mobile-first responsive design
- Professional typography (Playfair Display + Inter)
- Custom CSS utilities and animations
- Comprehensive admin interface
- Real-time data updates

## 🔧 Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** and **Authentication**
3. In Authentication, enable **Email/Password** provider
4. Get your Firebase config from **Project Settings > General > Your apps**
5. Copy `.env.local.example` to `.env.local` and add your Firebase config

### 2. Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to menu items and categories for everyone
    match /menuItems/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 4. Admin Access

1. Register your first admin user at `/auth/login`
2. Update their role to 'admin' in Firestore manually
3. Future admin management will be through the interface

## 🚀 Features

### Public Menu
- Beautiful hero section with restaurant branding
- Category-based navigation with smooth scrolling
- Advanced search and filtering
- Responsive menu item cards with detailed information
- Real-time menu updates

### Admin Dashboard
- Comprehensive analytics and statistics
- Menu item management (CRUD operations)
- Bulk actions (availability, featured status)
- **Smart image upload** with client-side compression (no Firebase Storage needed)
- Category management
- Real-time synchronization
- Professional admin interface

### Technical Features
- Server-side rendering with Next.js 14
- Type-safe development with TypeScript
- Real-time data with Firebase
- Professional UI components
- Responsive design
- SEO optimized
- Performance optimized

Visit `http://localhost:3000` to see the public menu interface.
Visit `http://localhost:3000/admin` to access the admin dashboard.

## 🛡️ Security

- Firebase Authentication for secure login
- Route protection with AuthGuard
- Firestore security rules
- Input validation and sanitization
- CSRF protection with NextAuth
