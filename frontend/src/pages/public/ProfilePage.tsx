import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { bookingsApi } from '@/api/bookings'
import { authApi } from '@/api/auth'
import type { Booking } from '@/types'
import toast from 'react-hot-toast'
import { User, BookOpen, Phone, CalendarCheck, Clock, Camera, Trash2 } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  pending: 'На рассмотрении',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  waitlist: 'Лист ожидания',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  cancelled: 'status-cancelled',
  waitlist: 'status-waitlist',
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', child_age: user?.child_age?.toString() || '' })

  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await authApi.uploadAvatar(file)
      const url = res.data.data.url
      const updated = await authApi.updateMe({ avatar_url: url } as any)
      setUser(updated.data.data!)
      toast.success('Фото обновлено')
    } catch {
      toast.error('Ошибка загрузки')
    }
  }

  const handleDeleteAvatar = async () => {
    if (!confirm('Удалить фото профиля?')) return
    try {
      const res = await authApi.deleteAvatar()
      setUser(res.data.data!)
      toast.success('Фото удалено')
    } catch {
      toast.error('Ошибка удаления')
    }
  }

  useEffect(() => {
    bookingsApi.myBookings().then((r) => {
      setBookings(r.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id: number) => {
    if (!confirm('Отменить бронирование?')) return
    try {
      await bookingsApi.cancel(id)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b))
      toast.success('Бронирование отменено')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Ошибка')
    }
  }

  const handleSave = async () => {
    try {
      const res = await authApi.updateMe({
        name: form.name,
        phone: form.phone,
        child_age: form.child_age ? Number(form.child_age) : undefined,
      })
      setUser(res.data.data!)
      toast.success('Профиль обновлён')
      setEditMode(false)
    } catch {
      toast.error('Ошибка сохранения')
    }
  }

  return (
    <div className="container-page py-12">
      <h1 className="section-title mb-8">Личный кабинет</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6 h-fit">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center text-content-main text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            {user?.avatar_url && (
              <button
                onClick={handleDeleteAvatar}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
                title="Удалить фото"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-content-main font-bold text-lg">{user?.name}</h2>
              <p className="text-content-muted text-sm">{user?.email}</p>
              <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-accent' : user?.role === 'teacher' ? 'badge-primary' : 'badge-muted'}`}>
                {user?.role === 'admin' ? 'Администратор' : user?.role === 'teacher' ? 'Педагог' : 'Ученик'}
              </span>
            </div>
          </div>

          {!editMode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-content-muted">
                <Phone className="w-4 h-4" /> {user?.phone || 'Не указан'}
              </div>
              <div className="flex items-center gap-2 text-sm text-content-muted">
                <User className="w-4 h-4" /> Возраст ребёнка: {user?.child_age || 'Не указан'}
              </div>
              <button className="btn btn-secondary w-full mt-4" onClick={() => setEditMode(true)}>
                Редактировать профиль
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="label">Имя</label>
                <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Телефон</label>
                <input className="input" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="label">Возраст ребёнка</label>
                <input className="input" type="number" value={form.child_age} onChange={(e) => setForm((p) => ({ ...p, child_age: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary flex-1 btn-sm" onClick={() => setEditMode(false)}>Отмена</button>
                <button className="btn btn-primary flex-1 btn-sm" onClick={handleSave}>Сохранить</button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-content-main font-semibold text-xl mb-5 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary-400" /> Мои бронирования
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="card p-10 text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-content-main font-semibold mb-2">Нет бронирований</h3>
              <p className="text-content-muted text-sm mb-4">Запишитесь на любой понравившийся курс</p>
              <a href="/courses" className="btn btn-primary">Выбрать курс</a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-content-main font-semibold">
                        {booking.group?.course?.title || 'Курс'}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-content-muted">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {booking.child_name}, {booking.child_age} лет
                        </span>
                        {booking.group?.schedule && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {booking.group.schedule.weekday} {booking.group.schedule.time_start}
                          </span>
                        )}
                        <span className="text-content-muted text-xs">
                          {new Date(booking.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`badge ${STATUS_CLASS[booking.status] || 'badge-muted'}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                      {(booking.status === 'pending' || booking.status === 'waitlist') && (
                        <button
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
