import { motion } from 'framer-motion'
import { Search, ChefHat } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6"
      >
        <ChefHat className="w-10 h-10 text-slate-400" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} className="bg-amber-500 hover:bg-amber-600">
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}