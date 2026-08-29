import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: ReactNode
  onClose: () => void
  className?: string
}

export default function Modal({ children, onClose, className = '' }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4 ${className}`}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {children}
    </div>,
    document.body
  )
}
