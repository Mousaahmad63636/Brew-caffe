'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { Button } from './button'

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  onClose?: () => void
  onAction?: () => void
  actionLabel?: string
}

const alertIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const alertVariants = {
  success: 'success' as const,
  error: 'destructive' as const,
  warning: 'warning' as const,
  info: 'default' as const,
}

export function AlertMessage({ 
  type, 
  title, 
  message, 
  onClose, 
  onAction, 
  actionLabel 
}: AlertMessageProps) {
  const Icon = alertIcons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Alert variant={alertVariants[type]}>
        <Icon className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          {title}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-auto p-0 text-inherit hover:bg-transparent"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {onAction && actionLabel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className="ml-2 mt-2"
            >
              {actionLabel}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}