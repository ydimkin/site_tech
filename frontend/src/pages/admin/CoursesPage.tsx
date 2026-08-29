import { useEffect, useState, useRef } from 'react'
import { coursesApi } from '@/api/courses'
import { categoriesApi, teachersApi, uploadApi } from '@/api/misc'
import type { Course, Category, Teacher } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import MarkdownEditor from '@/components/common/MarkdownEditor'
import Modal from '@/components/common/Modal'

type FormState = {
  title: string; description: string; category_id: string; teacher_id: string;
  age_min: string; age_max: string; price: string; duration: string; image_url: string; is_featured: boolean;
}

const emptyForm: FormState = {
  title: '', description: '', category_id: '', teacher_id: '',
  age_min: '', age_max: '', price: '', duration: '', image_url: '', is_featured: false,
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const imgRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadApi.upload(file)
      setForm((p) => ({ ...p, image_url: res.data.data.url }))
      toast.success('Изображение загружено')
    } catch {
      toast.error('Ошибка загрузки')
    }
  }

  const fetch = async () => {
    setLoading(true)
    const r = await coursesApi.list({ page: 1, page_size: 100 })
    setCourses(r.data.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetch()
    categoriesApi.list().then((r) => setCategories(r.data.data || []))
    teachersApi.list().then((r) => setTeachers(r.data.data || []))
  }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (c: Course) => {
    setEditing(c)
    setForm({
      title: c.title, description: c.description, category_id: String(c.category_id),
      teacher_id: String(c.teacher_id), age_min: String(c.age_min), age_max: String(c.age_max),
      price: String(c.price), duration: String(c.duration), image_url: c.image_url, is_featured: c.is_featured,
    })
    setModal(true)
  }

  const handleSubmit = async () => {
    if (!form.category_id || !form.teacher_id) {
      toast.error('Необходимо выбрать категорию и педагога')
      return
    }
    const payload = {
      title: form.title, description: form.description, category_id: Number(form.category_id),
      teacher_id: Number(form.teacher_id), age_min: Number(form.age_min), age_max: Number(form.age_max),
      price: Number(form.price), duration: Number(form.duration), image_url: form.image_url, is_featured: form.is_featured,
    }
    try {
      if (editing) await coursesApi.update(editing.id, payload)
      else await coursesApi.create(payload)
      toast.success(editing ? 'Курс обновлён' : 'Курс создан')
      setModal(false)
      fetch()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Ошибка')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить курс?')) return
    try {
      await coursesApi.delete(id)
      toast.success('Курс удалён')
      fetch()
    } catch { toast.error('Ошибка удаления') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-content-main font-display">Курсы</h1>
        <button className="btn btn-primary w-full sm:w-auto" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Добавить курс
        </button>
      </div>

      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-surface-border">
              {['Курс', 'Категория', 'Педагог', 'Возраст', 'Цена', 'Статус', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-content-muted font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-surface-border">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : courses.map((c) => (
              <tr key={c.id} className="border-b border-surface-border hover:bg-surface/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-content-main font-medium">{c.title}</div>
                  {c.is_featured && <span className="badge-accent badge text-[10px]">Топ</span>}
                </td>
                <td className="px-4 py-3 text-content-muted">{c.category?.name || '—'}</td>
                <td className="px-4 py-3 text-content-muted">{c.teacher?.name || '—'}</td>
                <td className="px-4 py-3 text-content-muted">{c.age_min}–{c.age_max} лет</td>
                <td className="px-4 py-3 text-content-muted">{c.price.toLocaleString('ru-RU')} ₽</td>
                <td className="px-4 py-3">
                  <span className={c.is_active ? 'badge-success badge' : 'badge-danger badge'}>
                    {c.is_active ? 'Активен' : 'Скрыт'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />) :
          courses.map((c) => (
            <div key={c.id} className="card p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-content-main font-medium">{c.title}</div>
                  <div className="text-content-muted text-xs mt-0.5">
                    {c.category?.name || '—'} · {c.age_min}–{c.age_max} лет
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {c.is_featured && <span className="badge-accent badge text-[10px]">Топ</span>}
                  <span className={`badge text-[10px] ${c.is_active ? 'badge-success' : 'badge-danger'}`}>
                    {c.is_active ? 'Активен' : 'Скрыт'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                <div className="text-xs text-content-muted truncate">
                  {c.teacher?.name || '—'} · {c.price > 0 ? `${c.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div className="card relative w-full max-w-2xl p-4 sm:p-6 z-10 animate-slide-up max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-content-main font-bold text-lg">{editing ? 'Редактировать курс' : 'Новый курс'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Название *</label>
                <input className="input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="label">Описание (поддерживает Markdown — можно вставлять фото в любое место)</label>
                <MarkdownEditor
                  value={form.description}
                  onChange={(description) => setForm((p) => ({ ...p, description }))}
                  rows={8}
                  placeholder="## О курсе&#10;&#10;Опишите программу курса. Используйте **жирный** текст и *курсив*.&#10;&#10;Вставляйте фото прямо в описание с помощью кнопки 'Фото'."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Категория</label>
                  <select className="select" value={form.category_id} onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}>
                    <option value="">Выбрать</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Педагог</label>
                  <select className="select" value={form.teacher_id} onChange={(e) => setForm((p) => ({ ...p, teacher_id: e.target.value }))}>
                    <option value="">Выбрать</option>
                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Возраст от</label>
                  <input className="input" type="number" value={form.age_min} onChange={(e) => setForm((p) => ({ ...p, age_min: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Возраст до</label>
                  <input className="input" type="number" value={form.age_max} onChange={(e) => setForm((p) => ({ ...p, age_max: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Цена (₽/мес)</label>
                  <input className="input" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Длительность (мес)</label>
                  <input className="input" type="number" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Изображение</label>
                <div className="flex flex-wrap items-center gap-3">
                  {form.image_url && <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => imgRef.current?.click()}>
                    <Upload className="w-4 h-4" /> Загрузить
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setForm((p) => ({ ...p, image_url: '' }))}>Очистить
                  </button>
                  <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                <span className="text-content-muted text-sm">Отобразить на главной странице</span>
              </label>
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
