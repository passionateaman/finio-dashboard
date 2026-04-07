import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  className?: string
}

const paddingMap = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' }

export default function Card({ children, hover = false, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, borderColor: 'rgba(255,255,255,0.14)' } : {}}
      className={`
        bg-surface border border-white/[0.07] rounded-2xl
        transition-colors duration-200
        ${paddingMap[padding]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}