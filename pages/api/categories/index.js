import categoriesService from '../../../services/categoriesService';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        try {
          // Set short cache headers (30 seconds) for better performance while allowing quick updates
          res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
          
          const categories = await categoriesService.getAllCategories();
          res.status(200).json(categories);
        } catch (dbError) {
          console.error('Database error in categories API:', dbError);
          // Return empty array if no categories exist yet
          res.status(200).json([]);
        }
        break;

      case 'POST':
        // Set no-cache headers for POST responses
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        const newCategory = await categoriesService.createCategory(req.body);
        res.status(201).json(newCategory);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
