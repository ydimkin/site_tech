import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, BookOpen, CalendarCheck, Newspaper,
  Users, Tag, MessageSquare, Rocket, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/courses', label: 'Курсы', icon: BookOpen },
  { href: '/admin/bookings', label: 'Бронирования', icon: CalendarCheck },
  { href: '/admin/news', label: 'Новости', icon: Newspaper },
  { href: '/admin/teachers', label: 'Педагоги', icon: Users },
  { href: '/admin/categories', label: 'Категории', icon: Tag },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/contacts', label: 'Обращения', icon: MessageSquare },
]

export default function AdminLayout() {
  const { isAdmin, user, logout } = useAuthStore()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAdmin) return <Navigate to="/" replace />

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#070c1a] flex">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 glass border-r border-surface-border flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-surface-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm font-display">Технопарк</div>
              <div className="text-primary-400 text-[10px]">Панель управления</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(href, exact)
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30 shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
              {isActive(href, exact) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-sm font-medium truncate">{user?.name}</div>
              <div className="text-slate-500 text-xs truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full btn btn-secondary btn-sm flex items-center gap-2 justify-center"
          >
            <LogOut className="w-3.5 h-3.5" /> Выйти
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="glass border-b border-surface-border px-6 py-4 flex items-center justify-between">
          <button
            className="md:hidden btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-slate-400 hover:text-primary-400 text-sm transition-colors">
              ← Перейти на сайт
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
