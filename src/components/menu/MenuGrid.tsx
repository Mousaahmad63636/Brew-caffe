'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMenuStore } from '@/stores/menuStore'
import { MenuItemCard } from './MenuItemCard'
import { EmptyState } from '@/components/ui/empty-state'

export function MenuGrid() {
  const { getFilteredItems, selectedCategory, searchQuery } = useMenuStore()
  const filteredItems = getFilteredItems()

  if (filteredItems.length === 0) {
    return (
      <EmptyState
        title={searchQuery ? 'No items found' : 'No menu items available'}
        description={
          searchQuery
            ? `No items match "${searchQuery}". Try a different search term.`
            : selectedCategory
            ? 'This category has no available items at the moment.'
            : 'The menu is being updated. Please check back soon.'
        }
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <AnimatePresence mode="popLayout">
        {filteredItems.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}