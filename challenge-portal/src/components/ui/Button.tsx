import React from 'react'
import { cn } from '../../utils/helpers'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      primary: 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:translate-y-px focus:ring-brand-500',
      secondary: 'bg-slate-700 text-white shadow-sm hover:bg-slate-600 active:translate-y-px focus:ring-slate-500',
      outline: 'border border-slate-700 text-slate-100 hover:bg-slate-800/50 active:translate-y-px focus:ring-slate-500',
      ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:translate-y-px focus:ring-slate-500',
      danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600 active:translate-y-px focus:ring-red-500'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-sm min-h-[44px]',
      lg: 'px-6 py-3 text-base min-h-[48px]'
    }
    
    const widthClasses = fullWidth ? 'w-full' : ''
    
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClasses,
      className
    )

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }