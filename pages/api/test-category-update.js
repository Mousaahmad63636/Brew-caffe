// Test endpoint to verify category updates preserve subcategories
import categoriesService from '../../services/categoriesService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { categoryId, newOrder } = req.body;
    
    if (!categoryId || newOrder === undefined) {
      return res.status(400).json({ error: 'categoryId and newOrder are required' });
    }

    // Get category before update
    const beforeUpdate = await categoriesService.getCategoryById(categoryId);
    
    // Update only the order
    const updatedCategory = await categoriesService.updateCategory(categoryId, {
      order: parseInt(newOrder)
    });
    
    // Compare before and after
    const result = {
      success: true,
      categoryId,
      beforeUpdate: {
        order: beforeUpdate.order,
        subcategoriesCount: (beforeUpdate.subcategories || []).length,
        subcategories: beforeUpdate.subcategories || []
      },
      afterUpdate: {
        order: updatedCategory.order,
        subcategoriesCount: (updatedCategory.subcategories || []).length,
        subcategories: updatedCategory.subcategories || []
      },
      subcategoriesPreserved: (beforeUpdate.subcategories || []).length === (updatedCategory.subcategories || []).length
    };

    res.status(200).json(result);
    
  } catch (error) {
    console.error('Test category update error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
