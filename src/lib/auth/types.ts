export type UserRole = 'admin' | 'guest'

export type AuthUser = {
  id: string
  email: string
  role: UserRole
  metadata?: {
    name?: string
    company_name?: string
  }
}

export type SignUpData = {
  email: string
  password: string
  name?: string
  company_name?: string
  role: UserRole
}

export type SignInData = {
  email: string
  password: string
  role: UserRole
}
