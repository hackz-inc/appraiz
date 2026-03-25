'use client'

import type { ComponentPropsWithRef } from 'react'
import { useEffect } from 'react'

interface ModalProps extends ComponentPropsWithRef<'div'> {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
  ...props
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${sizeStyles[size]} w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ${className}`}
        {...props}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-yellow-primary bg-gradient-to-r from-yellow-lighten1 to-white">
            <h2 className="text-2xl font-black text-black-primary flex items-center gap-2">
              <span className="text-3xl">✨</span>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-black-lighten2 hover:text-white hover:bg-red transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
