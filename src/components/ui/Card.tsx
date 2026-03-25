import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'
import styles from './Card.module.css'

interface CardProps extends ComponentPropsWithRef<'div'> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat' | 'gradient'
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, children, className = '', ...props }, ref) => {
    const classNames = [
      styles.card,
      styles[variant],
      hoverable && styles.hoverable,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
