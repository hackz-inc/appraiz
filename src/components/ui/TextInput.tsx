import { ComponentPropsWithRef, forwardRef } from 'react'

interface TextInputProps extends ComponentPropsWithRef<'input'> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const baseStyles = 'px-4 py-3 text-base rounded border border-black-lighten3 bg-black-lighten4 focus:outline-none focus:ring-2 focus:ring-yellow-primary focus:border-transparent transition-all'
    const widthStyles = fullWidth ? 'w-full' : ''
    const errorStyles = error ? 'border-red' : ''

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-semibold text-black-primary mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${widthStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red">{error}</p>
        )}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'
