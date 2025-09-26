'use client'

import { motion } from 'framer-motion'
import { Skeleton } from './skeleton'
import { Card } from './card'

export function MenuItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </Card>
  )
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="w-48 h-32 rounded-2xl" />
      ))}
    </div>
  )
}

export function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <MenuItemSkeleton key={i} />
      ))}
    </div>
  )
}

interface LoadingStateProps {
  text?: string
  showSpinner?: boolean
}

export function LoadingState({ text = 'Loading...', showSpinner = true }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {showSpinner && (
        <motion.div
          className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <p className="text-slate-600 font-medium">{text}</p>
    </div>
  )
}