export type UserRole = 'admin' | 'guest'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  metadata?: {
    name?: string
    company_name?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  name?: string
  company_name?: string
  role: UserRole
}

export interface SignInData {
  email: string
  password: string
  role: UserRole
}
