import { ComponentPropsWithRef, forwardRef } from 'react'
import styles from './index.module.css'

interface ContainerProps extends ComponentPropsWithRef<'div'> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'md', children, className = '', ...props }, ref) => {
    const classNames = [styles.container, styles[maxWidth], className]
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
