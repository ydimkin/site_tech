import { Link } from 'react-router-dom'
import { Clock, Users, Star, ChevronRight, BookOpen } from 'lucide-react'
import type { Course } from '@/types'

interface Props {
  course: Course
}

const FALLBACK_COLORS = [
  'from-blue-600 to-cyan-500',
  'from-violet-600 to-purple-500',
  'from-orange-600 to-amber-500',
  'from-emerald-600 to-teal-500',
  'from-rose-600 to-pink-500',
  'from-sky-600 to-indigo-500',
]

export default function CourseCard({ course }: Props) {
  const colorIdx = course.id % FALLBACK_COLORS.length
  const gradientClass = FALLBACK_COLORS[colorIdx]

  return (
    <Link to={`/courses/${course.id}`} className="card-hover group flex flex-col overflow-hidden">
      {/* Image / Gradient */}
      <div className="relative h-48 overflow-hidden">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <BookOpen className="w-14 h-14 text-white/30" />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          {course.price > 0 ? (
            <span className="badge-primary badge font-semibold">
              {course.price.toLocaleString('ru-RU')} ₽/мес
            </span>
          ) : (
            <span className="badge-success badge">Бесплатно</span>
          )}
        </div>

        {/* Featured badge */}
        {course.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="badge-accent badge">⭐ Топ</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        {course.category && (
          <span className="text-primary-400 text-xs font-medium mb-2">{course.category.name}</span>
        )}

        <h3 className="text-white font-semibold text-base mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{course.age_min}–{course.age_max} лет</span>
          </div>
          {course.duration > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration} мес.</span>
            </div>
          )}
        </div>

        {/* Teacher & CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-border">
          {course.teacher && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold">
                {course.teacher.name[0]}
              </div>
              <span className="text-slate-400 text-xs">{course.teacher.name}</span>
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all ml-auto" />
        </div>
      </div>
    </Link>
  )
}
