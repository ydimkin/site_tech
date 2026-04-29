import client from './client'
import type { User } from '@/types'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  child_age?: number
}

export const authApi = {
  login: (data: LoginData) =>
    client.post<{ success: boolean; data: { token: string } }>('/auth/login', data),

  register: (data: RegisterData) =>
    client.post<{ success: boolean; data: { token: string } }>('/auth/register', data),

  getMe: () =>
    client.get<{ success: boolean; data: User }>('/auth/me'),

  updateMe: (data: Partial<Pick<User, 'name' | 'phone' | 'child_age'>>) =>
    client.put<{ success: boolean; data: User }>('/auth/me', data),
}
