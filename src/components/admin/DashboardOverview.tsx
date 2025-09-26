'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UtensilsCrossed, 
  FolderOpen, 
  TrendingUp, 
  Eye, 
  Plus,
  Calendar,
  Clock,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useMenuStore } from '@/stores/menuStore'
import { MenuService } from '@/services/menuService'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface DashboardStats {
  totalItems: number
  totalCategories: number
  featuredItems: number
  recentlyAdded: number
}

export function DashboardOverview() {
  const { menuItems, categories, setMenuItems, setCategories, isLoading, setLoading } = useMenuStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalCategories: 0,
    featuredItems: 0,
    recentlyAdded: 0
  })

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
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setMenuItems, setCategories, setLoading])

  useEffect(() => {
    // Calculate stats when data changes
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    setStats({
      totalItems: menuItems.length,
      totalCategories: categories.length,
      featuredItems: menuItems.filter(item => item.featured).length,
      recentlyAdded: menuItems.filter(item => new Date(item.createdAt) >= weekAgo).length
    })
  }, [menuItems, categories])

  const quickActions = [
    { label: 'Add Menu Item', href: '/admin/menu-items/add', icon: Plus },
    { label: 'Manage Categories', href: '/admin/categories', icon: FolderOpen },
    { label: 'View Public Menu', href: '/', icon: Eye },
  ]

  const recentItems = menuItems
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white"
      >
        <h2 className="font-playfair text-3xl font-bold mb-2">Welcome to Better Menu</h2>
        <p className="text-amber-100 mb-6">
          Manage your restaurant menu with ease. View analytics, add new items, and organize your categories.
        </p>
        
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.a
                key={action.label}
                href={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{action.label}</span>
              </motion.a>
            )
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Menu Items
              </CardTitle>
              <UtensilsCrossed className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalItems}</div>
              <p className="text-xs text-slate-500 mt-1">
                Active items in your menu
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Categories
              </CardTitle>
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalCategories}</div>
              <p className="text-xs text-slate-500 mt-1">
                Menu categories
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Featured Items
              </CardTitle>
              <Star className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.featuredItems}</div>
              <p className="text-xs text-slate-500 mt-1">
                Currently featured
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Recently Added
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.recentlyAdded}</div>
              <p className="text-xs text-slate-500 mt-1">
                Added this week
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              Recent Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentItems.length === 0 ? (
              <div className="text-center py-8">
                <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No menu items yet</p>
                <Button className="mt-4" asChild>
                  <a href="/admin/menu-items/add">Add Your First Item</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl" 
                        />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900 truncate">{item.name}</h4>
                        {item.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!item.available && (
                          <Badge variant="destructive">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{item.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {menuItems.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <a href="/admin/menu-items">View All Items</a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}