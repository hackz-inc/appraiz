import { ComponentPropsWithRef, forwardRef } from 'react'

interface ContainerProps extends ComponentPropsWithRef<'div'> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'md', children, className = '', ...props }, ref) => {
    const maxWidthStyles = {
      sm: 'max-w-2xl',
      md: 'max-w-[805px]',
      lg: 'max-w-5xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    }

    return (
      <div
        ref={ref}
        className={`w-full ${maxWidthStyles[maxWidth]} mx-auto px-8 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'
