'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter } from 'lucide-react'
import { useMenuStore } from '@/stores/menuStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function MenuSearch() {
  const { searchQuery, setSearchQuery, clearFilters } = useMenuStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (!isExpanded && value.length > 0) {
      setIsExpanded(true)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    clearFilters()
    setIsExpanded(false)
  }

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
            
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-24 h-14 text-lg bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
            />

            <AnimatePresence>
              {(searchQuery || isExpanded) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-2 flex items-center gap-2"
                >
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-3 rounded-full hover:bg-slate-100"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Results Count */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-center"
              >
                <p className="text-sm text-slate-600">
                  Search results for "{searchQuery}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}