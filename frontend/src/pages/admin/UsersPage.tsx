import { useEffect, useState } from 'react'
import { adminApi } from '@/api/misc'
import type { User } from '@/types'
import toast from 'react-hot-toast'
import { ShieldCheck, ShieldOff, UserCheck, UserX } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = { admin: 'Администратор', teacher: 'Педагог', student: 'Ученик' }
const ROLE_CLASS: Record<string, string> = { admin: 'badge-accent', teacher: 'badge-primary', student: 'badge-muted' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    adminApi.listUsers().then((r: any) => setUsers(r.data.data || [])).finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [])

  const toggleActive = async (id: number) => {
    try { await adminApi.toggleUser(id); toast.success('Статус изменён'); fetch() }
    catch { toast.error('Ошибка') }
  }

  const changeRole = async (id: number, role: string) => {
    try { await adminApi.changeRole(id, role); toast.success('Роль изменена'); fetch() }
    catch { toast.error('Ошибка') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Пользователи</h1>
        <p className="text-slate-400 text-sm">Всего: {users.length}</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {['Пользователь', 'Email', 'Телефон', 'Роль', 'Статус', 'Действия'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-surface-border">
                  {Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                </tr>
              ))
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-surface-border hover:bg-surface/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <span className="text-slate-200">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400">{u.email}</td>
                <td className="px-4 py-3 text-slate-400">{u.phone || '—'}</td>
                <td className="px-4 py-3">
                  <select
                    className="select text-xs py-1 px-2"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option value="student">Ученик</option>
                    <option value="teacher">Педагог</option>
                    <option value="admin">Администратор</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                    {u.is_active ? 'Активен' : 'Заблокирован'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className={`btn btn-sm btn-icon ${u.is_active ? 'btn-danger' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'}`}
                    onClick={() => toggleActive(u.id)}
                    title={u.is_active ? 'Заблокировать' : 'Разблокировать'}
                  >
                    {u.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
