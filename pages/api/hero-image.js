import { getHeroImage, saveHeroImage, uploadHeroImage, deleteHeroImage } from '../../../services/heroImageService';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const heroData = await getHeroImage();
        return res.status(200).json(heroData || { url: null });

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

            // Read file as buffer
            const fileBuffer = fs.readFileSync(imageFile.filepath);
            const file = new File([fileBuffer], imageFile.originalFilename || 'hero.jpg', {
              type: imageFile.mimetype,
            });

            // Upload to Firebase Storage
            const uploadResult = await uploadHeroImage(file);

            // Save metadata to Firestore
            await saveHeroImage(uploadResult);

            // Clean up temp file
            fs.unlinkSync(imageFile.filepath);

            return res.status(200).json({
              success: true,
              data: uploadResult,
            });
          } catch (uploadError) {
            console.error('Upload error:', uploadError);
            return res.status(500).json({ error: uploadError.message });
          }
        });

      case 'DELETE':
        const currentHero = await getHeroImage();
        if (currentHero?.filename) {
          await deleteHeroImage(currentHero.filename);
        }
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
