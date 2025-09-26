'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Flame, Leaf } from 'lucide-react'
import { MenuItem } from '@/types/menu'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface MenuItemCardProps {
  item: MenuItem
  index: number
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  const getDietaryIcon = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian':
      case 'vegan':
        return <Leaf className="w-3 h-3" />
      default:
        return null
    }
  }

  const getSpicyColor = (level: string) => {
    switch (level) {
      case 'mild': return 'text-yellow-500'
      case 'medium': return 'text-orange-500'  
      case 'hot': return 'text-red-500'
      case 'extra-hot': return 'text-red-700'
      default: return 'text-gray-500'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -8 }}
      className="group"
    >
    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 flex items-center justify-center">
            <div className="text-amber-400 text-6xl opacity-30">🍽️</div>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.featured && (
            <Badge className="bg-amber-500 text-white border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          
          {item.spicyLevel && (
            <Badge variant="outline" className="bg-white/90 border-0 shadow-md">
              <Flame className={`w-3 h-3 mr-1 ${getSpicyColor(item.spicyLevel)}`} />
              {item.spicyLevel}
            </Badge>
          )}
        </div>

        {/* Dietary Badges */}
        {item.dietary && item.dietary.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {item.dietary.map((diet) => (
              <Badge
                key={diet}
                variant="outline"
                className="bg-green-50/90 text-green-700 border-green-200 shadow-sm text-xs"
              >
                {getDietaryIcon(diet)}
                <span className="ml-1 capitalize">{diet}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-slate-900/80 text-white border-0 shadow-lg text-lg font-bold px-3 py-1">
            {item.currency === 'USD' ? '$' : item.currency}{item.price}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          {item.preparationTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{item.preparationTime}min</span>
            </div>
          )}
          
          {item.calories && (
            <div>
              <span>{item.calories} cal</span>
            </div>
          )}
        </div>

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Contains:</p>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}