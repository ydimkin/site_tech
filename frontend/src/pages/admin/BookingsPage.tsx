import { useEffect, useState } from 'react'
import { bookingsApi } from '@/api/bookings'
import type { Booking, BookingStatus } from '@/types'
import toast from 'react-hot-toast'
import { Check, X, AlertCircle } from 'lucide-react'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Все' },
  { value: 'pending', label: 'Ожидают' },
  { value: 'confirmed', label: 'Подтв.' },
  { value: 'cancelled', label: 'Отмен.' },
  { value: 'waitlist', label: 'Ожид.' },
]

const STATUS_CLASS: Record<string, string> = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  cancelled: 'status-cancelled',
  waitlist: 'status-waitlist',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  waitlist: 'Список ожидания',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const r = await bookingsApi.adminList(statusFilter || undefined, page)
      setBookings(r.data.data || [])
      setTotal(r.data.total)
      setTotalPages(r.data.total_pages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [statusFilter, page])

  const changeStatus = async (id: number, status: BookingStatus) => {
    try {
      await bookingsApi.updateStatus(id, status)
      toast.success('Статус обновлён')
      fetchBookings()
    } catch {
      toast.error('Ошибка обновления статуса')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-content-main font-display">Бронирования</h1>
          <p className="text-content-muted text-sm mt-1">Всего: {total}</p>
        </div>
        <div className="flex gap-2 flex-wrap overflow-x-auto -mx-1 px-1 pb-1">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`badge cursor-pointer transition-all whitespace-nowrap ${statusFilter === value ? 'badge-primary' : 'badge-muted'}`}
              onClick={() => { setStatusFilter(value); setPage(1) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {['#', 'Курс', 'Ребёнок', 'Родитель', 'Дата', 'Статус', 'Действия'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-content-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-border">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-content-muted">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    Заявок не найдено
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-surface-border hover:bg-surface/40 transition-colors">
                    <td className="px-4 py-3 text-content-muted">#{b.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-content-main font-medium">{b.group?.course?.title || '—'}</div>
                      <div className="text-content-muted text-xs">
                        {b.group?.schedule?.weekday} {b.group?.schedule?.time_start}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-content-main">{b.child_name}</div>
                      <div className="text-content-muted text-xs">{b.child_age} лет</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-content-muted">{b.user?.name}</div>
                      <div className="text-content-muted text-xs">{b.parent_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-content-muted text-xs whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_CLASS[b.status] || 'badge-muted'}`}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {b.status !== 'confirmed' && (
                          <button
                            className="btn btn-sm bg-emerald-900/40 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-800/60 btn-icon"
                            onClick={() => changeStatus(b.id, 'confirmed')}
                            title="Подтвердить"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            className="btn btn-sm bg-red-900/40 text-red-400 border border-red-700/40 hover:bg-red-800/60 btn-icon"
                            onClick={() => changeStatus(b.id, 'cancelled')}
                            title="Отменить"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-36 rounded-xl" />) :
          bookings.length === 0 ? (
            <div className="card p-12 text-center text-content-muted">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              Заявок не найдено
            </div>
          ) : bookings.map((b) => (
            <div key={b.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-content-main font-medium">{b.group?.course?.title || '—'}</div>
                  <div className="text-content-muted text-xs mt-0.5">
                    {b.group?.schedule?.weekday} {b.group?.schedule?.time_start} · #{b.id}
                  </div>
                </div>
                <span className={`badge text-[10px] flex-shrink-0 ${STATUS_CLASS[b.status] || 'badge-muted'}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-content-muted">Ребёнок</div>
                  <div className="text-content-main">{b.child_name}, {b.child_age} лет</div>
                </div>
                <div>
                  <div className="text-content-muted">Родитель</div>
                  <div className="text-content-main truncate">{b.user?.name}</div>
                  {b.parent_phone && <div className="text-content-muted">{b.parent_phone}</div>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                <span className="text-content-muted text-xs">
                  {new Date(b.created_at).toLocaleDateString('ru-RU')}
                </span>
                <div className="flex gap-1">
                  {b.status !== 'confirmed' && (
                    <button
                      className="btn btn-sm bg-emerald-900/40 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-800/60"
                      onClick={() => changeStatus(b.id, 'confirmed')}
                    >
                      <Check className="w-3.5 h-3.5" /> Подтв.
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button
                      className="btn btn-sm bg-red-900/40 text-red-400 border border-red-700/40 hover:bg-red-800/60"
                      onClick={() => changeStatus(b.id, 'cancelled')}
                    >
                      <X className="w-3.5 h-3.5" /> Отмен.
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
