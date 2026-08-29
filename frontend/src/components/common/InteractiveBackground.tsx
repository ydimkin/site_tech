import { useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const mouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 2 + 1
        this.density = (Math.random() * 30) + 1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = theme === 'dark' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.3)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }

      update() {
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let maxDistance = 150
        let force = (maxDistance - distance) / maxDistance
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density

        if (distance < maxDistance) {
          this.x -= directionX
          this.y -= directionY
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX
            this.x -= dx / 10
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY
            this.y -= dy / 10
          }
        }
      }
    }

    const initParticles = () => {
      particles = []
      const numberOfParticles = (canvas.width * canvas.height) / 15000
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        particles.push(new Particle(x, y))
      }
    }

    const connectParticles = () => {
      let opacityValue = 1
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x
          let dy = particles[a].y - particles[b].y
          let distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            opacityValue = 1 - (distance / 120)
            ctx!.strokeStyle = theme === 'dark' 
              ? `rgba(96, 165, 250, ${opacityValue * 0.2})`
              : `rgba(59, 130, 246, ${opacityValue * 0.15})`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(particles[a].x, particles[a].y)
            ctx!.lineTo(particles[b].x, particles[b].y)
            ctx!.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw()
        particles[i].update()
      }
      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
