import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import LoadingScreen from '@/components/common/LoadingScreen'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const CoursesPage = lazy(() => import('@/pages/public/CoursesPage'))
const CourseDetailPage = lazy(() => import('@/pages/public/CourseDetailPage'))
const TeachersPage = lazy(() => import('@/pages/public/TeachersPage'))
const SchedulePage = lazy(() => import('@/pages/public/SchedulePage'))
const NewsPage = lazy(() => import('@/pages/public/NewsPage'))
const NewsDetailPage = lazy(() => import('@/pages/public/NewsDetailPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const LoginPage = lazy(() => import('@/pages/public/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'))
const DocumentsPage = lazy(() => import('@/pages/public/DocumentsPage'))

const ProfilePage = lazy(() => import('@/pages/public/ProfilePage'))

const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminCourses = lazy(() => import('@/pages/admin/CoursesPage'))
const AdminBookings = lazy(() => import('@/pages/admin/BookingsPage'))
const AdminNews = lazy(() => import('@/pages/admin/NewsPage'))
const AdminTeachers = lazy(() => import('@/pages/admin/TeachersPage'))
const AdminCategories = lazy(() => import('@/pages/admin/CategoriesPage'))
const AdminUsers = lazy(() => import('@/pages/admin/UsersPage'))
const AdminContacts = lazy(() => import('@/pages/admin/ContactsPage'))
const AdminSchedule = lazy(() => import('@/pages/admin/SchedulePage'))
const AdminDocuments = lazy(() => import('@/pages/admin/DocumentsPage'))

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuthStore()
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }, [theme])

  const toastBg = theme === 'dark' ? '#1e293b' : '#ffffff'
  const toastColor = theme === 'dark' ? '#f1f5f9' : '#1e293b'
  const toastBorder = theme === 'dark' ? '#334155' : '#e2e8f0'
  const toastSecondary = theme === 'dark' ? '#0f172a' : '#ffffff'

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: toastBg,
            color: toastColor,
            border: `1px solid ${toastBorder}`,
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: toastSecondary } },
          error: { iconTheme: { primary: '#ef4444', secondary: toastSecondary } },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />
          </Route>

          <Route path="/admin" element={
            <AdminRoute><AdminLayout /></AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="documents" element={<AdminDocuments />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
