# Hero Image Feature - Setup & Usage Guide

## Overview
The hero image feature allows admins to upload and manage a large banner image that displays at the top of the restaurant's public menu homepage. Images are stored locally in the `/public/hero-images/` folder (no Firebase Storage needed).

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

### 2. That's It!
No Firebase Storage configuration needed. Images are stored locally in `/public/hero-images/`.

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

### Storage
- **Local File Storage**: Images saved to `/public/hero-images/`
- **Metadata**: Firestore stores only filename and upload date
- **No Storage Costs**: Uses Next.js public folder (free)
- **Auto-Cleanup**: Old hero image deleted when new one uploaded

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
5. Image will be removed from server and homepage

## Technical Details

### File Structure
```
public/
  └── hero-images/           # Hero images stored here
      ├── .gitkeep
      └── hero-1234567890.jpg  # Only 1 image at a time

services/
  └── heroImageService.js    # Firestore metadata operations

pages/
  ├── index.js               # Public menu with hero display
  └── admin/
      └── hero-image.js      # Admin management page

pages/api/
  └── hero-image.js          # API endpoints for upload/delete
```

### Data Storage
- **Local Files**: Images stored in `/public/hero-images/` folder
- **Firestore**: Only metadata stored in `siteSettings/homepage-hero`
  ```json
  {
    "filename": "hero-1234567890.jpg",
    "path": "/hero-images/hero-1234567890.jpg",
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
  "filename": "hero-1234567890.jpg",
  "path": "/hero-images/hero-1234567890.jpg",
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
    "filename": "hero-1234567890.jpg",
    "path": "/hero-images/hero-1234567890.jpg",
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

## Advantages of Local Storage

### Cost Benefits
- ✅ **No Firebase Storage Costs**: Free tier sufficient
- ✅ **No Storage Quotas**: Unlimited on your server
- ✅ **Simple Architecture**: No external dependencies

### Performance
- ✅ **Faster Loading**: No Firebase CDN latency
- ✅ **Direct Access**: Served from same domain
- ✅ **Browser Caching**: Automatic caching

### Simplicity
- ✅ **No Storage Rules**: No Firebase config needed
- ✅ **Easy Backup**: Just copy /public folder
- ✅ **Simple Deployment**: Included in build

## Troubleshooting

### Upload Fails
- Check `/public/hero-images/` folder exists and is writable
- Verify file is under 10MB
- Check network connection
- Check browser console for errors

### Image Not Displaying
- Verify file exists in `/public/hero-images/`
- Check Firestore document has correct path
- Clear browser cache
- Check file permissions

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

### Deployment
- Hero images are included in build/deployment
- Commit `/public/hero-images/` to git if you want images in version control
- Or add to `.gitignore` if images change frequently

## Backup & Recovery

### Manual Backup
Copy the entire `/public/hero-images/` folder to backup location

### Restore
Copy backed up files back to `/public/hero-images/`

### Migration
To move to different server, copy `/public/hero-images/` folder

## Limitations
- Single hero image only (by design)
- Manual file cleanup if you need to free space
- No automatic image optimization (compress before upload)

## Support
For issues or questions:
1. Check `/public/hero-images/` folder permissions
2. Review browser console errors  
3. Verify Firestore connection
4. Check file size limits

---

**Created**: January 2025  
**Version**: 2.0 (Local Storage)  
**Status**: Production Ready (Free Tier Friendly)
