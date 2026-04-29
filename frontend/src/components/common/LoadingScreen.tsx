import { Rocket } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a0f1e] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-glow animate-float">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-primary-gradient opacity-30 blur-xl animate-pulse-slow" />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-slate-400 text-sm">Загрузка...</p>
      </div>
    </div>
  )
}
