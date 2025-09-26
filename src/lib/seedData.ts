import { MenuService } from '@/services/menuService'

const initialCategories = [
  {
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    order: 1,
    available: true
  },
  {
    name: 'Main Courses',
    description: 'Our signature main dishes made with fresh ingredients',
    order: 2,
    available: true
  },
  {
    name: 'Desserts',
    description: 'Sweet endings to your perfect meal',
    order: 3,
    available: true
  },
  {
    name: 'Beverages',
    description: 'Refreshing drinks to complement your meal',
    order: 4,
    available: true
  }
]

export async function seedInitialData() {
  try {
    console.log('Seeding initial categories...')
    
    // Check if categories already exist
    const existingCategories = await MenuService.getCategories()
    if (existingCategories.length > 0) {
      console.log('Categories already exist, skipping seed')
      return
    }

    // Create initial categories
    for (const category of initialCategories) {
      await MenuService.createCategory(category)
      console.log(`Created category: ${category.name}`)
    }

    console.log('Initial data seeding completed!')
  } catch (error) {
    console.error('Error seeding initial data:', error)
  }
}

// Call this function when the app initializes
if (typeof window !== 'undefined') {
  // Only run in browser
  seedInitialData()
}