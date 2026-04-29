import client from './client'
import type { News, Teacher, Category, ContactMessage, DashboardStats, PaginatedResponse } from '@/types'

export const newsApi = {
  list: (page = 1, pageSize = 9) =>
    client.get<PaginatedResponse<News>>('/news', { params: { page, page_size: pageSize } }),

  getById: (id: number) =>
    client.get<{ success: boolean; data: News }>(`/news/${id}`),

  create: (data: Partial<News>) =>
    client.post<{ success: boolean; data: News }>('/news', data),

  update: (id: number, data: Partial<News>) =>
    client.put<{ success: boolean; data: News }>(`/news/${id}`, data),

  delete: (id: number) => client.delete(`/news/${id}`),
}

export const teachersApi = {
  list: () =>
    client.get<{ success: boolean; data: Teacher[] }>('/teachers'),

  create: (data: Partial<Teacher>) =>
    client.post<{ success: boolean; data: Teacher }>('/teachers', data),

  update: (id: number, data: Partial<Teacher>) =>
    client.put<{ success: boolean; data: Teacher }>(`/teachers/${id}`, data),

  delete: (id: number) => client.delete(`/teachers/${id}`),
}

export const categoriesApi = {
  list: () =>
    client.get<{ success: boolean; data: Category[] }>('/categories'),

  create: (data: Partial<Category>) =>
    client.post<{ success: boolean; data: Category }>('/categories', data),

  update: (id: number, data: Partial<Category>) =>
    client.put<{ success: boolean; data: Category }>(`/categories/${id}`, data),

  delete: (id: number) => client.delete(`/categories/${id}`),
}

export const contactApi = {
  send: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    client.post('/contact', data),

  adminList: () =>
    client.get<{ success: boolean; data: ContactMessage[] }>('/admin/contacts'),

  markRead: (id: number) =>
    client.put(`/admin/contacts/${id}/read`),
}

export const adminApi = {
  getStats: () =>
    client.get<{ success: boolean; data: DashboardStats }>('/admin/stats'),

  listUsers: () =>
    client.get('/admin/users'),

  toggleUser: (id: number) =>
    client.put(`/admin/users/${id}/toggle`),

  changeRole: (id: number, role: string) =>
    client.put(`/admin/users/${id}/role`, { role }),
}
