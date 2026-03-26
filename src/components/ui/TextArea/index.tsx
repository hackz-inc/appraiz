import { ComponentPropsWithRef, forwardRef } from 'react'
import styles from './index.module.css'

interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const wrapperClass = fullWidth ? styles.fullWidth : ''
    const textareaClass = [
      styles.textarea,
      fullWidth && styles.fullWidth,
      error && styles.textareaError,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClass}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea ref={ref} className={textareaClass} {...props} />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
