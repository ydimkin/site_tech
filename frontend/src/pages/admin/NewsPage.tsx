import { useEffect, useState, useRef } from 'react'
import { newsApi, uploadApi } from '@/api/misc'
import type { News } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import MarkdownEditor from '@/components/common/MarkdownEditor'
import Modal from '@/components/common/Modal'

type FormState = { title: string; preview: string; content: string; image_url: string; images: string[]; is_published: boolean }
const emptyForm: FormState = { title: '', preview: '', content: '', image_url: '', images: [], is_published: false }

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<News | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const fetch = async () => {
    setLoading(true)
    const r = await newsApi.list(1, 100)
    setNews(r.data.data || [])
    setTotal(r.data.total)
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (n: News) => {
    setEditing(n)
    setForm({ title: n.title, preview: n.preview, content: n.content, image_url: n.image_url, images: n.images || [], is_published: n.is_published })
    setModal(true)
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      setForm(p => ({ ...p, image_url: res.data.data.url }))
    } catch { toast.error('Ошибка загрузки') }
    finally { setUploading(false) }
  }

  const handleSubmit = async () => {
    try {
      if (editing) await newsApi.update(editing.id, form)
      else await newsApi.create(form)
      toast.success(editing ? 'Новость обновлена' : 'Новость создана')
      setModal(false)
      fetch()
    } catch { toast.error('Ошибка') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить новость?')) return
    try { await newsApi.delete(id); toast.success('Удалено'); fetch() }
    catch { toast.error('Ошибка') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content-main font-display">Новости</h1>
          <p className="text-content-muted text-sm">Всего: {total}</p>
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</button>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />) :
          news.map((n) => (
            <div key={n.id} className="card p-4 flex items-center gap-4">
              {n.image_url && <img src={n.image_url} alt={n.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-content-main font-medium truncate">{n.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`badge ${n.is_published ? 'badge-success' : 'badge-muted'}`}>
                    {n.is_published ? 'Опубликовано' : 'Черновик'}
                  </span>
                  {n.images?.length > 0 && <span className="text-content-muted text-xs">{n.images.length} фото</span>}
                  <span className="text-content-muted text-xs">
                    {n.published_at ? new Date(n.published_at).toLocaleDateString('ru-RU') : new Date(n.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(n)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(n.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        }
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div className="card relative w-full max-w-3xl p-4 sm:p-6 z-10 animate-slide-up max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-content-main font-bold text-lg">{editing ? 'Редактировать новость' : 'Новая новость'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Заголовок *</label>
                <input className="input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="label">Анонс (краткое описание)</label>
                <textarea className="input resize-none" rows={2} value={form.preview} onChange={(e) => setForm((p) => ({ ...p, preview: e.target.value }))} />
              </div>

              <div>
                <label className="label">Полный текст * (поддерживает Markdown)</label>
                <MarkdownEditor
                  value={form.content}
                  onChange={(content) => setForm((p) => ({ ...p, content }))}
                  rows={12}
                  placeholder="# Заголовок&#10;&#10;Текст новости с **жирным** и *курсивом*..."
                />
              </div>

              <div>
                <label className="label">Обложка</label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <div className="relative">
                      <img src={form.image_url} alt="cover" className="w-24 h-16 rounded-lg object-cover" />
                      <button className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center" onClick={() => setForm(p => ({ ...p, image_url: '' }))}>
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : null}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => coverRef.current?.click()} disabled={uploading}>
                    <Upload className="w-3.5 h-3.5" /> {uploading ? 'Загрузка...' : 'Загрузить'}
                  </button>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                <span className="text-content-muted text-sm">Опубликовать сразу</span>
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
