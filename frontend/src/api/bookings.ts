import client from './client'
import type { Booking, BookingStatus, CreateBookingInput, PaginatedResponse } from '@/types'

export const bookingsApi = {
  create: (data: CreateBookingInput) =>
    client.post<{ success: boolean; data: Booking }>('/bookings', data),

  myBookings: () =>
    client.get<{ success: boolean; data: Booking[] }>('/bookings'),

  getById: (id: number) =>
    client.get<{ success: boolean; data: Booking }>(`/bookings/${id}`),

  cancel: (id: number) =>
    client.delete(`/bookings/${id}`),

  
  adminList: (status?: string, page = 1, pageSize = 20) =>
    client.get<PaginatedResponse<Booking>>('/admin/bookings', {
      params: { status, page, page_size: pageSize },
    }),

  updateStatus: (id: number, status: BookingStatus) =>
    client.put<{ success: boolean; data: Booking }>(`/admin/bookings/${id}/status`, { status }),
}
