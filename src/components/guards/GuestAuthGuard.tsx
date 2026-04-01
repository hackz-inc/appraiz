'use client'

import { AuthGuard } from './AuthGuard'

type GuestAuthGuardProps = {
  children: React.ReactNode
}

export const GuestAuthGuard = ({ children }: GuestAuthGuardProps) => {
  return (
    <AuthGuard requiredRole="guest" redirectTo="/guest/auth/login">
      {children}
    </AuthGuard>
  )
}
