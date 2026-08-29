import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'

const SESSION_LIFETIME_DAYS = Number(import.meta.env.VITE_SESSION_LIFETIME_DAYS) || 2

const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  },
  setItem: (name: string, value: string): void => {
    const expires = new Date()
    expires.setTime(expires.getTime() + SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  },
  removeItem: (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  },
}
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isTeacher: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isTeacher: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
          isTeacher: user.role === 'teacher' || user.role === 'admin',
        }),

      setUser: (user) =>
        set({
          user,
          isAdmin: user.role === 'admin',
          isTeacher: user.role === 'teacher' || user.role === 'admin',
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          isTeacher: false,
        }),
    }),
    {
      name: 'technopark-auth',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state && state.token && state.user) {
          state.isAuthenticated = true
          state.isAdmin = state.user.role === 'admin'
          state.isTeacher = state.user.role === 'teacher' || state.user.role === 'admin'
        }
      },
    }
  )
)
