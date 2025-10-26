// Utility endpoint to fix orphaned menu items that lost their category relationships
import categoriesService from '../../services/categoriesService';
import { fetchMenuItems } from '../../services/firestoreService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch current data
    const categories = await categoriesService.getAllCategories();
    const menuItems = await fetchMenuItems();

    // Create a map of valid category keys
    const validCategoryKeys = new Set();
    categories.forEach(cat => {
      (cat.subcategories || []).forEach(sub => {
        validCategoryKeys.add(`${cat.id}-${sub.id}`);
      });
    });

    // Find orphaned items
    const orphanedItems = menuItems.filter(item => {
      const categoryKey = item.category;
      if (!categoryKey || categoryKey === 'Other') return false;
      return !validCategoryKeys.has(categoryKey);
    });

    // Report findings
    const report = {
      totalItems: menuItems.length,
      totalCategories: categories.length,
      validCategoryKeys: Array.from(validCategoryKeys),
      orphanedItems: orphanedItems.map(item => ({
        id: item.id,
        name: item.name,
        currentCategory: item.category,
        issue: validCategoryKeys.has(item.category) ? 'none' : 'invalid_category_key'
      })),
      suggestions: []
    };

    // Add suggestions for fixing orphaned items
    if (orphanedItems.length > 0) {
      report.suggestions.push(
        'Found orphaned items with invalid category keys.',
        'These items may have been created with old category structures.',
        'Consider reassigning them to valid categories through the admin interface.',
        'Or create the missing categories/subcategories if they should exist.'
      );
    }

    res.status(200).json(report);
    
  } catch (error) {
    console.error('Fix orphaned items API error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
