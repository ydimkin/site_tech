import logoImg from '@/assets/img/logo.png'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-surface light:bg-white flex items-center justify-center z-50 transition-colors">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/10 light:bg-slate-50 flex items-center justify-center shadow-glow light:shadow-lg animate-float">
            <img src={logoImg} alt="Технопарк" className="w-12 h-12 object-contain" />
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
        <p className="text-content-muted light:text-content-muted text-sm">Загрузка...</p>
      </div>
    </div>
  )
}
