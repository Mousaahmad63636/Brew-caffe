import { fetchMenuItems, addMenuItem } from '../../../services/firestoreService';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // Public access for menu viewing
      try {
        // Set short cache headers (30 seconds) for better performance while allowing quick updates
        res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
        
        const items = await fetchMenuItems();
        res.status(200).json(items);
      } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
      }
      break;
      
    case 'POST':
      // TODO: Add Firebase authentication verification here
      try {
        // Set no-cache headers for POST responses
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        const result = await addMenuItem(req.body);
        res.status(201).json({ success: true, ...result });
      } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to add menu item' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
