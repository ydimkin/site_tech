import { useEffect, useState } from 'react'
import { teachersApi } from '@/api/misc'
import type { Teacher } from '@/types'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    teachersApi.list().then((r) => setTeachers(r.data.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container-page py-12">
      <h1 className="section-title mb-2">Наши педагоги</h1>
      <p className="section-subtitle mb-10">Профессионалы с горящими глазами и настоящей любовью к делу</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-20 text-slate-400">Педагоги скоро появятся</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div key={t.id} className="card-hover p-6 text-center group">
              <div className="w-24 h-24 rounded-2xl bg-primary-gradient mx-auto mb-5 flex items-center justify-center text-white text-3xl font-bold overflow-hidden group-hover:scale-105 transition-transform">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
                ) : t.name[0]}
              </div>
              <h3 className="text-white font-bold text-lg">{t.name}</h3>
              <p className="text-primary-400 text-sm font-medium mt-1">{t.position}</p>
              {t.experience > 0 && (
                <p className="text-slate-400 text-xs mt-1">{t.experience} лет опыта</p>
              )}
              {t.subjects && (
                <p className="text-slate-500 text-xs mt-2">{t.subjects}</p>
              )}
              {t.description && (
                <p className="text-slate-400 text-sm mt-3 leading-relaxed line-clamp-3">{t.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
