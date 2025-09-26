export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image?: string
  category: string
  subcategory?: string
  allergens?: string[]
  available: boolean
  featured: boolean
  spicyLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot'
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'keto')[]
  preparationTime?: number
  calories?: number
  createdAt: Date
  updatedAt: Date
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  image?: string
  subcategories?: MenuSubcategory[]
  order: number
  available: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MenuSubcategory {
  id: string
  name: string
  description?: string
  categoryId: string
  order: number
  available: boolean
}