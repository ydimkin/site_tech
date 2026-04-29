import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { contactApi } from '@/api/misc'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Неверный email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Минимум 10 символов'),
})

type Form = z.infer<typeof schema>

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      await contactApi.send(data)
      toast.success('Сообщение отправлено! Мы свяжемся с вами.')
      reset()
    } catch {
      toast.error('Ошибка отправки. Попробуйте позже.')
    }
  }

  return (
    <div className="container-page py-12">
      <h1 className="section-title mb-2">Контакты</h1>
      <p className="section-subtitle mb-12">Свяжитесь с нами любым удобным способом</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: MapPin, title: 'Адрес', text: '601501, Россия, Владимирская область г. Гусь-Хрустальный ул. Писарева д. 17' },
            { icon: Phone, title: 'Телефон', text: '+7 (996) 442-96-24' },
            { icon: Mail, title: 'Email', text: 'test@mail.ru' },
            { icon: Clock, title: 'Режим работы', text: 'Пн–Пт: 8:00–18:00\nСб: 8:00–14:00' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-slate-400 text-sm whitespace-pre-line">{text}</p>
              </div>
            </div>
          ))}

          {/* Map placeholder */}
          <div className="card h-48 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">Карта</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6">
          <h2 className="text-white font-bold text-xl mb-5">Написать нам</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Имя *</label>
                <input {...register('name')} className="input" placeholder="Иван" />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Телефон</label>
                <input {...register('phone')} className="input" placeholder="+7 (999) ..." />
              </div>
            </div>
            <div>
              <label className="label">Email *</label>
              <input {...register('email')} type="email" className="input" placeholder="ivan@example.com" />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Тема обращения</label>
              <input {...register('subject')} className="input" placeholder="Запись на пробный урок" />
            </div>
            <div>
              <label className="label">Сообщение *</label>
              <textarea {...register('message')} className="input resize-none" rows={5} placeholder="Расскажите, чем мы можем помочь..." />
              {errors.message && <p className="form-error">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full btn-lg">
              {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
