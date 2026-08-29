import { useEffect, useState, useRef } from 'react'
import { documentsApi, uploadApi } from '@/api/misc'
import type { Document } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Upload, FileText, ExternalLink, ShieldAlert } from 'lucide-react'
import Modal from '@/components/common/Modal'

type FormState = { title: string; category: string; file_url: string }
const emptyForm: FormState = { title: '', category: 'charter', file_url: '' }

const CATEGORY_NAMES: Record<string, string> = {
  charter: 'Устав и учредительные документы',
  license: 'Образовательная лицензия',
  certificate: 'Сертификаты и аккредитации',
  other: 'Дополнительные документы',
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const res = await documentsApi.list()
      setDocuments(res.data.data || [])
    } catch {
      toast.error('Не удалось загрузить список документов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setModal(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      setForm((p) => ({ ...p, file_url: res.data.data.url }))
      toast.success('Файл успешно загружен!')
    } catch {
      toast.error('Ошибка при загрузке файла')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Введите название документа')
      return
    }
    if (!form.file_url) {
      toast.error('Загрузите файл документа')
      return
    }
    try {
      await documentsApi.create(form)
      toast.success('Документ успешно добавлен!')
      setModal(false)
      fetchDocs()
    } catch {
      toast.error('Ошибка при добавлении документа')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) return
    try {
      await documentsApi.delete(id)
      toast.success('Документ удален')
      fetchDocs()
    } catch {
      toast.error('Не удалось удалить документ')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content-main font-display">Официальные документы</h1>
          <p className="text-content-muted text-sm">Всего загружено: {documents.length}</p>
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Добавить документ
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl animate-pulse" />
          ))
        ) : documents.length === 0 ? (
          <div className="text-center py-20 bg-surface/30 border border-surface-border/50 rounded-2xl">
            <ShieldAlert className="w-12 h-12 text-content-muted/30 mx-auto mb-3" />
            <p className="text-content-muted text-sm">Документы не найдены. Нажмите «Добавить», чтобы опубликовать первый документ.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-slate-800 text-primary-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-content-main font-medium text-sm truncate">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-muted text-[10px] py-0.5">
                      {CATEGORY_NAMES[doc.category] || doc.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-icon btn-sm"
                  title="Просмотреть"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  className="btn btn-danger btn-icon btn-sm"
                  onClick={() => handleDelete(doc.id)}
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div className="card relative w-full max-w-lg p-4 sm:p-6 z-10 animate-slide-up max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-content-main font-bold text-lg">Добавление официального документа</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Название документа *</label>
                <input
                  className="input"
                  placeholder="Устав ООО Детский Технопарк"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Категория *</label>
                <select
                  className="input cursor-pointer"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {Object.entries(CATEGORY_NAMES).map(([key, value]) => (
                    <option key={key} value={key} className="bg-surface">
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Файл документа *</label>
                <div className="flex items-center gap-3">
                  {form.file_url ? (
                    <div className="flex items-center gap-2 bg-surface/50 border border-surface-border rounded-xl px-4 py-2 flex-1">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="text-content-main text-xs truncate flex-1">
                        {form.file_url.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm text-red-400 hover:text-red-300"
                        onClick={() => setForm((p) => ({ ...p, file_url: '' }))}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary flex items-center gap-2 justify-center py-2.5 w-full border border-dashed border-surface-border hover:border-primary-500/50 transition-all duration-300"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 text-content-muted" />
                      <span className="text-sm font-medium">
                        {uploading ? 'Загрузка...' : 'Выбрать файл документа'}
                      </span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <p className="text-[10px] text-content-muted mt-1.5">
                  Поддерживаются форматы PDF, Word, Excel, изображения. Макс. размер: 5 МБ.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn btn-secondary flex-1" onClick={() => setModal(false)}>
                Отмена
              </button>
              <button className="btn btn-primary flex-1" onClick={handleSubmit} disabled={uploading}>
                Добавить
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
