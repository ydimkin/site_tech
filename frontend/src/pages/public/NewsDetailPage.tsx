import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { newsApi } from '@/api/misc'
import type { News } from '@/types'
import { ChevronLeft, Calendar, X, ChevronRight } from 'lucide-react'
import { renderMarkdown } from '@/utils/markdown'

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    newsApi.getById(Number(id)).then((r) => setNews(r.data.data || null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="container-page py-12"><div className="skeleton h-96 rounded-2xl" /></div>
  if (!news) return <div className="container-page py-24 text-center text-content-muted">Новость не найдена</div>

  const allImages = news.images?.length ? news.images : []

  return (
    <div className="container-page py-12 max-w-3xl">
      <Link to="/news" className="inline-flex items-center gap-1.5 text-content-muted hover:text-primary-400 text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Все новости
      </Link>

      {news.image_url && (
        <div className="rounded-2xl overflow-hidden h-72 mb-8">
          <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 text-content-muted text-sm mb-4">
        <Calendar className="w-4 h-4" />
        {news.published_at ? new Date(news.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
      </div>

      <h1 className="text-3xl font-bold text-content-main font-display mb-6">{news.title}</h1>

      <div
        className="prose-custom text-content-muted leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(news.content) }}
      />

      {allImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-content-main font-semibold text-lg mb-4">Фотогалерея</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allImages.map((url, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLightbox(idx)}
              >
                <img src={url} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
            <X className="w-8 h-8" />
          </button>
          {lightbox > 0 && (
            <button className="absolute left-4 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}>
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}
          {lightbox < allImages.length - 1 && (
            <button className="absolute right-4 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}>
              <ChevronRight className="w-10 h-10" />
            </button>
          )}
          <img
            src={allImages[lightbox]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/60 text-sm">{lightbox + 1} / {allImages.length}</div>
        </div>
      )}
    </div>
  )
}
