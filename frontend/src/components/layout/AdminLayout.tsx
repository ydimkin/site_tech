import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, BookOpen, CalendarCheck, Newspaper,
  Users, Tag, MessageSquare, LogOut, Menu, X, ChevronRight, Sun, Moon, Calendar, FileText
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import clsx from 'clsx'
import logoImg from '@/assets/img/logo.png'

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/courses', label: 'Курсы', icon: BookOpen },
  { href: '/admin/bookings', label: 'Бронирования', icon: CalendarCheck },
  { href: '/admin/schedule', label: 'Расписание', icon: Calendar },
  { href: '/admin/news', label: 'Новости', icon: Newspaper },
  { href: '/admin/teachers', label: 'Педагоги', icon: Users },
  { href: '/admin/categories', label: 'Категории', icon: Tag },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/contacts', label: 'Обращения', icon: MessageSquare },
  { href: '/admin/documents', label: 'Документы', icon: FileText },
]

export default function AdminLayout() {
  const { isAdmin, user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  if (!isAdmin) return <Navigate to="/" replace />

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-surface light:bg-slate-50 flex transition-colors duration-300">
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 sm:w-64 glass border-r border-surface-border flex flex-col transition-transform duration-300 light:bg-white light:border-slate-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-4 border-b border-surface-border light:border-slate-200 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 min-w-0">
            <img src={logoImg} alt="Технопарк" className="w-9 h-9 rounded-xl object-contain flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-content-main light:text-slate-900 font-bold text-sm font-display truncate">Технопарк</div>
              <div className="text-primary-400 text-[10px]">Панель управления</div>
            </div>
          </Link>
          <button
            className="lg:hidden btn btn-ghost btn-icon btn-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Закрыть меню"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              to={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(href, exact)
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30 shadow-glow light:bg-primary-50 light:text-primary-700 light:border-primary-200 light:shadow-none'
                  : 'text-content-muted hover:text-content-main hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
              {isActive(href, exact) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-border light:border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-content-main text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-content-main light:text-slate-900 text-sm font-medium truncate">{user?.name}</div>
              <div className="text-content-muted text-xs truncate">{user?.email}</div>
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
        <header className="glass border-b border-surface-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 light:bg-white light:border-slate-200 sticky top-0 z-30">
          <button
            className="lg:hidden btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="text-content-muted hover:text-primary-400 text-xs sm:text-sm transition-colors light:text-content-muted light:hover:text-primary-600 truncate">
              ← На сайт
            </Link>
          </div>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
