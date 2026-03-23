import { createClient } from '@/lib/supabase/client'
import type { SignUpData, SignInData, AuthUser, UserRole } from './types'

export const auth = {
  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const supabase = createClient()

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            name: data.name,
            company_name: data.company_name,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Create corresponding record in admin or guest table
      if (data.role === 'admin') {
        const { error: adminError } = await supabase
          .from('admin')
          .insert({
            id: authData.user.id,
            email: data.email,
          } as any)

        if (adminError) throw adminError
      } else if (data.role === 'guest') {
        const { error: guestError } = await supabase
          .from('guest')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name || '',
            company_name: data.company_name || '',
          } as any)

        if (guestError) throw guestError
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        role: data.role,
        metadata: {
          name: data.name,
          company_name: data.company_name,
        },
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  },

  async signIn(data: SignInData): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Sign in failed')

      // Verify user role
      const userRole = authData.user.user_metadata?.role as UserRole
      if (userRole !== data.role) {
        throw new Error('Invalid credentials for this role')
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        role: userRole,
        metadata: authData.user.user_metadata,
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  async getCurrentUser(): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const supabase = createClient()
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!authUser) return { user: null, error: null }

      const user: AuthUser = {
        id: authUser.id,
        email: authUser.email!,
        role: authUser.user_metadata?.role || 'guest',
        metadata: authUser.user_metadata,
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },
}
