import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { newsApi } from '@/api/misc'
import type { News } from '@/types'
import { FadeIn, Stagger, StaggerItem } from '@/components/common/Animated'

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    newsApi.list(page).then((r) => {
      setNews(r.data.data || [])
      setTotalPages(r.data.total_pages)
    }).finally(() => setLoading(false))
  }, [page])

  return (
    <div className="container-page py-12">
      <FadeIn>
        <h1 className="section-title mb-2">Новости</h1>
        <p className="section-subtitle mb-10">Последние события технопарка</p>
      </FadeIn>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-48 rounded-none" />
              <div className="p-5 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 text-content-muted">Новостей пока нет</div>
      ) : (
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6" whileInView={false}>
          {news.map((item) => (
            <StaggerItem key={item.id}>
              <Link to={`/news/${item.id}`} className="card-hover group overflow-hidden block">
                <div className="h-52 overflow-hidden bg-primary-gradient/20">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-content-muted text-xs mb-2">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                  <h2 className="text-content-main font-semibold leading-snug group-hover:text-primary-300 transition-colors">{item.title}</h2>
                  {item.preview && <p className="text-content-muted text-sm mt-2 line-clamp-3">{item.preview}</p>}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
