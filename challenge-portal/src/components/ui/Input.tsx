import React from 'react'
import { cn } from '../../utils/helpers'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const baseClasses = 'rounded-md bg-slate-900/50 border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed touch-friendly'
    const borderClasses = error ? 'border-red-500' : 'border-slate-800'
    const widthClasses = fullWidth ? 'w-full' : ''
    const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : ''
    
    const inputClasses = cn(
      baseClasses,
      borderClasses,
      widthClasses,
      iconClasses,
      className
    )

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-200"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-slate-400 text-sm">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-slate-400 text-sm">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }