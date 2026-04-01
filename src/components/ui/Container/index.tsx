import { ComponentPropsWithRef, forwardRef } from 'react'

type ContainerProps = ComponentPropsWithRef<'div'> & {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'md', children, className = '', ...props }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-[672px]',
      md: 'max-w-[805px]',
      lg: 'max-w-[1024px]',
      xl: 'max-w-[1280px]',
      full: 'max-w-full',
    }

    const classNames = [
      'w-full mx-auto px-8',
      maxWidthClasses[maxWidth],
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

Container.displayName = 'Container'
