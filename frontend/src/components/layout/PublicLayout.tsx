import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, Rocket, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'

const navLinks = [
  { href: '/courses', label: 'Курсы' },
  { href: '/teachers', label: 'Педагоги' },
  { href: '/news', label: 'Новости' },
  { href: '/contact', label: 'Контакты' },
]

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e]">
      {/* Navbar */}
      <header className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-card' : 'bg-transparent'
      )}>
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-base font-display leading-none">Технопарк</div>
                <div className="text-primary-400 text-[10px] font-medium leading-none">Детский</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    location.pathname.startsWith(link.href)
                      ? 'text-white bg-primary-600/20 border border-primary-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="btn-ghost btn text-xs">
                      Админ
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-slate-300 text-sm">{user?.name}</span>
                  </Link>
                  <button onClick={logout} className="btn btn-secondary btn-sm">Выйти</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm">Войти</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Записаться <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden btn btn-ghost btn-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-surface-border animate-slide-up">
            <div className="container-page py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-surface-border flex gap-2">
                {isAuthenticated ? (
                  <button onClick={logout} className="btn btn-secondary flex-1 btn-sm">Выйти</button>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-secondary flex-1 btn-sm">Войти</Link>
                    <Link to="/register" className="btn btn-primary flex-1 btn-sm">Записаться</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border mt-20">
        <div className="container-page py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold font-display">Детский Технопарк</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Инновационные образовательные курсы для детей: робототехника, программирование, 3D-моделирование, электроника.
              </p>
              <div className="flex gap-3 mt-4">
                {[
                  ['ВКонтакте', 'https://vk.com'], 
                  ['Telegram', 'https://t.me']
                ].map((s) => (
                  <a key={s[0]} href={s[1]} target="_blank" rel="noopener noreferrer" className="badge-muted badge text-xs cursor-pointer hover:badge-primary transition-colors">{s[0]}</a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Обучение</h4>
              <ul className="space-y-2">
                {[['Курсы', '/courses'], ['Педагоги', '/teachers'], ['Расписание', '/courses']].map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-slate-400 hover:text-primary-400 text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Контакты</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>г. Владимирская область, г. Гусь-Хрустальный, ул. Писарева, д. 17</li>
                <li>+7 (996) 442-96-24</li>
                <li>test@mail.ru</li>
                <li>Пн–Пт: 8:00–18:00\nСб: 8:00–14:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-border mt-8 pt-6 text-center text-slate-500 text-xs">
            © {new Date().getFullYear()} Детский Технопарк. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
