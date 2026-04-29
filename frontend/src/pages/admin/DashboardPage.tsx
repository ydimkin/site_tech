import { useEffect, useState } from 'react'
import { adminApi } from '@/api/misc'
import type { DashboardStats } from '@/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, BookOpen, CalendarCheck, Newspaper, TrendingUp, Clock } from 'lucide-react'

const PIE_COLORS = ['#3b82f6', '#7c3aed', '#f97316', '#22c55e', '#ef4444']

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data.data || null)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="grid grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-28 rounded-2xl"/>)}</div>
      <div className="grid grid-cols-2 gap-6">{[0,1].map(i=><div key={i} className="skeleton h-64 rounded-2xl"/>)}</div>
    </div>
  )

  const statCards = [
    { label: 'Курсов', value: stats?.total_courses, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-700/30' },
    { label: 'Учеников', value: stats?.total_students, icon: Users, color: 'text-violet-400', bg: 'bg-violet-900/30 border-violet-700/30' },
    { label: 'Всего заявок', value: stats?.total_bookings, icon: CalendarCheck, color: 'text-emerald-400', bg: 'bg-emerald-900/30 border-emerald-700/30' },
    { label: 'Ожидают', value: stats?.pending_bookings, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700/30' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Панель управления</h1>
        <p className="text-slate-400 text-sm mt-1">Добро пожаловать! Общая статистика технопарка.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-3xl font-bold font-display ${color}`}>{value ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly bookings bar chart */}
        <div className="card p-6">
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-400" /> Заявки за 6 месяцев
          </h2>
          {stats?.monthly_bookings && stats.monthly_bookings.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.monthly_bookings}>
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="count" fill="url(#blueGradient)" radius={[6,6,0,0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500">Нет данных</div>
          )}
        </div>

        {/* Top courses pie */}
        <div className="card p-6">
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-400" /> Топ курсов
          </h2>
          {stats?.top_courses && stats.top_courses.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <PieChart width={160} height={160}>
                  <Pie data={stats.top_courses} cx={75} cy={75} outerRadius={70} dataKey="bookings">
                    {stats.top_courses.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-2 flex-1">
                {stats.top_courses.map((c, i) => (
                  <div key={c.course_title} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-300 truncate max-w-[130px]">{c.course_title}</span>
                    </div>
                    <span className="text-slate-400 font-medium ml-2">{c.bookings}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[160px] flex items-center justify-center text-slate-500">Нет данных</div>
          )}
        </div>
      </div>
    </div>
  )
}
