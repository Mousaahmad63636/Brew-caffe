import { menuData } from '../data/menuData';

// Transform API data to hierarchical menu structure
const transformMenuData = (apiItems) => {
  // Group items by category
  const categorizedItems = apiItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    
    // Transform item to match expected structure
    acc[category].push({
      id: item.id,
      name: item.name || 'Unknown Item',
      description: item.description || '',
      description2: item.description2 || '',
      price: item.price ? parseFloat(item.price).toFixed(2) : '0.00',
      image: item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      allergens: Array.isArray(item.allergens) ? item.allergens : [],
      dietary: [],
      isVegetarian: Boolean(item.isVegetarian),
      prepTime: item.prepTime || '',
      popular: Boolean(item.popular),
      ageRestricted: Boolean(item.ageRestricted)
    });
    
    return acc;
  }, {});

  // Map categories to main categories structure
  const mainCategories = [
    {
      id: "pizza",
      name: "Pizza",
      description: "Authentic wood-fired pizzas with fresh ingredients",
      icon: "🍕",
      subcategories: []
    },
    {
      id: "beverages",
      name: "Beverages",
      description: "Refreshing drinks to complement your meal",
      icon: "🥤",
      subcategories: []
    },
    {
      id: "pasta",
      name: "Pasta",
      description: "Handcrafted pasta dishes with authentic Italian flavors",
      icon: "🍝",
      subcategories: []
    },
    {
      id: "burgers",
      name: "Burgers",
      description: "Gourmet burgers with premium ingredients and artisan buns",
      icon: "🍔",
      subcategories: []
    },
    {
      id: "salad",
      name: "Salad",
      description: "Fresh and healthy salads with a variety of dressings",
      icon: "🥗",
      subcategories: []
    }
  ];

  // Populate subcategories based on API data
  Object.keys(categorizedItems).forEach(categoryName => {
    const subcategory = {
      id: categoryName.toLowerCase().replace(/\s+/g, '-'),
      name: categoryName,
      description: `Delicious ${categoryName.toLowerCase()} prepared with care`,
      items: categorizedItems[categoryName]
    };

    // Determine which main category this subcategory belongs to
    const lowerCategoryName = categoryName.toLowerCase();
    if (lowerCategoryName.includes('margherita') || lowerCategoryName.includes('specialty') || lowerCategoryName.includes('white') || lowerCategoryName.includes('vegan') || lowerCategoryName.includes('pizza')) {
      mainCategories[0].subcategories.push(subcategory); // Pizza
    } else if (lowerCategoryName.includes('drink') || lowerCategoryName.includes('beverage') || lowerCategoryName.includes('coffee') || lowerCategoryName.includes('tea') || lowerCategoryName.includes('juice') || lowerCategoryName.includes('wine') || lowerCategoryName.includes('cocktail')) {
      mainCategories[1].subcategories.push(subcategory); // Beverages
    } else if (lowerCategoryName.includes('pasta') || lowerCategoryName.includes('spaghetti') || lowerCategoryName.includes('penne') || lowerCategoryName.includes('ravioli')) {
      mainCategories[2].subcategories.push(subcategory); // Pasta
    } else if (lowerCategoryName.includes('burger') || lowerCategoryName.includes('classic') || lowerCategoryName.includes('gourmet') || lowerCategoryName.includes('chicken') || lowerCategoryName.includes('veggie')) {
      mainCategories[3].subcategories.push(subcategory); // Burgers
    } else if (lowerCategoryName.includes('salad') || lowerCategoryName.includes('caesar') || lowerCategoryName.includes('greek')) {
      mainCategories[4].subcategories.push(subcategory); // Salad
    } else {
      // Default to pizza if uncertain
      mainCategories[0].subcategories.push(subcategory);
    }
  });

  // Filter out empty main categories
  const filteredMainCategories = mainCategories.filter(cat => cat.subcategories.length > 0);

  return {
    restaurant: {
      name: "IL SOGNO Resto",
      description: "Fresh, locally-sourced ingredients crafted into memorable dining experiences",
      location: "Downtown District"
    },
    mainCategories: filteredMainCategories
  };
};

export const fetchMenuData = async (useStaticData = false) => {
  // Option to use static data instead of API
  if (useStaticData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(menuData);
      }, 100);
    });
  }

  // Fetch from API (which uses Firestore on server-side)
  try {
    const response = await fetch('/api/menu-items');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const apiItems = await response.json();
    const transformedData = transformMenuData(apiItems);
    return transformedData;
  } catch (error) {
    // Fallback to static data if API fails
    console.warn('API failed, using static data:', error.message);
    return menuData;
  }
};