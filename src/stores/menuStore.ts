import { create } from 'zustand'
import { MenuItem, MenuCategory } from '@/types/menu'

interface MenuState {
  categories: MenuCategory[]
  menuItems: MenuItem[]
  selectedCategory: string | null
  selectedSubcategory: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null
}

interface MenuActions {
  setCategories: (categories: MenuCategory[]) => void
  setMenuItems: (items: MenuItem[]) => void
  setSelectedCategory: (categoryId: string | null) => void
  setSelectedSubcategory: (subcategoryId: string | null) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getFilteredItems: () => MenuItem[]
  clearFilters: () => void
}

export const useMenuStore = create<MenuState & MenuActions>((set, get) => ({
  // State
  categories: [],
  menuItems: [],
  selectedCategory: null,
  selectedSubcategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,  // Actions
  setCategories: (categories) => set({ categories }),
  setMenuItems: (menuItems) => set({ menuItems }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, selectedSubcategory: null }),
  setSelectedSubcategory: (selectedSubcategory) => set({ selectedSubcategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  getFilteredItems: () => {
    const { menuItems, selectedCategory, selectedSubcategory, searchQuery } = get()
    let filtered = menuItems.filter(item => item.available)

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(item => item.subcategory === selectedSubcategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    }

    return filtered
  },

  clearFilters: () => set({ 
    selectedCategory: null, 
    selectedSubcategory: null, 
    searchQuery: '' 
  }),
}))