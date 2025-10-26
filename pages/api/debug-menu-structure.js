// Debug endpoint to help troubleshoot category-item relationships
import categoriesService from '../../services/categoriesService';
import { fetchMenuItems } from '../../services/firestoreService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch raw data
    const categories = await categoriesService.getAllCategories();
    const menuItems = await fetchMenuItems();

    // Group menu items by category
    const categorizedItems = menuItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        id: item.id,
        name: item.name,
        category: item.category
      });
      return acc;
    }, {});

    // Debug information
    const debug = {
      totalCategories: categories.length,
      totalMenuItems: menuItems.length,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        order: cat.order,
        subcategories: (cat.subcategories || []).map(sub => ({
          id: sub.id,
          name: sub.name,
          key: `${cat.id}-${sub.id}`,
          itemCount: (categorizedItems[`${cat.id}-${sub.id}`] || []).length
        }))
      })),
      itemsByCategory: categorizedItems,
      orphanedItems: menuItems.filter(item => {
        const categoryKey = item.category;
        if (!categoryKey || categoryKey === 'Other') return false;
        
        // Check if this category key exists in any category-subcategory combination
        const exists = categories.some(cat => 
          (cat.subcategories || []).some(sub => `${cat.id}-${sub.id}` === categoryKey)
        );
        return !exists;
      }).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category
      }))
    };

    res.status(200).json(debug);
    
  } catch (error) {
    console.error('Debug API error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
