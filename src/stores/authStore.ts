import { create } from 'zustand'
import { User } from '@/types/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  login: (user) => set({ 
    user, 
    isAuthenticated: true, 
    isLoading: false 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false 
  }),
}))