import type { ComponentPropsWithRef } from 'react'

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'

  const variantStyles = {
    primary: 'bg-yellow-primary hover:bg-yellow-lighten2 text-black-primary border-2 border-yellow-primary hover:border-yellow-lighten1',
    secondary: 'bg-white hover:bg-black-lighten4 text-black-primary border-2 border-black-lighten3 hover:border-black-lighten2',
    ghost: 'bg-transparent hover:bg-black-lighten4 text-black-primary border-2 border-transparent hover:border-black-lighten3',
    danger: 'bg-red hover:bg-red/90 text-white border-2 border-red hover:border-red/90',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-2.5 text-base h-11',
    lg: 'px-8 py-3 text-lg h-12',
  }

  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin h-5 w-5 border-2 border-black-primary border-t-transparent rounded-full" />
      ) : (
        children
      )}
    </button>
  )
}
