import { ComponentPropsWithRef } from 'react'

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary'
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
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-3xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-white via-white to-yellow-primary hover:from-yellow-primary hover:via-yellow-primary hover:to-yellow-primary border-2 border-yellow-primary text-black-primary',
    secondary: 'bg-gradient-to-r from-white via-white to-red hover:from-red hover:via-red hover:to-red border-2 border-red text-black-primary hover:text-white',
  }

  const sizeStyles = {
    sm: 'px-6 py-2 text-sm h-10',
    md: 'px-8 py-3 text-base h-12',
    lg: 'px-10 py-4 text-lg h-14',
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
