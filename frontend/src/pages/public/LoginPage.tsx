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
  email: z.string().email('Неверный email'),
  password: z.string().min(1, 'Введите пароль'),
})

type Form = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.login(data)
      const token = res.data.data?.token
      if (!token) throw new Error()
      useAuthStore.setState({ token }) // Temporarily save token so getMe() interceptor works
      const meRes = await authApi.getMe()
      setAuth(meRes.data.data!, token)
      toast.success('Добро пожаловать!')
      navigate(meRes.data.data?.role === 'admin' ? '/admin' : '/')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Неверный email или пароль')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-hero-gradient">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Вход в аккаунт</h1>
          <p className="text-slate-400 text-sm mt-1">Войдите чтобы записаться на курсы</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" placeholder="ivan@example.com" autoComplete="email" />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Пароль</label>
            <div className="relative">
              <input {...register('password')} type={showPass ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" autoComplete="current-password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full btn-lg">
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
