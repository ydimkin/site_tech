import { useEffect, useState } from 'react'
import { adminApi } from '@/api/misc'
import type { DashboardStats } from '@/types'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts'
import { Users, BookOpen, CalendarCheck, Newspaper, TrendingUp, Clock } from 'lucide-react'

const PIE_COLORS = ['#3b82f6', '#7c3aed', '#f97316', '#22c55e', '#ef4444', '#06b6d4']


function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-slate-900/95 backdrop-blur border border-slate-700 px-3 py-2 text-xs shadow-xl">
      {label && <div className="text-slate-400 mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload.fill }} />
          <span className="text-slate-200 font-medium">{p.name}: {p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data.data || null)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-24 sm:h-28 rounded-2xl"/>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">{[0,1].map(i=><div key={i} className="skeleton h-72 rounded-2xl"/>)}</div>
    </div>
  )

  const statCards = [
    { label: 'Курсов',        value: stats?.total_courses,    icon: BookOpen,      gradient: 'from-blue-500/20 to-cyan-500/20',     border: 'border-blue-500/30',    color: 'text-blue-400' },
    { label: 'Учеников',      value: stats?.total_students,   icon: Users,         gradient: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30',  color: 'text-violet-400' },
    { label: 'Всего заявок',  value: stats?.total_bookings,   icon: CalendarCheck, gradient: 'from-emerald-500/20 to-teal-500/20',  border: 'border-emerald-500/30', color: 'text-emerald-400' },
    { label: 'Ожидают',       value: stats?.pending_bookings, icon: Clock,         gradient: 'from-amber-500/20 to-orange-500/20',  border: 'border-amber-500/30',   color: 'text-amber-400' },
  ]

  const totalTopBookings = stats?.top_courses?.reduce((s, c) => s + Number(c.bookings || 0), 0) || 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-content-main font-display">Панель управления</h1>
        <p className="text-content-muted text-sm mt-1">Добро пожаловать! Общая статистика технопарка.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, border, color }) => (
          <div
            key={label}
            className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-4 sm:p-5 backdrop-blur-sm transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
              <span className="text-content-muted text-xs sm:text-sm font-medium">{label}</span>
              <Icon className={`w-4 sm:w-5 h-4 sm:h-5 ${color}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold font-display ${color} relative z-10`}>{value ?? 0}</div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-current opacity-5 blur-xl ${color}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-content-main font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-400" /> Заявки за 6 месяцев
            </h2>
          </div>
          {stats?.monthly_bookings && stats.monthly_bookings.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.monthly_bookings} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="50%"  stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(148,163,184,0.5)" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Заявок"
                  stroke="url(#strokeGradient)"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  activeDot={{ r: 5, fill: '#3b82f6', stroke: '#0a0f1e', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-content-muted text-sm">Пока нет данных</div>
          )}
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-content-main font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-400" /> Топ курсов
            </h2>
            {totalTopBookings > 0 && (
              <span className="text-content-muted text-xs">всего: {totalTopBookings}</span>
            )}
          </div>
          {stats?.top_courses && stats.top_courses.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <defs>
                      {PIE_COLORS.map((c, i) => (
                        <linearGradient key={i} id={`pie-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={c} stopOpacity={1} />
                          <stop offset="100%" stopColor={c} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={stats.top_courses}
                      dataKey="bookings"
                      cx="50%" cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {stats.top_courses.map((_, i) => (
                        <Cell key={i} fill={`url(#pie-grad-${i % PIE_COLORS.length})`} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-2xl font-bold text-content-main font-display leading-none">
                    {totalTopBookings}
                  </div>
                  <div className="text-[10px] text-content-muted mt-1">заявок</div>
                </div>
              </div>
              <div className="space-y-2 flex-1 w-full sm:w-auto">
                {stats.top_courses.map((c, i) => {
                  const pct = totalTopBookings > 0 ? Math.round((Number(c.bookings) / totalTopBookings) * 100) : 0
                  return (
                    <div key={c.course_title} className="space-y-1">
                      <div className="flex items-center justify-between text-sm gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-content-main truncate text-xs sm:text-sm">{c.course_title}</span>
                        </div>
                        <span className="text-content-muted text-xs flex-shrink-0">{c.bookings} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-slate-800/50 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-content-muted text-sm">Пока нет данных</div>
          )}
        </div>
      </div>

      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
            <Newspaper className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="text-content-muted text-xs">Опубликовано новостей</div>
            <div className="text-content-main text-lg font-semibold">{stats?.total_news ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
