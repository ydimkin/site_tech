import client from './client'
import type { Course, PaginatedResponse, CourseFilters } from '@/types'

export const coursesApi = {
  list: (filters: CourseFilters = {}) =>
    client.get<PaginatedResponse<Course>>('/courses', { params: filters }),

  featured: () =>
    client.get<{ success: boolean; data: Course[] }>('/courses/featured'),

  getById: (id: number) =>
    client.get<{ success: boolean; data: Course }>(`/courses/${id}`),

  create: (data: Partial<Course>) =>
    client.post<{ success: boolean; data: Course }>('/courses', data),

  update: (id: number, data: Partial<Course>) =>
    client.put<{ success: boolean; data: Course }>(`/courses/${id}`, data),

  delete: (id: number) =>
    client.delete(`/courses/${id}`),
}
