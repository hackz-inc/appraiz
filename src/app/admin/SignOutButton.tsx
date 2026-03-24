'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { auth } from '@/lib/auth'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/admin/auth/login')
    router.refresh()
  }

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      ログアウト
    </Button>
  )
}
