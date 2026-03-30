import { ComponentPropsWithRef, forwardRef } from 'react'

interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const wrapperClass = fullWidth ? 'w-full' : ''
    const textareaClass = [
      'px-4 py-3 text-base rounded-lg border border-[var(--black-lighten3)] bg-[var(--black-lighten4)] transition-all resize-y min-h-[100px] focus:outline-none focus:shadow-[0_0_0_2px_var(--yellow-primary)] focus:border-transparent',
      fullWidth && 'w-full',
      error && 'border-[var(--red)]',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClass}>
        {label && <label className="block text-sm font-semibold text-[var(--black-primary)] mb-2">{label}</label>}
        <textarea ref={ref} className={textareaClass} {...props} />
        {error && <p className="mt-1 text-sm text-[var(--red)]">{error}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
