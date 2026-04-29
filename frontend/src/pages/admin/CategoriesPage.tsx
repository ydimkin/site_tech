import { useEffect, useState } from 'react'
import { categoriesApi } from '@/api/misc'
import type { Category } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const PRESET_COLORS = ['#3b82f6', '#7c3aed', '#f97316', '#22c55e', '#ef4444', '#06b6d4', '#ec4899', '#f59e0b']

type FormState = { name: string; icon: string; color: string }
const emptyForm: FormState = { name: '', icon: '📚', color: '#3b82f6' }

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const fetch = () => categoriesApi.list().then((r) => setCats(r.data.data || []))
  useEffect(() => { fetch() }, [])

  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, icon: c.icon, color: c.color }); setModal(true) }

  const handleSubmit = async () => {
    try {
      if (editing) await categoriesApi.update(editing.id, form)
      else await categoriesApi.create(form)
      toast.success(editing ? 'Категория обновлена' : 'Категория создана')
      setModal(false); fetch()
    } catch { toast.error('Ошибка') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить категорию?')) return
    try { await categoriesApi.delete(id); toast.success('Удалено'); fetch() }
    catch { toast.error('Ошибка') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-display">Категории</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setModal(true) }}>
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((c) => (
          <div key={c.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: c.color + '30' }}>
                {c.icon || '📚'}
              </div>
              <span className="text-white text-sm font-medium">{c.name}</span>
            </div>
            <div className="flex gap-1">
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}><Pencil className="w-3.5 h-3.5" /></button>
              <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(c.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="card relative w-full max-w-sm p-6 z-10 animate-slide-up">
            <div className="flex justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editing ? 'Изменить' : 'Новая категория'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Название *</label>
                <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Иконка (emoji)</label>
                <input className="input text-2xl" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
              </div>
              <div>
                <label className="label">Цвет</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-7 h-7 rounded-lg transition-transform ${form.color === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
                      style={{ background: color }}
                      onClick={() => setForm((p) => ({ ...p, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-secondary flex-1" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn btn-primary flex-1" onClick={handleSubmit}>{editing ? 'Сохранить' : 'Создать'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
