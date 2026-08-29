import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react'
import { scheduleApi } from '@/api/misc'
import type { Schedule } from '@/types'

const WEEKDAY_ORDER: Record<string, number> = {
  'Понедельник': 1, 'Вторник': 2, 'Среда': 3, 'Четверг': 4,
  'Пятница': 5, 'Суббота': 6, 'Воскресенье': 7,
}

const WEEKDAY_SHORT: Record<string, string> = {
  'Понедельник': 'ПН', 'Вторник': 'ВТ', 'Среда': 'СР', 'Четверг': 'ЧТ',
  'Пятница': 'ПТ', 'Суббота': 'СБ', 'Воскресенье': 'ВС',
}

const WEEKDAY_COLORS: Record<string, string> = {
  'Понедельник': 'from-blue-600 to-cyan-500',
  'Вторник': 'from-violet-600 to-purple-500',
  'Среда': 'from-emerald-600 to-teal-500',
  'Четверг': 'from-orange-600 to-amber-500',
  'Пятница': 'from-rose-600 to-pink-500',
  'Суббота': 'from-sky-600 to-indigo-500',
  'Воскресенье': 'from-slate-600 to-slate-500',
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState<string | null>(null)

  useEffect(() => {
    scheduleApi.list()
      .then((r) => {
        const data = r.data.data || []
        setSchedules(data)
        if (data.length > 0) {
          const days = [...new Set(data.map((s) => s.weekday))].sort(
            (a, b) => (WEEKDAY_ORDER[a] || 99) - (WEEKDAY_ORDER[b] || 99)
          )
          setActiveDay(days[0])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const groupedByDay = schedules.reduce((acc, s) => {
    if (!acc[s.weekday]) acc[s.weekday] = []
    acc[s.weekday].push(s)
    return acc
  }, {} as Record<string, Schedule[]>)

  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => (WEEKDAY_ORDER[a] || 99) - (WEEKDAY_ORDER[b] || 99)
  )

  const filteredSchedules = activeDay ? groupedByDay[activeDay] || [] : []

  const Skeleton = () => (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="flex gap-3">
        {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-12 w-24 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Расписание занятий</h1>
        <p className="text-content-muted dark:text-content-muted">
          Выберите день недели чтобы увидеть доступные занятия
        </p>
      </div>

      {loading ? (
        <Skeleton />
      ) : schedules.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-content-main dark:text-content-main text-xl font-semibold mb-2">Расписание пока не составлено</h3>
          <p className="text-content-muted mb-6">Расписание занятий будет доступно ближе к началу учебного периода</p>
          <Link to="/courses" className="btn btn-primary">Смотреть курсы</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-8">
            {sortedDays.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative flex flex-col items-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  activeDay === day
                    ? 'bg-primary-gradient text-content-main shadow-glow scale-105'
                    : 'card text-content-muted hover:text-content-main hover:border-primary-500/40'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-70">{WEEKDAY_SHORT[day] || day.slice(0, 2)}</span>
                <span className="text-xs mt-0.5 hidden sm:block">{day}</span>
                <span className={`mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeDay === day
                    ? 'bg-white/20'
                    : 'bg-surface-card'
                }`}>
                  {groupedByDay[day].length}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchedules.map((s) => (
              <Link
                key={s.id}
                to={`/courses/${s.course_id}`}
                className="card-hover group p-5 flex gap-4"
              >
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${WEEKDAY_COLORS[s.weekday] || 'from-blue-600 to-cyan-500'} flex items-center justify-center shadow-glow`}>
                    <Clock className="w-6 h-6 text-content-main" />
                  </div>
                  <div className="h-full w-px bg-surface-border mt-2" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-content-main font-semibold text-base font-display truncate group-hover:text-primary-400 transition-colors">
                      {s.course?.title || `Курс #${s.course_id}`}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-primary-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {s.time_start} – {s.time_end}
                    </span>
                    {s.capacity > 0 && (
                      <span className="flex items-center gap-1.5 text-content-muted">
                        <Users className="w-3.5 h-3.5" />
                        до {s.capacity} чел.
                      </span>
                    )}
                  </div>

                  {s.course && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {s.course.category && (
                        <span className="badge-primary badge text-[10px]">{s.course.category.name}</span>
                      )}
                      {s.course.teacher && (
                        <span className="badge-muted badge text-[10px]">{s.course.teacher.name}</span>
                      )}
                      <span className="badge-muted badge text-[10px]">{s.course.age_min}–{s.course.age_max} лет</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 card p-6 text-center">
            <h3 className="text-content-main font-semibold text-lg mb-2">Не нашли удобное время?</h3>
            <p className="text-content-muted text-sm mb-4">
              Свяжитесь с нами и мы подберём удобное расписание для вашего ребёнка
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/contact" className="btn btn-primary">Связаться с нами</Link>
              <Link to="/courses" className="btn btn-secondary">Все курсы</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
