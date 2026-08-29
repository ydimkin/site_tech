import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Clock, Users, Star, Calendar, CheckCircle } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { bookingsApi } from '@/api/bookings'
import client from '@/api/client'
import type { Course, Review } from '@/types'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { renderMarkdown } from '@/utils/markdown'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingGroupId, setBookingGroupId] = useState<number | null>(null)
  const [bookingModal, setBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({ child_name: '', child_age: '', parent_phone: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)


  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchReviews = () => {
    if (!id) return
    client.get(`/courses/${id}/reviews`).then((r: any) => {
      setReviews(r.data.data || [])
    })
  }

  useEffect(() => {
    if (!id) return
    coursesApi.getById(Number(id)).then((res) => {
      setCourse(res.data.data || null)
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    fetchReviews()
  }, [id])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы оставить отзыв')
      return
    }
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error('Выберите оценку от 1 до 5')
      return
    }
    setSubmittingReview(true)
    try {
      await client.post(`/courses/${id}/reviews`, {
        rating: reviewRating,
        text: reviewText.trim()
      })
      toast.success('Отзыв успешно добавлен!')
      setReviewText('')
      setReviewRating(5)
      fetchReviews()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при добавлении отзыва')
    } finally {
      setSubmittingReview(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!bookingGroupId) { toast.error('Выберите группу'); return }
    if (!bookingForm.child_name.trim()) { toast.error('Введите имя ребёнка'); return }
    if (!bookingForm.child_age) { toast.error('Введите возраст ребёнка'); return }
    setSubmitting(true)
    try {
      await bookingsApi.create({
        group_id: bookingGroupId,
        child_name: bookingForm.child_name,
        child_age: Number(bookingForm.child_age),
        parent_phone: bookingForm.parent_phone,
        comment: bookingForm.comment,
      })
      toast.success('Заявка подана! Ожидайте подтверждения.')
      setBookingModal(false)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Ошибка при бронировании')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="container-page py-12">
      <div className="skeleton h-8 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-64" />
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-4 w-full" />
        </div>
        <div className="skeleton h-64" />
      </div>
    </div>
  )

  if (!course) return (
    <div className="container-page py-24 text-center">
      <h2 className="text-content-main text-2xl font-bold mb-4">Курс не найден</h2>
      <Link to="/courses" className="btn btn-primary">К каталогу</Link>
    </div>
  )

  return (
    <div className="container-page py-12">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-content-muted hover:text-primary-400 text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Назад к курсам
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden h-72 bg-primary-gradient flex items-center justify-center">
            {course.image_url ? (
              <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-content-main/20 text-8xl font-bold font-display">{course.title[0]}</div>
            )}
          </div>

          <div>
            {course.category && (
              <span className="badge-primary badge mb-3">{course.category.name}</span>
            )}
            <h1 className="text-3xl font-bold text-content-main font-display mb-3">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-content-muted">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.age_min}–{course.age_max} лет</span>
              {course.duration > 0 && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duration} месяца</span>}
              {avgRating && <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400" />{avgRating} ({reviews.length} отзывов)</span>}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-content-main font-semibold text-lg mb-3">О курсе</h2>
            {course.description ? (
              <div
                className="text-content-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }}
              />
            ) : (
              <p className="text-content-muted leading-relaxed">Описание скоро появится.</p>
            )}
          </div>

          {(course.groups?.length ?? 0) > 0 && (
            <div className="card p-6">
              <h2 className="text-content-main font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-400" /> Расписание групп
              </h2>
              <div className="space-y-3">
                {course.groups?.map((g) => {
                  const isFull = g.current_students >= g.capacity
                  return (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        bookingGroupId === g.id
                          ? 'border-primary-500 bg-primary-900/20'
                          : isFull
                          ? 'border-slate-700 bg-surface/40 opacity-60 cursor-not-allowed'
                          : 'border-surface-border hover:border-primary-500/50 hover:bg-surface'
                      }`}
                      onClick={() => !isFull && setBookingGroupId(g.id)}
                    >
                      <div>
                        <div className="text-content-main text-sm font-medium">
                          {g.schedule?.weekday} {g.schedule?.time_start}–{g.schedule?.time_end}
                        </div>
                        <div className="text-content-muted text-xs mt-0.5">
                          Начало: {new Date(g.start_date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                          {isFull ? 'Нет мест' : `${g.capacity - g.current_students} мест`}
                        </div>
                        <div className="text-content-muted text-xs">{g.current_students}/{g.capacity}</div>
                      </div>
                      {bookingGroupId === g.id && <CheckCircle className="w-5 h-5 text-primary-400 ml-3 flex-shrink-0" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-content-main font-semibold text-lg mb-4">Отзывы ({reviews.length})</h2>
            
            {reviews.length > 0 ? (
              <div className="space-y-4 mb-6">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-surface-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-content-main text-xs font-bold">
                        {r.user?.name ? r.user.name[0].toUpperCase() : '?'}
                      </div>
                      <span className="text-content-muted text-sm font-medium">{r.user?.name || 'Пользователь'}</span>
                      <div className="flex gap-0.5 ml-auto">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    {r.text && <p className="text-content-muted text-sm bg-surface/40 p-3 rounded-xl border border-surface-border/50">{r.text}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-content-muted text-sm mb-6">Отзывов пока нет. Станьте первым, кто оставит свой отзыв!</p>
            )}

            <div className="border-t border-surface-border pt-6 mt-6">
              <h3 className="text-content-main font-semibold text-base mb-3">Оставить отзыв</h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="label mb-1">Оценка *</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className="focus:outline-none transition-transform active:scale-95 hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              num <= reviewRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-600 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label mb-1">Ваш комментарий</label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      placeholder="Поделитесь вашим впечатлением о курсе..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Отправка...' : 'Отправить отзыв'}
                  </button>
                </form>
              ) : (
                <div className="bg-surface/50 border border-surface-border rounded-xl p-4 text-center">
                  <p className="text-content-muted text-sm mb-3">
                    Только авторизованные пользователи могут оставлять отзывы.
                  </p>
                  <Link to="/login" className="btn btn-secondary btn-sm inline-flex">
                    Войти в аккаунт
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6 sticky top-24">
            <div className="text-3xl font-bold text-content-main font-display mb-1">
              {course.price > 0 ? `${course.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}
            </div>
            {course.price > 0 && <div className="text-content-muted text-sm mb-5">в месяц</div>}

            {course.teacher && (
              <div className="flex items-center gap-3 mb-5 p-3 bg-surface/60 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-content-main font-bold flex-shrink-0">
                  {course.teacher.name[0]}
                </div>
                <div>
                  <div className="text-content-main text-sm font-medium">{course.teacher.name}</div>
                  <div className="text-content-muted text-xs">{course.teacher.position}</div>
                </div>
              </div>
            )}

            {(course.groups?.length ?? 0) > 0 ? (
              <button
                className="btn btn-primary w-full btn-lg"
                onClick={() => {
                  if (!bookingGroupId) { toast.error('Выберите группу в расписании'); return }
                  if (!isAuthenticated) { navigate('/login'); return }
                  setBookingModal(true)
                }}
              >
                Записаться
              </button>
            ) : (
              <Link to="/contact" className="btn btn-accent w-full btn-lg">
                Записаться на ожидание
              </Link>
            )}

            <div className="mt-4 space-y-2">
              {[
                `Возраст: ${course.age_min}–${course.age_max} лет`,
                course.duration ? `Длительность: ${course.duration} мес.` : null,
              ].filter(Boolean).map((item) => (
                <div key={item as string} className="flex items-center gap-2 text-sm text-content-muted">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setBookingModal(false)} />
          <div className="card relative w-full max-w-md p-6 z-10 animate-slide-up">
            <h3 className="text-content-main font-bold text-xl mb-5 font-display">Оформление заявки</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Имя ребёнка *</label>
                <input className="input" placeholder="Иван Петров" value={bookingForm.child_name}
                  onChange={(e) => setBookingForm((p) => ({ ...p, child_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Возраст ребёнка *</label>
                <input className="input" type="number" min="5" max="18" placeholder="10"
                  value={bookingForm.child_age}
                  onChange={(e) => setBookingForm((p) => ({ ...p, child_age: e.target.value }))} />
              </div>
              <div>
                <label className="label">Телефон родителя</label>
                <input className="input" placeholder="+7 (999) 000-00-00" value={bookingForm.parent_phone}
                  onChange={(e) => setBookingForm((p) => ({ ...p, parent_phone: e.target.value }))} />
              </div>
              <div>
                <label className="label">Комментарий</label>
                <textarea className="input resize-none" rows={3} placeholder="Дополнительная информация..."
                  value={bookingForm.comment}
                  onChange={(e) => setBookingForm((p) => ({ ...p, comment: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-secondary flex-1" onClick={() => setBookingModal(false)}>Отмена</button>
              <button className="btn btn-primary flex-1" onClick={handleBook} disabled={submitting}>
                {submitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
