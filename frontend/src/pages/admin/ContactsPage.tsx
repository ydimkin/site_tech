import { useEffect, useState } from 'react'
import { contactApi } from '@/api/misc'
import type { ContactMessage } from '@/types'
import toast from 'react-hot-toast'
import { MailOpen, Mail } from 'lucide-react'

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = () => contactApi.adminList().then((r) => setMessages(r.data.data || [])).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const markRead = async (id: number) => {
    try { await contactApi.markRead(id); fetch() }
    catch { toast.error('Ошибка') }
  }

  const unread = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Обращения</h1>
        <p className="text-slate-400 text-sm">{unread > 0 ? `${unread} непрочитанных` : 'Все прочитано'}</p>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />) :
          messages.length === 0 ? <div className="text-center py-16 text-slate-500">Обращений нет</div> :
          messages.map((m) => (
            <div key={m.id} className={`card p-5 ${!m.is_read ? 'border-primary-500/30 bg-primary-900/10' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {m.is_read ? <MailOpen className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />}
                    <span className="text-white font-semibold">{m.name}</span>
                    {m.subject && <span className="text-slate-400 text-sm">— {m.subject}</span>}
                    {!m.is_read && <span className="badge-primary badge text-[10px]">Новое</span>}
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{m.message}</p>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>{m.email}</span>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{new Date(m.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                {!m.is_read && (
                  <button className="btn btn-secondary btn-sm flex-shrink-0" onClick={() => markRead(m.id)}>
                    Прочитано
                  </button>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
