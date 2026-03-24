'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'

export function BackButton() {
  const router = useRouter()

  return (
    <Button variant="secondary" onClick={() => router.push('/admin')}>
      ← 戻る
    </Button>
  )
}
