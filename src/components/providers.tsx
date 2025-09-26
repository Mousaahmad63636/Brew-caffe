'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { AuthService } from '@/services/authService'

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [setUser])

  return <>{children}</>
}