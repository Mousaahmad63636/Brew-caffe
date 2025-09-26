import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 
        className={cn(
          'animate-spin text-amber-500',
          {
            'w-4 h-4': size === 'sm',
            'w-6 h-6': size === 'md', 
            'w-8 h-8': size === 'lg',
          }
        )} 
      />
    </div>
  )
}