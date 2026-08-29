import { useEffect, useState } from 'react'
import { adminApi } from '@/api/misc'
import type { User } from '@/types'
import toast from 'react-hot-toast'
import { UserCheck, UserX } from 'lucide-react'

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
        <h1 className="text-2xl font-bold text-content-main font-display">Пользователи</h1>
        <p className="text-content-muted text-sm">Всего: {users.length}</p>
      </div>

      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-surface-border">
              {['Пользователь', 'Email', 'Телефон', 'Роль', 'Статус', 'Действия'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-content-muted font-medium">{h}</th>
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
                    <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-content-main text-xs font-bold flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <span className="text-content-main">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-content-muted">{u.email}</td>
                <td className="px-4 py-3 text-content-muted">{u.phone || '—'}</td>
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

      <div className="space-y-3 md:hidden">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />) :
          users.map((u) => (
            <div key={u.id} className="card p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-content-main text-sm font-bold flex-shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-content-main font-medium truncate">{u.name}</div>
                  <div className="text-content-muted text-xs truncate">{u.email}</div>
                  {u.phone && <div className="text-content-muted text-xs">{u.phone}</div>}
                </div>
                <span className={`badge text-[10px] flex-shrink-0 ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {u.is_active ? 'Активен' : 'Заблок.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="select text-xs py-1.5 px-2 flex-1"
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option value="student">Ученик</option>
                  <option value="teacher">Педагог</option>
                  <option value="admin">Администратор</option>
                </select>
                <button
                  className={`btn btn-sm btn-icon flex-shrink-0 ${u.is_active ? 'btn-danger' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'}`}
                  onClick={() => toggleActive(u.id)}
                  title={u.is_active ? 'Заблокировать' : 'Разблокировать'}
                >
                  {u.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
