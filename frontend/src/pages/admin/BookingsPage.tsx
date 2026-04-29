import { useEffect, useState } from 'react'
import { bookingsApi } from '@/api/bookings'
import type { Booking, BookingStatus } from '@/types'
import toast from 'react-hot-toast'
import { Check, X, Clock, AlertCircle } from 'lucide-react'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Все заявки' },
  { value: 'pending', label: 'Ожидают' },
  { value: 'confirmed', label: 'Подтверждено' },
  { value: 'cancelled', label: 'Отменено' },
  { value: 'waitlist', label: 'Лист ожидания' },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Бронирования</h1>
          <p className="text-slate-400 text-sm mt-1">Всего: {total}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`badge cursor-pointer transition-all ${statusFilter === value ? 'badge-primary' : 'badge-muted'}`}
              onClick={() => { setStatusFilter(value); setPage(1) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {['#', 'Курс', 'Ребёнок', 'Родитель', 'Дата', 'Статус', 'Действия'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
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
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    Заявок не найдено
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-surface-border hover:bg-surface/40 transition-colors">
                    <td className="px-4 py-3 text-slate-500">#{b.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200 font-medium">{b.group?.course?.title || '—'}</div>
                      <div className="text-slate-500 text-xs">
                        {b.group?.schedule?.weekday} {b.group?.schedule?.time_start}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200">{b.child_name}</div>
                      <div className="text-slate-500 text-xs">{b.child_age} лет</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-300">{b.user?.name}</div>
                      <div className="text-slate-500 text-xs">{b.parent_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
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

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-surface-border">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
