'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  StarOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { AlertMessage } from '@/components/ui/alert-message'
import { LoadingSpinner, MenuGridSkeleton } from '@/components/ui/loading-states'
import { useMenuStore } from '@/stores/menuStore'
import { MenuService } from '@/services/menuService'
import { MenuItem } from '@/types/menu'
import { useToast } from '@/hooks/use-toast'

export function MenuItemsManager() {
  const { 
    menuItems, 
    categories, 
    isLoading, 
    setMenuItems, 
    setCategories, 
    setLoading 
  } = useMenuStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  
  const { toast } = useToast()

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [itemsData, categoriesData] = await Promise.all([
          MenuService.getMenuItems(),
          MenuService.getCategories()
        ])
        setMenuItems(itemsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to load menu items')
        console.error('Error loading menu items:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setMenuItems, setCategories, setLoading])

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle toggle availability
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await MenuService.updateMenuItem(item.id, {
        available: !item.available
      })
      
      // Update local state
      const updatedItems = menuItems.map(i => 
        i.id === item.id ? { ...i, available: !i.available } : i
      )
      setMenuItems(updatedItems)
      
      toast({
        title: 'Success',
        description: `${item.name} is now ${!item.available ? 'available' : 'unavailable'}`,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update item availability',
        variant: 'destructive',
      })
    }
  }

  // Handle toggle featured
  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      await MenuService.updateMenuItem(item.id, {
        featured: !item.featured
      })
      
      // Update local state
      const updatedItems = menuItems.map(i => 
        i.id === item.id ? { ...i, featured: !i.featured } : i
      )
      setMenuItems(updatedItems)
      
      toast({
        title: 'Success',
        description: `${item.name} ${!item.featured ? 'added to' : 'removed from'} featured items`,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      })
    }
  }
  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return

    setIsDeleting(true)
    try {
      await MenuService.deleteMenuItem(deleteItem.id)
      
      // Update local state
      const updatedItems = menuItems.filter(i => i.id !== deleteItem.id)
      setMenuItems(updatedItems)
      
      toast({
        title: 'Success',
        description: `${deleteItem.name} has been deleted`,
      })
      
      setDeleteItem(null)
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <MenuGridSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <AlertMessage
          type="error"
          title="Error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-slate-900">Menu Items</h2>
          <p className="text-slate-600">Manage your restaurant's menu items</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
          <a href="/admin/menu-items/add">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </a>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{menuItems.length}</div>
            <div className="text-sm text-slate-600">Total Items</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {menuItems.filter(i => i.available).length}
            </div>
            <div className="text-sm text-slate-600">Available</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {menuItems.filter(i => i.featured).length}
            </div>
            <div className="text-sm text-slate-600">Featured</div>
          </CardContent>
        </Card>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchQuery || selectedCategory ? 'No items found' : 'No menu items yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first menu item'
              }
            </p>
            <Button asChild>
              <a href="/admin/menu-items/add">Add Menu Item</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl">
                        🍽️
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {item.featured && (
                        <Badge className="bg-yellow-500 text-white shadow-lg">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {!item.available && (
                        <Badge variant="destructive" className="shadow-lg">
                          Unavailable
                        </Badge>
                      )}
                    </div>

                    {/* Actions Dropdown */}
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/admin/menu-items/edit/${item.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleAvailability(item)}>
                            {item.available ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Mark Unavailable
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Mark Available
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(item)}>
                            {item.featured ? (
                              <>
                                <StarOff className="mr-2 h-4 w-4" />
                                Remove Featured
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                Mark Featured
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteItem(item)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                      <Badge className="bg-slate-900/80 text-white shadow-lg text-lg font-bold px-3 py-1">
                        ${item.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    <h3 className="font-playfair text-lg font-bold text-slate-900 mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.category}</span>
                      {item.preparationTime && (
                        <span>{item.preparationTime}min</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
      />
    </div>
  )
}