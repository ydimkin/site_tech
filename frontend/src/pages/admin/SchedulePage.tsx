import { useEffect, useState } from 'react'
import { scheduleApi } from '@/api/misc'
import { coursesApi } from '@/api/courses'
import type { Schedule, Course } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Clock } from 'lucide-react'
import Modal from '@/components/common/Modal'

const WEEKDAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

type FormState = { course_id: number; weekday: string; time_start: string; time_end: string; capacity: number }
const emptyForm: FormState = { course_id: 0, weekday: 'Понедельник', time_start: '09:00', time_end: '10:00', capacity: 12 }

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Schedule | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    const r = await scheduleApi.adminList()
    setSchedules(r.data.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetch()
    coursesApi.list({ page_size: 100 }).then((r) => setCourses(r.data.data || []))
  }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (s: Schedule) => {
    setEditing(s)
    setForm({ course_id: s.course_id, weekday: s.weekday, time_start: s.time_start, time_end: s.time_end, capacity: s.capacity })
    setModal(true)
  }

  const handleSubmit = async () => {
    if (!form.course_id) { toast.error('Выберите курс'); return }
    try {
      if (editing) await scheduleApi.update(editing.id, form)
      else await scheduleApi.create(form)
      toast.success(editing ? 'Расписание обновлено' : 'Расписание создано')
      setModal(false)
      fetch()
    } catch { toast.error('Ошибка') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить запись расписания?')) return
    try { await scheduleApi.delete(id); toast.success('Удалено'); fetch() }
    catch { toast.error('Ошибка') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content-main light:text-slate-900 font-display">Расписание</h1>
          <p className="text-content-muted light:text-content-muted text-sm">Всего: {schedules.length}</p>
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</button>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />) :
          schedules.map((s) => (
            <div key={s.id} className="card p-4 flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-content-main light:text-slate-900 font-medium truncate">{s.course?.title || `Курс #${s.course_id}`}</h3>
                <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                  <span className="badge badge-primary text-[10px] sm:text-xs">{s.weekday}</span>
                  <span className="text-content-muted light:text-content-muted text-xs sm:text-sm">{s.time_start}–{s.time_end}</span>
                  <span className="text-content-muted light:text-content-muted text-xs">до {s.capacity} чел.</span>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(s.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        }
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div className="card relative w-full max-w-lg p-4 sm:p-6 z-10 animate-slide-up max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-content-main light:text-slate-900 font-bold text-lg">{editing ? 'Редактировать' : 'Новая запись'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Курс *</label>
                <select className="input" value={form.course_id} onChange={(e) => setForm((p) => ({ ...p, course_id: Number(e.target.value) }))}>
                  <option value={0}>— Выберите курс —</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">День недели *</label>
                <select className="input" value={form.weekday} onChange={(e) => setForm((p) => ({ ...p, weekday: e.target.value }))}>
                  {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Начало *</label>
                  <input type="time" className="input" value={form.time_start} onChange={(e) => setForm((p) => ({ ...p, time_start: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Конец *</label>
                  <input type="time" className="input" value={form.time_end} onChange={(e) => setForm((p) => ({ ...p, time_end: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Вместимость</label>
                <input type="number" className="input" min={1} value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-secondary flex-1" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn btn-primary flex-1" onClick={handleSubmit}>{editing ? 'Сохранить' : 'Создать'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
