import { getHeroImage, saveHeroImage, clearHeroImage } from '../../services/heroImageService';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const HERO_IMAGES_DIR = path.join(process.cwd(), 'public', 'hero-images');

// Ensure directory exists
if (!fs.existsSync(HERO_IMAGES_DIR)) {
  fs.mkdirSync(HERO_IMAGES_DIR, { recursive: true });
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const heroData = await getHeroImage();
      return res.status(200).json(heroData || { path: null });
    }

    if (method === 'POST') {
      // Parse multipart form data
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10MB
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          return res.status(400).json({ error: 'Failed to parse form data' });
        }

        try {
          // Handle both array and single file formats
          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

          if (!imageFile) {
            return res.status(400).json({ error: 'No image file provided' });
          }

          // Validate file type
          const mimeType = imageFile.mimetype || imageFile.type;
          if (!mimeType || !mimeType.startsWith('image/')) {
            return res.status(400).json({ error: 'File must be an image' });
          }

          // Delete old hero image if exists
          try {
            const currentHero = await getHeroImage();
            if (currentHero?.filename) {
              const oldPath = path.join(HERO_IMAGES_DIR, currentHero.filename);
              if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                console.log('Deleted old hero image:', currentHero.filename);
              }
            }
          } catch (deleteErr) {
            console.error('Error deleting old image:', deleteErr);
            // Continue even if delete fails
          }

          // Generate unique filename
          const timestamp = Date.now();
          const originalName = imageFile.originalFilename || imageFile.name || 'image.jpg';
          const ext = path.extname(originalName);
          const filename = `hero-${timestamp}${ext}`;
          const newPath = path.join(HERO_IMAGES_DIR, filename);

          // Copy file to public directory
          const tempPath = imageFile.filepath || imageFile.path;
          fs.copyFileSync(tempPath, newPath);
          console.log('Copied image to:', newPath);

          // Clean up temp file
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }

          // Save metadata to Firestore
          const heroData = {
            filename: filename,
            path: `/hero-images/${filename}`,
            uploadedAt: new Date().toISOString()
          };
          await saveHeroImage(heroData);

          return res.status(200).json({
            success: true,
            data: heroData,
          });
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          return res.status(500).json({ 
            error: uploadError.message || 'Upload failed' 
          });
        }
      });

      // Don't return here - form.parse handles the response
      return;
    }

    if (method === 'DELETE') {
      try {
        const currentHero = await getHeroImage();
        if (currentHero?.filename) {
          // Delete physical file
          const filePath = path.join(HERO_IMAGES_DIR, currentHero.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted hero image:', currentHero.filename);
          }
        }
        
        // Clear from Firestore
        await clearHeroImage();
        return res.status(200).json({ success: true });
      } catch (deleteError) {
        console.error('Delete error:', deleteError);
        return res.status(500).json({ 
          error: deleteError.message || 'Delete failed' 
        });
      }
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
