'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, TextInput, TextArea, Container, Card } from '@/components/ui'
import { hackathons } from '@/lib/hackathons'

export default function NewHackathonPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    scoringDate: '',
    accessPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await hackathons.create({
        name: formData.name,
        scoring_date: formData.scoringDate,
        access_password: formData.accessPassword,
      })

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ハッカソンの作成に失敗しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue to-yellow-lighten1 p-4 py-12">
      <Container maxWidth="md">
        <Card variant="elevated" className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black-primary mb-2">
              ハッカソン作成
            </h1>
            <p className="text-lg text-black-lighten1">
              新しいハッカソンを作成します
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red bg-opacity-10 border border-red rounded text-red text-sm">
                {error}
              </div>
            )}

            <TextInput
              type="text"
              label="ハッカソン名"
              placeholder="例: Spring Hackathon 2024"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
            />

            <TextInput
              type="date"
              label="採点日"
              value={formData.scoringDate}
              onChange={(e) => handleChange('scoringDate', e.target.value)}
              required
              fullWidth
            />

            <TextInput
              type="password"
              label="アクセスパスワード"
              placeholder="審査員用のパスワード"
              value={formData.accessPassword}
              onChange={(e) => handleChange('accessPassword', e.target.value)}
              required
              fullWidth
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.back()}
                fullWidth
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                fullWidth
              >
                作成
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  )
}
