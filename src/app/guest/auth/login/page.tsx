'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, TextInput, Container, Card } from '@/components/ui'
import { auth } from '@/lib/auth'

export default function GuestLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { user, error: signInError } = await auth.signIn({
        email,
        password,
        role: 'guest',
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (user) {
        router.push('/guest')
        router.refresh()
      }
    } catch (err) {
      setError('ログインに失敗しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue to-yellow-lighten1 p-4">
      <Container maxWidth="sm">
        <Card variant="elevated" className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black-primary mb-2">
              Appraiz
            </h1>
            <p className="text-lg text-black-lighten1">ゲストログイン</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red bg-opacity-10 border border-red rounded text-red text-sm">
                {error}
              </div>
            )}

            <TextInput
              type="email"
              label="メールアドレス"
              placeholder="guest@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextInput
              type="password"
              label="パスワード"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              fullWidth
            >
              ログイン
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-black-lighten1">
              アカウントをお持ちでない方は
              <Link
                href="/guest/auth/signup"
                className="ml-1 text-blue hover:underline"
              >
                新規登録
              </Link>
            </p>
            <a
              href="/"
              className="block text-sm text-black-lighten1 hover:text-black-primary transition-colors"
            >
              ホームに戻る
            </a>
          </div>
        </Card>
      </Container>
    </div>
  )
}
