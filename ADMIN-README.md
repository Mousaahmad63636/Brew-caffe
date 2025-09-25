# Menu Admin Dashboard

This extension to the Online Menu project adds a secure admin dashboard for managing menu items using Firebase Firestore as the data store.

## Features

- **Secure Authentication**: Protected admin area with username/password login
- **CRUD Operations**: Create, read, update, and delete menu items
- **Firebase Firestore Integration**: Real-time data storage with scalable NoSQL database
- **Responsive Design**: Works well on both desktop and mobile devices

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Create a service account in Project Settings > Service Accounts
   - Generate a new private key and download the JSON file
   - Copy the required values to your environment variables

3. **Configure environment variables**:
   Create a `.env.local` file with your credentials:
   ```
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here

   # Admin credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure_password_here

   # Firebase configuration
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your_client_id
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the admin dashboard**:
   Open your browser and navigate to:
   ```
   http://localhost:3000/admin/login
   ```

## Firestore Data Structure

Menu items are stored in a Firestore collection called `menuItems`. Each document contains:
- id (auto-generated or custom)
- name
- category
- description
- description2 (optional)
- price (number)
- image (optional)
- allergens (array)
- isVegetarian (boolean)
- preptime (optional)
- popular (boolean)
- ageRestricted (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

## Security Notes

- Change the default admin username and password in `.env.local`
- Generate a strong random string for `NEXTAUTH_SECRET`
- Keep your Firebase service account credentials secure
- Configure Firestore security rules for production deployment
- In production, use environment variables from your hosting platform rather than `.env.local` files

## Migration from Google Sheets

If migrating from the previous Google Sheets version:
1. Export your existing sheet data as CSV
2. Use the CSV fallback feature to continue operations
3. Manually import data to Firestore or create a migration script
4. Update environment variables to use Firebase configuration
