import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import clsx from 'clsx'
import logoImg from '@/assets/img/logo.png'
import InteractiveBackground from '@/components/common/InteractiveBackground'
import { AnimatePresence, motion } from 'framer-motion'

const navLinks = [
  { href: '/courses', label: 'Курсы' },
  { href: '/schedule', label: 'Расписание' },
  { href: '/teachers', label: 'Педагоги' },
  { href: '/news', label: 'Новости' },
  { href: '/contact', label: 'Контакты' },
]

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <div className="min-h-screen flex flex-col bg-surface light:bg-white transition-colors duration-300 relative">
      <InteractiveBackground />
      <header className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-card light:bg-white/80 light:backdrop-blur-xl light:border-b light:border-slate-200 light:shadow-sm' : 'bg-transparent'
      )}>
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src={logoImg} alt="Детский Технопарк" className="h-10 w-auto group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-content-main light:text-slate-900 font-bold text-base font-display leading-none">Технопарк</div>
                <div className="text-primary-400 text-[10px] font-medium leading-none">Детский</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    location.pathname.startsWith(link.href)
                      ? 'text-white bg-primary-600/20 border border-primary-500/30 light:text-primary-700 light:bg-primary-50 light:border-primary-200'
                      : 'text-content-muted hover:text-white hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-icon"
                title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="btn-ghost btn text-xs">
                      Админ-панель
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 light:hover:bg-slate-100 transition-colors">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-content-main text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-content-muted light:text-slate-700 text-sm">{user?.name}</span>
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

            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-icon"
                title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <button
                className="lg:hidden btn btn-ghost btn-icon"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden glass border-t border-surface-border animate-slide-up light:bg-white/95 light:border-slate-200">
            <div className="container-page py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-3 rounded-xl text-content-muted hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-3 rounded-xl text-content-muted hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100">
                  Админ-панель
                </Link>
              )}
              <div className="pt-2 border-t border-surface-border light:border-slate-200 flex gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-slate-800 light:hover:bg-slate-100 transition-colors">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-content-main text-xs font-bold">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="text-content-muted light:text-slate-700 text-sm">{user?.name}</span>
                    </Link>
                    <button onClick={logout} className="btn btn-secondary btn-sm">Выйти</button>
                  </>
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

      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-surface-border light:border-slate-200 mt-20">
        <div className="container-page py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <img src={logoImg} alt="Детский Технопарк" className="h-10 w-auto" />
                <span className="text-content-main light:text-slate-900 font-bold font-display">Детский Технопарк</span>
              </Link>
              <p className="text-content-muted light:text-content-muted text-sm leading-relaxed max-w-xs">
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

            <div>
              <h4 className="text-content-main light:text-slate-900 font-semibold mb-3 text-sm">Обучение</h4>
              <ul className="space-y-2">
                {[
                  ['Курсы', '/courses'],
                  ['Педагоги', '/teachers'],
                  ['Расписание', '/schedule'],
                  ['Документы', '/documents']
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-content-muted hover:text-primary-400 text-sm transition-colors light:text-content-muted light:hover:text-primary-600">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-content-main light:text-slate-900 font-semibold mb-3 text-sm">Контакты</h4>
              <ul className="space-y-2 text-sm text-content-muted light:text-content-muted">
                <li>г. Владимирская область, г. Гусь-Хрустальный, ул. Писарева, д. 17</li>
                <li>+7 (996) 442-96-24</li>
                <li>test@mail.ru</li>
                <li>Пн–Пт: 8:00–18:00 <br />Сб: 8:00–14:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-border light:border-slate-200 mt-8 pt-6 text-center text-content-muted text-xs">
            © {new Date().getFullYear()} Детский Технопарк. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
