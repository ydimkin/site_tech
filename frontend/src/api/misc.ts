import client from './client'
import type { News, Teacher, Category, Schedule, ContactMessage, DashboardStats, PaginatedResponse, Document } from '@/types'

export const uploadApi = {
  upload: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post<{ success: boolean; data: { url: string } }>('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

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

  delete: (id: number) =>
    client.delete(`/admin/contacts/${id}`),
}

export const scheduleApi = {
  list: () =>
    client.get<{ success: boolean; data: Schedule[] }>('/schedules'),

  adminList: () =>
    client.get<{ success: boolean; data: Schedule[] }>('/schedules/admin'),

  create: (data: { course_id: number; weekday: string; time_start: string; time_end: string; capacity: number }) =>
    client.post<{ success: boolean; data: Schedule }>('/schedules', data),

  update: (id: number, data: { course_id: number; weekday: string; time_start: string; time_end: string; capacity: number }) =>
    client.put<{ success: boolean; data: Schedule }>(`/schedules/${id}`, data),

  delete: (id: number) => client.delete(`/schedules/${id}`),
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

export const documentsApi = {
  list: () =>
    client.get<{ success: boolean; data: Document[] }>('/documents'),

  create: (data: { title: string; file_url: string; category: string }) =>
    client.post<{ success: boolean; data: Document }>('/admin/documents', data),

  delete: (id: number) =>
    client.delete(`/admin/documents/${id}`),
}

