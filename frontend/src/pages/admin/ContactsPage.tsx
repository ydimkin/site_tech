import { useEffect, useState } from 'react'
import { contactApi } from '@/api/misc'
import type { ContactMessage } from '@/types'
import toast from 'react-hot-toast'
import { MailOpen, Mail, Trash2 } from 'lucide-react'

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = () => contactApi.adminList().then((r) => setMessages(r.data.data || [])).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const markRead = async (id: number) => {
    try { await contactApi.markRead(id); fetch() }
    catch { toast.error('Ошибка') }
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить обращение?')) return
    try {
      await contactApi.delete(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast.success('Удалено')
    } catch {
      toast.error('Ошибка')
    }
  }

  const unread = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-main font-display">Обращения</h1>
        <p className="text-content-muted text-sm">{unread > 0 ? `${unread} непрочитанных` : 'Все прочитано'}</p>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />) :
          messages.length === 0 ? <div className="text-center py-16 text-content-muted">Обращений нет</div> :
          messages.map((m) => (
            <div key={m.id} className={`card p-5 ${!m.is_read ? 'border-primary-500/30 bg-primary-900/10' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {m.is_read ? <MailOpen className="w-4 h-4 text-content-muted flex-shrink-0" /> : <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />}
                    <span className="text-content-main font-semibold">{m.name}</span>
                    {m.subject && <span className="text-content-muted text-sm">— {m.subject}</span>}
                    {!m.is_read && <span className="badge-primary badge text-[10px]">Новое</span>}
                  </div>
                  <p className="text-content-muted text-sm mb-2 whitespace-pre-wrap break-words">{m.message}</p>
                  <div className="flex gap-4 text-xs text-content-muted flex-wrap">
                    <span>{m.email}</span>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{new Date(m.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!m.is_read && (
                    <button className="btn btn-secondary btn-sm" onClick={() => markRead(m.id)}>
                      Прочитано
                    </button>
                  )}
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => remove(m.id)} title="Удалить">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
