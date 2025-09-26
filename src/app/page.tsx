'use client'

import { useEffect } from 'react'
import { useMenuStore } from '@/stores/menuStore'
import { MenuService } from '@/services/menuService'
import { MenuHeader } from '@/components/menu/MenuHeader'
import { CategoryNavigation } from '@/components/menu/CategoryNavigation'
import { MenuGrid } from '@/components/menu/MenuGrid'
import { MenuSearch } from '@/components/menu/MenuSearch'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  const {
    categories,
    menuItems,
    isLoading,
    error,
    setCategories,
    setMenuItems,
    setLoading,
    setError,
  } = useMenuStore()

  useEffect(() => {
    const loadMenuData = async () => {
      setLoading(true)
      try {
        const [categoriesData, itemsData] = await Promise.all([
          MenuService.getCategories(),
          MenuService.getMenuItems(),
        ])
        setCategories(categoriesData)
        setMenuItems(itemsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu data')
      } finally {
        setLoading(false)
      }
    }

    loadMenuData()

    // Set up real-time listeners
    const unsubscribeCategories = MenuService.subscribeToCategories(setCategories)
    const unsubscribeItems = MenuService.subscribeToMenuItems(setMenuItems)

    return () => {
      unsubscribeCategories()
      unsubscribeItems()
    }
  }, [setCategories, setMenuItems, setLoading, setError])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <MenuHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MenuSearch />
        
        {categories.length > 0 && (
          <CategoryNavigation categories={categories} />
        )}
        
        <MenuGrid />
      </div>
    </main>
  )
}