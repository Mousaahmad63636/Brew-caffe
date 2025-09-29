# Hero Image Feature - Guide (Base64 Storage)

## Overview
The hero image feature allows admins to upload and manage a large banner image displayed at the top of the homepage. Images are stored as **base64 strings in Firestore** - the same method used for menu item images.

## Quick Start

### 1. No Installation Needed!
✅ All dependencies already installed  
✅ No additional packages required  
✅ No Firebase Storage configuration needed  
✅ Works exactly like menu item images

### 2. Start Using
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/admin/hero-image`
3. Upload your hero image
4. Done!

## Features

### Admin Dashboard
- **Hero Image Manager** (`/admin/hero-image`)
  - Drag & drop image upload
  - Automatic image compression
  - Preview before upload
  - Delete existing hero image
  - Live preview of homepage display

### Public Display
- **Homepage Hero Section**
  - Large banner at top of menu
  - Restaurant name overlay
  - Gradient for text visibility
  - Responsive design (mobile/tablet/desktop)
  - Fast loading (base64 embedded)

### Storage Method
- **Base64 Encoding**: Images converted to base64 strings
- **Firestore Storage**: Saved directly in Firestore document
- **No File System**: No files saved to server
- **Consistent**: Same method as menu item images
- **Simple**: Just one Firestore document

## How It Works

### Upload Process
1. Admin selects image file
2. ImageUpload component compresses image
3. Converts to base64 string (data:image/jpeg;base64,...)
4. Sends JSON to API: `{ image: "base64..." }`
5. API saves to Firestore: `siteSettings/homepage-hero`
6. Homepage displays base64 image

### Technical Flow
```
User selects image
    ↓
ImageUpload component
    ↓
Compress & convert to base64
    ↓
Send JSON to /api/hero-image
    ↓
Save to Firestore
    ↓
Homepage fetches & displays
```

### Data Structure
```javascript
// Firestore: siteSettings/homepage-hero
{
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  uploadedAt: "2025-01-15T10:30:00.000Z",
  updatedAt: "2025-01-15T10:30:00.000Z"
}
```

## Image Guidelines

### Recommended Specs
- **Dimensions**: 1920x600px (16:5 ratio)
- **Orientation**: Landscape
- **File Size**: Under 5MB (before compression)
- **Formats**: JPG, PNG, GIF, WebP
- **Quality**: High-resolution for best results

### Content Tips
- Use high-quality images
- Avoid busy backgrounds (text overlay)
- Consider brand colors
- Test on mobile devices
- Update seasonally

## Usage Instructions

### Uploading Hero Image
1. Navigate to Admin Dashboard
2. Click "Manage Hero Image"
3. Drag & drop or click to select image
4. Preview appears automatically
5. Click "Upload Hero Image"
6. Wait for success message
7. View on homepage

### Deleting Hero Image
1. Go to Hero Image Manager
2. Hover over current image
3. Click X button (top-right)
4. Confirm deletion
5. Image removed from Firestore

### Viewing on Homepage
1. Go to homepage
2. Hero image displays at top
3. Restaurant name overlaid
4. Responsive on all devices

## Technical Details

### File Structure
```
services/
  └── heroImageService.js       # Firestore operations

pages/
  ├── index.js                  # Homepage with hero display
  └── admin/
      └── hero-image.js         # Admin management

pages/api/
  └── hero-image.js             # API endpoints (GET/POST/DELETE)

components/
  └── ImageUpload.js            # Reused from menu items

utils/
  └── imageUtils.js             # Compression utilities
```

### API Endpoints

#### GET /api/hero-image
```javascript
// Response
{
  "image": "data:image/jpeg;base64,...",
  "uploadedAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

#### POST /api/hero-image
```javascript
// Request
{
  "image": "data:image/jpeg;base64,..."
}

// Response
{
  "success": true,
  "data": {
    "image": "data:image/jpeg;base64,...",
    "uploadedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### DELETE /api/hero-image
```javascript
// Response
{ "success": true }
```

## Advantages of Base64 Storage

### Cost & Simplicity
✅ No Firebase Storage costs  
✅ No storage quotas  
✅ No storage security rules  
✅ Consistent with menu items  
✅ Simple architecture  

### Performance
✅ Embedded in document  
✅ Single database query  
✅ No separate file fetch  
✅ Fast loading  
✅ Browser caching  

### Development
✅ No file upload complexity  
✅ No file system operations  
✅ Easy backup (Firestore export)  
✅ Easy deployment  
✅ No file permissions issues  

## Comparison with Menu Items

Both use identical storage method:

| Feature | Hero Image | Menu Items |
|---------|-----------|------------|
| Storage | Firestore base64 | Firestore base64 |
| Component | ImageUpload | ImageUpload |
| Compression | imageUtils | imageUtils |
| API | JSON body | JSON body |
| Display | `<img src={base64}>` | `<img src={base64}>` |

**Perfectly consistent!**

## Troubleshooting

### Image Not Uploading
- Check browser console for errors
- Verify file size under 5MB
- Ensure valid image format
- Check network connection

### Image Not Displaying
- Verify Firestore document exists
- Check browser console
- Clear browser cache
- Restart dev server

### Image Too Large
- Use online compression (TinyPNG)
- Reduce dimensions before upload
- Use JPEG instead of PNG
- Optimize in image editor

### Slow Upload
- Compress image first
- Check internet speed
- Reduce image dimensions
- Use smaller file format

## Best Practices

### Image Optimization
1. Compress before upload
2. Use appropriate dimensions
3. Choose right format (JPEG for photos)
4. Test on mobile first
5. Keep file size reasonable

### Content Strategy
1. Update seasonally
2. High contrast for text
3. Brand-consistent colors
4. Mobile-friendly composition
5. Professional quality

### Performance
- Images auto-compressed to 400x400 max
- JPEG quality set to 80%
- Base64 embedded = fast display
- Single Firestore query
- Browser caches automatically

## Backup & Recovery

### Backup
Export Firestore data:
```bash
# Firebase Console → Firestore → Export
# Or use Firebase CLI
firebase firestore:export backup/
```

### Restore
Import Firestore data:
```bash
firebase firestore:import backup/
```

### Manual Backup
1. Go to Firestore Console
2. Open `siteSettings/homepage-hero`
3. Copy `image` field value
4. Save to text file

## Migration Notes

### From File Storage (Old)
If upgrading from file-based storage:
1. Old images in `/public/hero-images/` not needed
2. Run `cleanup-hero-image.bat` to remove
3. Upload image through admin interface
4. New image saved to Firestore

### Data Format Change
```javascript
// Old format (file path)
{
  filename: "hero-1234567890.jpg",
  path: "/hero-images/hero-1234567890.jpg"
}

// New format (base64)
{
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

## Limitations

- Single hero image only (by design)
- 5MB file size limit (before compression)
- Compressed to 400x400 max (can be adjusted)
- No image cropping tool (yet)
- No scheduled changes (yet)

## Future Enhancements

Potential features:
- Multiple hero images (carousel)
- Image cropping interface
- Scheduled hero images
- Different images per device
- Text position customization
- Filters and effects
- A/B testing support

## Support

### Check These First
1. Browser console errors
2. Network tab in DevTools
3. Firestore Console data
4. Server console logs

### Common Issues
- **405 Error**: Old API code - refresh browser
- **500 Error**: Check Firestore permissions
- **No display**: Verify base64 string exists
- **Slow**: Compress image before upload

### Get Help
1. Check browser console
2. Check server console
3. Verify Firestore document
4. Test with small image first

---

**Version**: 3.0 (Base64 Storage)  
**Updated**: January 2025  
**Status**: Production Ready  
**Storage**: Firestore (base64) - Same as menu items!
