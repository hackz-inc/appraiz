'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingScreen } from '@/components/ui'
import type { UserRole } from '@/lib/auth/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export const AuthGuard = ({
  children,
  requiredRole,
  redirectTo = '/admin/auth/login',
}: AuthGuardProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
      } else if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate page based on role
        if (user.role === 'admin') {
          router.push('/admin')
        } else if (user.role === 'guest') {
          router.push('/guest')
        } else {
          router.push('/')
        }
      }
    }
  }, [user, loading, requiredRole, redirectTo, router])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
