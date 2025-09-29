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
    switch (method) {
      case 'GET':
        const heroData = await getHeroImage();
        return res.status(200).json(heroData || { path: null });

      case 'POST':
        // Parse multipart form data
        const form = formidable({
          maxFileSize: 10 * 1024 * 1024, // 10MB
        });

        return form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Form parse error:', err);
            return res.status(400).json({ error: 'Failed to parse form data' });
          }

          try {
            const imageFile = files.image?.[0] || files.image;

            if (!imageFile) {
              return res.status(400).json({ error: 'No image file provided' });
            }

            // Delete old hero image if exists
            const currentHero = await getHeroImage();
            if (currentHero?.filename) {
              const oldPath = path.join(HERO_IMAGES_DIR, currentHero.filename);
              if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
              }
            }

            // Generate unique filename
            const timestamp = Date.now();
            const ext = path.extname(imageFile.originalFilename || 'image.jpg');
            const filename = `hero-${timestamp}${ext}`;
            const newPath = path.join(HERO_IMAGES_DIR, filename);

            // Copy file to public directory
            fs.copyFileSync(imageFile.filepath, newPath);

            // Clean up temp file
            fs.unlinkSync(imageFile.filepath);

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
            return res.status(500).json({ error: uploadError.message });
          }
        });

      case 'DELETE':
        const currentHero = await getHeroImage();
        if (currentHero?.filename) {
          // Delete physical file
          const filePath = path.join(HERO_IMAGES_DIR, currentHero.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        
        // Clear from Firestore
        await clearHeroImage();
        return res.status(200).json({ success: true });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
