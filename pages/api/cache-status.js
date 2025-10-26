// Cache status endpoint for debugging and testing
import cacheManager from '../../utils/cacheManager';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Get status of all caches
      const status = {
        menuItems: cacheManager.getStatus('menuItems'),
        categories: cacheManager.getStatus('categories'),
        heroImage: cacheManager.getStatus('heroImage'),
        timestamp: new Date().toISOString()
      };

      return res.status(200).json(status);
    }

    if (method === 'DELETE') {
      // Clear all caches (for testing purposes)
      cacheManager.clearAll();
      
      return res.status(200).json({ 
        success: true, 
        message: 'All caches cleared',
        timestamp: new Date().toISOString()
      });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });

  } catch (error) {
    console.error('Cache status API error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
