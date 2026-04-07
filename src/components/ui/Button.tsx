import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'outline'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white border-transparent shadow-[0_0_20px_rgba(108,127,255,0.3)] hover:shadow-[0_0_28px_rgba(108,127,255,0.5)]',
  ghost:   'bg-transparent text-white/60 border-white/[0.1] hover:text-white hover:border-white/20 hover:bg-white/[0.04]',
  danger:  'bg-red-500/10 text-red-400 border-red-400/20 hover:bg-red-500/20 hover:border-red-400/40',
  outline: 'bg-white/[0.04] text-white/70 border-white/[0.1] hover:bg-white/[0.08] hover:text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[12px] rounded-lg',
  md: 'px-4 py-2 text-[13px] rounded-lg',
  lg: 'px-5 py-2.5 text-[14px] rounded-xl',
}

export default function Button({
  variant = 'primary', size = 'md', loading = false,
  icon, children, disabled, className = '', ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 font-medium border transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </motion.button>
  )
}