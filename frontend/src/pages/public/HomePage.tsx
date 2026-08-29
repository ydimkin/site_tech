import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, Users, BookOpen, Award, Rocket, Cpu, Code2, Wrench, Layers, Zap, ArrowRight } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { teachersApi, newsApi } from '@/api/misc'
import type { Course, Teacher, News } from '@/types'
import CourseCard from '@/components/common/CourseCard'
import { FadeIn, Stagger, StaggerItem } from '@/components/common/Animated'

const STATS = [
  { value: '100+', label: 'Выпускников', icon: Users },
  { value: '3+', label: 'Курсов', icon: BookOpen },
  { value: '5', label: 'Педагогов', icon: Award },
  { value: '5 лет', label: 'На рынке', icon: Star },
]

const DIRECTIONS = [
  { icon: Cpu, title: 'Робототехника', desc: 'Создание роботов и автоматических систем', color: 'from-blue-600 to-cyan-500', age: '7–16 лет' },
  { icon: Code2, title: 'Программирование', desc: 'Python, Scratch, web-разработка', color: 'from-violet-600 to-purple-500', age: '8–17 лет' },
  { icon: Layers, title: '3D-моделирование', desc: 'Проектирование и печать 3D-объектов', color: 'from-orange-600 to-amber-500', age: '9–17 лет' },
  { icon: Zap, title: 'Электроника', desc: 'Схемотехника, Arduino, IoT', color: 'from-emerald-600 to-teal-500', age: '10–17 лет' },
  { icon: Wrench, title: 'Инженерия', desc: 'Конструирование, механика', color: 'from-rose-600 to-pink-500', age: '7–14 лет' },
  { icon: Rocket, title: 'Авиамоделирование', desc: 'Дроны, авиамодели, аэродинамика', color: 'from-sky-600 to-indigo-500', age: '10–17 лет' },
]

const TESTIMONIALS = [
  { name: 'Анна Смирнова', role: 'Мама Артёма, 12 лет', text: 'Сын в восторге от курса по робототехнике! Уже собрал своего первого робота. Педагоги очень внимательные и профессиональные.', rating: 5 },
  { name: 'Дмитрий Козлов', role: 'Папа Насти, 10 лет', text: 'Дочь научилась программировать на Python за 3 месяца. Теперь пишет собственные игры! Рекомендую всем родителям.', rating: 5 },
  { name: 'Елена Петрова', role: 'Мама Миши, 9 лет', text: 'Отличный технопарк! Современное оборудование, интересные проекты. Ребёнок идёт на занятия с удовольствием.', rating: 5 },
]

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [news, setNews] = useState<News[]>([])

  useEffect(() => {
    coursesApi.featured().then((r) => setCourses(r.data.data || []))
    teachersApi.list().then((r) => setTeachers((r.data.data || []).slice(0, 4)))
    newsApi.list(1, 3).then((r) => setNews(r.data.data || []))
  }, [])

  return (
    <div className="overflow-x-hidden">
      
      <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-700/20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-900/10 blur-3xl" />
        </div>

        
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="container-page relative z-10 py-24">
          <div className="max-w-3xl">
           

            <h1 className="text-5xl md:text-7xl font-bold text-content-main font-display leading-tight animate-slide-up mb-6">
              Технологии{' '}
              <span className="gradient-text">будущего</span>
              {' '}для ваших детей
            </h1>

            <p className="text-xl text-content-muted leading-relaxed max-w-2xl animate-slide-up mb-10" style={{ animationDelay: '0.1s' }}>
              Детский технопарк — образовательный центр с инновационными курсами по робототехнике, программированию, 3D-моделированию и электронике для детей 7–17 лет.
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/courses" className="btn btn-primary btn-lg">
                Смотреть курсы <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Записаться на пробный урок
              </Link>
            </div>

            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-content-main font-display">{value}</div>
                  <div className="text-content-muted text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-8 top-1/3 hidden xl:flex flex-col gap-4 animate-fade-in">
          {DIRECTIONS.slice(0, 3).map(({ icon: Icon, title, color }) => (
            <div key={title} className="glass rounded-2xl px-4 py-3 flex items-center gap-3 w-52">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4.5 h-4.5 text-content-main" />
              </div>
              <span className="text-sm text-content-main font-medium">{title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#080d1b] light:bg-slate-50">
        <div className="container-page">
          <FadeIn whileInView className="text-center mb-14">
            <h2 className="section-title">Направления обучения</h2>
            <p className="section-subtitle mx-auto">Выберите то, что увлекает вашего ребёнка</p>
          </FadeIn>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIRECTIONS.map(({ icon: Icon, title, desc, color, age }) => (
              <StaggerItem key={title}>
                <Link
                  to={`/courses?search=${encodeURIComponent(title)}`}
                  className="card-hover group p-6 cursor-pointer block h-full"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-content-main" />
                  </div>
                  <h3 className="text-content-main font-semibold text-lg mb-2 font-display">{title}</h3>
                  <p className="text-content-muted text-sm mb-3">{desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="badge-muted badge">{age}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {courses.length > 0 && (
        <section className="py-24">
          <div className="container-page">
            <FadeIn whileInView className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title">Популярные курсы</h2>
                <p className="section-subtitle">Самые востребованные программы технопарка</p>
              </div>
              <Link to="/courses" className="btn btn-secondary hidden md:flex">
                Все курсы <ChevronRight className="w-4 h-4" />
              </Link>
            </FadeIn>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <StaggerItem key={course.id}>
                  <CourseCard course={course} />
                </StaggerItem>
              ))}
            </Stagger>
            <div className="text-center mt-8 md:hidden">
              <Link to="/courses" className="btn btn-secondary">Все курсы</Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-[#080d1b] light:bg-slate-50">
        <div className="container-page">
          <FadeIn whileInView className="text-center mb-14">
            <h2 className="section-title">Почему выбирают нас</h2>
          </FadeIn>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🔬', title: 'Современное оборудование', desc: 'Профессиональные 3D-принтеры, роботы, Arduino, микроскопы' },
              { icon: '👩‍🏫', title: 'Опытные педагоги', desc: 'Преподаватели с опытом 5+ лет, постоянно повышают квалификацию' },
              { icon: '🏆', title: 'Результаты', desc: 'Наши ученики побеждают на всероссийских олимпиадах' },
              { icon: '📅', title: 'Гибкий график', desc: 'Удобное расписание, возможность переноса занятий' },
            ].map(({ icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="card p-6 text-center hover:border-primary-500/30 hover:-translate-y-2 hover:shadow-glow transition-all duration-300 h-full">
                  <div className="text-4xl mb-4 transform hover:scale-125 hover:rotate-6 transition-transform duration-300">{icon}</div>
                  <h3 className="text-content-main font-semibold mb-2">{title}</h3>
                  <p className="text-content-muted text-sm">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {teachers.length > 0 && (
        <section className="py-24">
          <div className="container-page">
            <FadeIn whileInView className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title">Наши педагоги</h2>
                <p className="section-subtitle">Профессионалы с любовью к своему делу</p>
              </div>
              <Link to="/teachers" className="btn btn-secondary hidden md:flex">
                Все педагоги <ChevronRight className="w-4 h-4" />
              </Link>
            </FadeIn>
            <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {teachers.map((t) => (
                <StaggerItem key={t.id}>
                  <div className="card-hover p-6 text-center group h-full">
                    <div className="w-20 h-20 rounded-2xl bg-primary-gradient mx-auto mb-4 flex items-center justify-center text-content-main text-2xl font-bold group-hover:scale-105 transition-transform">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.name} className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        t.name[0]
                      )}
                    </div>
                    <h4 className="text-content-main font-semibold text-sm">{t.name}</h4>
                    <p className="text-content-muted text-xs mt-1">{t.position}</p>
                    {t.experience > 0 && (
                      <div className="badge-muted badge mt-2 text-[10px]">{t.experience} лет опыта</div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="py-24 bg-[#080d1b] light:bg-slate-50">
        <div className="container-page">
          <FadeIn whileInView className="text-center mb-14">
            <h2 className="section-title">Отзывы родителей</h2>
          </FadeIn>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <StaggerItem key={name}>
                <div className="card p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-content-muted text-sm leading-relaxed mb-4">«{text}»</p>
                  <div>
                    <div className="text-content-main font-semibold text-sm">{name}</div>
                    <div className="text-content-muted text-xs">{role}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {news.length > 0 && (
        <section className="py-24">
          <div className="container-page">
            <FadeIn whileInView className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title">Последние новости</h2>
              </div>
              <Link to="/news" className="btn btn-secondary hidden md:flex">
                Все новости <ChevronRight className="w-4 h-4" />
              </Link>
            </FadeIn>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <StaggerItem key={item.id}>
                  <Link to={`/news/${item.id}`} className="card-hover group overflow-hidden block h-full">
                    {item.image_url && (
                      <div className="h-44 overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-content-muted text-xs mb-2">
                        {item.published_at ? new Date(item.published_at).toLocaleDateString('ru-RU') : ''}
                      </p>
                      <h3 className="text-content-main font-semibold text-sm leading-snug">{item.title}</h3>
                      {item.preview && <p className="text-content-muted text-xs mt-2 line-clamp-2">{item.preview}</p>}
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="py-24 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 70% 50%, #7c3aed 0%, transparent 60%)'
        }} />
        <div className="container-page relative z-10 text-center">
          <FadeIn whileInView>
            <h2 className="text-4xl md:text-5xl font-bold text-content-main font-display mb-4">
              Готовы начать?
            </h2>
            <p className="text-content-muted text-lg mb-8 max-w-xl mx-auto">
              Запишите ребёнка на пробный урок — это бесплатно и ни к чему не обязывает!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/courses" className="btn btn-primary btn-lg">
                Выбрать курс <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Бесплатный урок
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
