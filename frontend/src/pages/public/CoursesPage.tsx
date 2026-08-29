import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { categoriesApi } from '@/api/misc'
import type { Course, Category, CourseFilters } from '@/types'
import CourseCard from '@/components/common/CourseCard'
import { FadeIn, Stagger, StaggerItem } from '@/components/common/Animated'

const AGE_OPTIONS = [
  { label: 'Любой возраст', value: 0 },
  { label: '7–8 лет', value: 7 },
  { label: '9–10 лет', value: 9 },
  { label: '11–12 лет', value: 11 },
  { label: '13–14 лет', value: 13 },
  { label: '15–17 лет', value: 15 },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<CourseFilters>({ page: 1, page_size: 12 })

  useEffect(() => {
    categoriesApi.list().then((r) => setCategories(r.data.data || []))
  }, [])

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const r = await coursesApi.list(filters)
      setCourses(r.data.data || [])
      setTotal(r.data.total)
      setTotalPages(r.data.total_pages)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const updateFilter = (key: keyof CourseFilters, value: CourseFilters[keyof CourseFilters]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => setFilters({ page: 1, page_size: 12 })

  const hasActiveFilters = !!(filters.search || filters.category_id || filters.age)

  const Skeleton = () => (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  )

  return (
    <div className="container-page py-12">
      <FadeIn className="mb-10">
        <h1 className="section-title mb-2">Каталог курсов</h1>
        <p className="text-content-muted">
          {total > 0 ? `Найдено ${total} курс${total % 10 === 1 && total !== 11 ? '' : total % 10 < 5 && (total % 100 < 10 || total % 100 >= 20) ? 'а' : 'ов'}` : 'Загрузка...'}
        </p>
      </FadeIn>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
          <input
            type="text"
            placeholder="Поиск курсов..."
            className="input pl-10"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
          />
        </div>
        <button
          className={`btn btn-secondary flex items-center gap-2 ${showFilters ? 'border-primary-500 text-primary-400' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Фильтры</span>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
        </button>
        {hasActiveFilters && (
          <button className="btn btn-ghost btn-icon" onClick={clearFilters} title="Сбросить фильтры">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          <div>
            <label className="label">Направление</label>
            <select
              className="select"
              value={filters.category_id || ''}
              onChange={(e) => updateFilter('category_id', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Все направления</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Возраст ребёнка</label>
            <select
              className="select"
              value={filters.age || ''}
              onChange={(e) => updateFilter('age', e.target.value ? Number(e.target.value) : undefined)}
            >
              {AGE_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value || ''}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Макс. цена (₽/мес)</label>
            <input
              type="number"
              placeholder="Любая"
              className="input"
              value={filters.max_price || ''}
              onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-content-main font-semibold text-xl mb-2">Курсы не найдены</h3>
          <p className="text-content-muted mb-6">Попробуйте изменить параметры поиска</p>
          <button onClick={clearFilters} className="btn btn-primary">Сбросить фильтры</button>
        </div>
      ) : (
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" whileInView={false}>
          {courses.map((course) => (
            <StaggerItem key={course.id}>
              <CourseCard course={course} />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            className="btn btn-secondary btn-sm"
            disabled={filters.page === 1}
            onClick={() => updateFilter('page', (filters.page || 1) - 1)}
          >
            ← Назад
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${filters.page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('page', i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-secondary btn-sm"
            disabled={filters.page === totalPages}
            onClick={() => updateFilter('page', (filters.page || 1) + 1)}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  )
}
