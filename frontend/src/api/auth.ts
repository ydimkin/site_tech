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

  updateMe: (data: Partial<Pick<User, 'name' | 'phone' | 'child_age' | 'avatar_url'>>) =>
    client.put<{ success: boolean; data: User }>('/auth/me', data),

  uploadAvatar: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post<{ success: boolean; data: { url: string } }>('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteAvatar: () =>
    client.delete<{ success: boolean; data: User }>('/auth/me/avatar'),
}
