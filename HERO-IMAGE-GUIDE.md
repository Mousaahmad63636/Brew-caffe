# Hero Image Feature - Setup & Usage Guide

## Overview
The hero image feature allows admins to upload and manage a large banner image that displays at the top of the restaurant's public menu homepage. This creates a visually appealing entrance to your digital menu.

## Quick Start

### 1. Install Required Dependencies
Run the installation script:
```bash
.\install-formidable.bat
```

Or manually install:
```bash
npm install formidable
```

### 2. Verify Firebase Storage is Enabled
Make sure Firebase Storage is enabled in your Firebase Console:
1. Go to Firebase Console → Storage
2. Click "Get Started" if not already enabled
3. Set security rules (see below)

### 3. Firebase Storage Security Rules
Add these rules in Firebase Console → Storage → Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /hero-images/{imageId} {
      // Allow authenticated users to read
      allow read: if true;
      // Allow authenticated users to write
      allow write: if request.auth != null;
    }
  }
}
```

## Features

### Admin Dashboard
- **Hero Image Manager** (`/admin/hero-image`)
  - Upload new hero images
  - Preview current hero image
  - Delete existing hero image
  - Live preview of how it appears on homepage

### Public Display
- **Homepage Hero Section**
  - Large banner image at top of menu
  - Restaurant name overlaid on image
  - Gradient overlay for better text visibility
  - Responsive design (mobile, tablet, desktop)

## Usage Instructions

### Uploading a Hero Image
1. Navigate to Admin Dashboard
2. Click "Manage Hero Image" in Quick Actions
3. Click "Select Image" or use the file input
4. Choose an image file (JPG, PNG, or WebP)
5. Preview the image
6. Click "Upload Image"
7. Wait for confirmation message

### Image Guidelines
- **Recommended Dimensions**: 1920x600px (16:5 ratio)
- **Orientation**: Landscape works best
- **File Size**: Maximum 10MB
- **Formats**: JPG, PNG, WebP
- **Quality**: High-resolution for best results
- **Content**: Consider text overlay - avoid busy images with text

### Deleting a Hero Image
1. Go to Hero Image Manager
2. Hover over current image
3. Click the X button in top-right corner
4. Confirm deletion
5. Image will be removed from storage and homepage

## Technical Details

### File Structure

```
services/
  └── heroImageService.js          # Firebase Storage & Firestore operations

pages/
  ├── index.js                     # Public menu with hero display
  └── admin/
      └── hero-image.js            # Admin management page

pages/api/
  └── hero-image.js                # API endpoints for upload/delete

lib/
  └── firebaseClient.js            # Updated with Storage export
```

### Data Storage
- **Firebase Storage**: Actual image files stored in `/hero-images/` folder
- **Firestore**: Image metadata stored in `siteSettings/homepage-hero` document
  ```json
  {
    "url": "https://firebasestorage.googleapis.com/...",
    "filename": "hero-images/hero-1234567890-image.jpg",
    "uploadedAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
  ```

### API Endpoints

#### GET /api/hero-image
Fetch current hero image data
```javascript
// Response
{
  "url": "string",
  "filename": "string",
  "uploadedAt": "ISO date string"
}
```

#### POST /api/hero-image
Upload new hero image (multipart/form-data)
```javascript
// Request: FormData with 'image' field
// Response
{
  "success": true,
  "data": {
    "url": "string",
    "filename": "string",
    "uploadedAt": "ISO date string"
  }
}
```

#### DELETE /api/hero-image
Delete current hero image
```javascript
// Response
{
  "success": true
}
```

## Homepage UI Enhancements

### Hero Section Design
- **Height**: 
  - Mobile: 192px (12rem)
  - Tablet: 256px (16rem)  
  - Desktop: 288px (18rem)
- **Image**: Full width, object-fit cover
- **Overlay**: Black gradient (40% → 20% → transparent)
- **Text**: Centered, white with drop shadow
- **Restaurant Name**: Large, bold heading
- **Description**: Smaller text below name

### Without Hero Image
If no hero image is uploaded, the homepage displays normally without the hero section, starting with the MenuHeader component.

## Troubleshooting

### Upload Fails
- Check Firebase Storage is enabled
- Verify storage rules allow writes
- Ensure file is under 10MB
- Check network connection
- Verify environment variables are set

### Image Not Displaying
- Check browser console for errors
- Verify image URL is accessible
- Check Firestore document exists
- Try re-uploading the image

### Permission Errors
- Verify Firebase Storage rules
- Check authentication status
- Ensure admin access

### File Too Large Error
- Compress image before uploading
- Use online tools (TinyPNG, Compressor.io)
- Recommended: Keep under 2MB for faster loading

## Best Practices

### Image Optimization
1. **Compress images** before uploading
2. **Use modern formats** (WebP when possible)
3. **Optimize dimensions** (1920x600 recommended)
4. **Test on mobile** to ensure readability

### Content Considerations
1. **Keep text minimal** - hero should be visual
2. **High contrast** for text visibility
3. **Consider brand colors** for cohesive design
4. **Update seasonally** for freshness

### Performance
- Images are lazy-loaded for better performance
- CDN delivery via Firebase Storage
- Cached by browser for repeat visitors

## Future Enhancements
Potential features to add:
- Multiple hero images with carousel/slideshow
- Scheduled hero images (seasonal)
- Different images for mobile vs desktop
- Hero image cropping tool
- Image filters and adjustments
- Text customization (position, color, font)

## Support
For issues or questions:
1. Check Firebase Console logs
2. Review browser console errors  
3. Verify all setup steps completed
4. Check Firebase Storage quotas

---

**Created**: January 2025  
**Version**: 1.0  
**Status**: Production Ready
