'use client'

import { useState } from 'react'
import { Button, TextInput, Card } from '@/components/ui'
import { useModalStore } from '@/stores'
import { createHackathon } from '@/components/features/hackathon/actions'

export const CreateHackathonContent = () => {
  const { closeModal } = useModalStore()
  const [formData, setFormData] = useState({
    name: '',
    scoringDate: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    setFormData({ name: '', scoringDate: '' })
    setError('')
    setLoading(false)
    closeModal()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createHackathon({
        name: formData.name,
        scoring_date: formData.scoringDate,
      })

      if (!result.success) {
        setError(result.error || 'ハッカソンの作成に失敗しました')
        setLoading(false)
        return
      }

      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ハッカソンの作成に失敗しました')
      setLoading(false)
    }
  }

  return (
    <Card variant="flat" className="w-full">
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

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleClose}
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
  )
}
