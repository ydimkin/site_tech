import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Rocket, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Неверный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  phone: z.string().optional(),
  child_age: z.string().optional(),
})

type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        child_age: data.child_age ? Number(data.child_age) : undefined,
      })
      const token = res.data.data?.token
      if (!token) throw new Error()
      useAuthStore.setState({ token }) // Temporarily save token so getMe() interceptor works
      const meRes = await authApi.getMe()
      setAuth(meRes.data.data!, token)
      toast.success('Аккаунт создан!')
      navigate('/courses')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Ошибка регистрации')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-hero-gradient">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Создать аккаунт</h1>
          <p className="text-slate-400 text-sm mt-1">Зарегистрируйтесь для записи на курсы</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <div>
            <label className="label">Ваше имя *</label>
            <input {...register('name')} className="input" placeholder="Иван Смирнов" />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email *</label>
            <input {...register('email')} type="email" className="input" placeholder="ivan@example.com" />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Пароль *</label>
            <div className="relative">
              <input {...register('password')} type={showPass ? 'text' : 'password'} className="input pr-10" placeholder="Минимум 6 символов" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">Телефон</label>
            <input {...register('phone')} className="input" placeholder="+7 (999) 000-00-00" />
          </div>
          <div>
            <label className="label">Возраст ребёнка</label>
            <input {...register('child_age')} type="number" min="5" max="18" className="input" placeholder="10" />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full btn-lg">
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Войти</Link>
        </p>
      </div>
    </div>
  )
}
