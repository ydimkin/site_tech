import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { newsApi } from '@/api/misc'
import type { News } from '@/types'
import { ChevronLeft, Calendar } from 'lucide-react'

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    newsApi.getById(Number(id)).then((r) => setNews(r.data.data || null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="container-page py-12"><div className="skeleton h-96 rounded-2xl" /></div>
  if (!news) return <div className="container-page py-24 text-center text-slate-400">Новость не найдена</div>

  return (
    <div className="container-page py-12 max-w-3xl">
      <Link to="/news" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-primary-400 text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Все новости
      </Link>

      {news.image_url && (
        <div className="rounded-2xl overflow-hidden h-72 mb-8">
          <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
        <Calendar className="w-4 h-4" />
        {news.published_at ? new Date(news.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
      </div>

      <h1 className="text-3xl font-bold text-white font-display mb-6">{news.title}</h1>
      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{news.content}</div>
    </div>
  )
}
