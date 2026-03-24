import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface CardProps extends ComponentPropsWithRef<'div'> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className = '', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border border-black-lighten3',
      outlined: 'bg-transparent border-2 border-black-lighten2',
      elevated: 'bg-white shadow-lg',
      flat: 'bg-transparent',
    }

    return (
      <div
        ref={ref}
        className={`rounded-lg p-6 ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
