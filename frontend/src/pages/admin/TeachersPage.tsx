import { useEffect, useState } from 'react'
import { teachersApi } from '@/api/misc'
import type { Teacher } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

type FormState = { name: string; position: string; description: string; photo_url: string; experience: string; subjects: string }
const emptyForm: FormState = { name: '', position: '', description: '', photo_url: '', experience: '', subjects: '' }

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const fetch = () => teachersApi.list().then((r) => setTeachers(r.data.data || []))
  useEffect(() => { fetch() }, [])

  const openEdit = (t: Teacher) => {
    setEditing(t)
    setForm({ name: t.name, position: t.position, description: t.description, photo_url: t.photo_url, experience: String(t.experience), subjects: t.subjects })
    setModal(true)
  }

  const handleSubmit = async () => {
    const payload = { ...form, experience: Number(form.experience) }
    try {
      if (editing) await teachersApi.update(editing.id, payload)
      else await teachersApi.create(payload)
      toast.success(editing ? 'Педагог обновлён' : 'Педагог добавлен')
      setModal(false); fetch()
    } catch { toast.error('Ошибка') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить педагога?')) return
    try { await teachersApi.delete(id); toast.success('Удалено'); fetch() }
    catch { toast.error('Ошибка') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-display">Педагоги</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setModal(true) }}>
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {t.photo_url ? <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" /> : t.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{t.name}</h3>
                <p className="text-primary-400 text-xs">{t.position}</p>
              </div>
            </div>
            {t.subjects && <p className="text-slate-400 text-xs mb-3">{t.subjects}</p>}
            <div className="flex gap-2">
              <button className="btn btn-secondary flex-1 btn-sm" onClick={() => openEdit(t)}><Pencil className="w-3.5 h-3.5" /> Изменить</button>
              <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(t.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="card relative w-full max-w-md p-6 z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editing ? 'Изменить педагога' : 'Новый педагог'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Имя *', type: 'text', placeholder: 'Иван Иванович' },
                { key: 'position', label: 'Должность', type: 'text', placeholder: 'Педагог робототехники' },
                { key: 'photo_url', label: 'URL фото', type: 'text', placeholder: 'https://...' },
                { key: 'experience', label: 'Лет опыта', type: 'number', placeholder: '5' },
                { key: 'subjects', label: 'Предметы', type: 'text', placeholder: 'Робототехника, Arduino' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input" type={type} placeholder={placeholder}
                    value={form[key as keyof FormState]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="label">Описание</label>
                <textarea className="input resize-none" rows={3} value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
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
