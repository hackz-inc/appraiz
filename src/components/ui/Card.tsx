import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface CardProps extends ComponentPropsWithRef<'div'> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat' | 'gradient'
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, children, className = '', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border border-black-lighten3 shadow-sm',
      outlined: 'bg-white border-2 border-black-lighten2',
      elevated: 'bg-white shadow-md border border-black-lighten4',
      flat: 'bg-transparent',
      gradient: 'bg-gradient-to-br from-white to-yellow-lighten1 border-2 border-yellow-primary shadow-md',
    }

    const hoverStyles = hoverable
      ? 'transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      : 'transition-shadow duration-200'

    return (
      <div
        ref={ref}
        className={`rounded-xl p-6 ${variantStyles[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
