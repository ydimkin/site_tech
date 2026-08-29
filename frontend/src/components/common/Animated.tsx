import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode, ComponentProps } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: Direction
  duration?: number
  className?: string
  whileInView?: boolean
  once?: boolean
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
  none: { x: 0, y: 0 },
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className,
  whileInView = false,
  once = true,
}: FadeInProps) {
  const reduce = useReducedMotion()
  const offset = reduce ? { x: 0, y: 0 } : offsets[direction]

  const transition = { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  const initial = { opacity: 0, ...offset }
  const animate = { opacity: 1, x: 0, y: 0 }

  if (whileInView) {
    return (
      <motion.div
        className={className}
        initial={initial}
        whileInView={animate}
        viewport={{ once, amount: 0.2 }}
        transition={transition}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div className={className} initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  whileInView?: boolean
  once?: boolean
}

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  whileInView = true,
  once = true,
}: StaggerProps) {
  const variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      {...(whileInView
        ? { whileInView: 'show', viewport: { once, amount: 0.15 } }
        : { animate: 'show' })}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps extends ComponentProps<typeof motion.div> {
  children: ReactNode
  direction?: Direction
}

export function StaggerItem({ children, direction = 'up', ...rest }: StaggerItemProps) {
  const offset = offsets[direction]
  const variants = {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  }

  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  )
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
