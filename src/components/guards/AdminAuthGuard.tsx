'use client'

import { AuthGuard } from './AuthGuard'

type AdminAuthGuardProps = {
  children: React.ReactNode
}

export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  return (
    <AuthGuard requiredRole="admin" redirectTo="/admin/auth/login">
      {children}
    </AuthGuard>
  )
}
