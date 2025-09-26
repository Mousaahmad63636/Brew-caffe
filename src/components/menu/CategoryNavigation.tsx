'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { MenuCategory } from '@/types/menu'
import { useMenuStore } from '@/stores/menuStore'
import { Button } from '@/components/ui/button'

interface CategoryNavigationProps {
  categories: MenuCategory[]
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const { selectedCategory, setSelectedCategory } = useMenuStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
      setTimeout(checkScrollability, 300)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
      setTimeout(checkScrollability, 300)
    }
  }
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        {/* All Categories Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              !selectedCategory 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl' 
                : 'hover:bg-slate-100'
            }`}
          >
            All Categories
          </Button>
          
          <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 flex-1" />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex-shrink-0 h-12 w-12 p-0 rounded-full border-slate-300 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Categories Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories
              .filter(cat => cat.available)
              .map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                    selectedCategory === category.id
                      ? 'ring-4 ring-amber-500 ring-opacity-50 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="w-48 h-32 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                    {/* Background Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.button>
              ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex-shrink-0 h-12 w-12 p-0 rounded-full border-slate-300 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}