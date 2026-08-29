export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  phone: string
  child_age?: number
  avatar_url: string
  is_active: boolean
  created_at: string
}


export interface Category {
  id: number
  name: string
  icon: string
  color: string
}


export interface Teacher {
  id: number
  name: string
  position: string
  description: string
  photo_url: string
  experience: number
  subjects: string
  is_active: boolean
}


export interface Course {
  id: number
  title: string
  description: string
  category_id: number
  category: Category
  teacher_id: number
  teacher: Teacher
  age_min: number
  age_max: number
  price: number
  duration: number
  image_url: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  groups?: Group[]
}


export interface Schedule {
  id: number
  course_id: number
  course?: Course
  weekday: string
  time_start: string
  time_end: string
  capacity: number
}

export interface Group {
  id: number
  course_id: number
  course: Course
  schedule_id: number
  schedule: Schedule
  start_date: string
  end_date: string
  capacity: number
  current_students: number
  is_active: boolean
}


export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlist'

export interface Booking {
  id: number
  user_id: number
  user: User
  group_id: number
  group: Group
  status: BookingStatus
  child_name: string
  child_age: number
  parent_phone: string
  comment: string
  created_at: string
  updated_at: string
}

export interface CreateBookingInput {
  group_id: number
  child_name: string
  child_age: number
  parent_phone?: string
  comment?: string
}


export interface Review {
  id: number
  user_id: number
  user: User
  course_id: number
  rating: number
  text: string
  created_at: string
}


export interface News {
  id: number
  title: string
  content: string
  preview: string
  image_url: string
  images: string[]
  is_published: boolean
  published_at: string
  created_at: string
}



export interface Document {
  id: number
  title: string
  file_url: string
  category: string
}


export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}


export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}


export interface CourseFilters {
  search?: string
  category_id?: number
  age?: number
  min_price?: number
  max_price?: number
  page?: number
  page_size?: number
}


export interface DashboardStats {
  total_courses: number
  total_students: number
  total_bookings: number
  pending_bookings: number
  total_news: number
  monthly_bookings: { month: string; count: number }[]
  top_courses: { course_title: string; bookings: number }[]
}
