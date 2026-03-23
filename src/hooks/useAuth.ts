'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/auth/auth'
import type { AuthUser } from '@/lib/auth/types'
import { createClient } from '@/lib/supabase/client'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    auth.getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'guest',
          metadata: session.user.user_metadata,
        }
        setUser(authUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isGuest: user?.role === 'guest',
  }
}
