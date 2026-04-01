'use client'

import { Button } from '@/components/ui'
import { scoringItems } from '@/lib/scoring'
import { useScoringItems } from '@/hooks/useScoringItems'

export const DeleteScoringItemButton = ({
  itemId,
  hackathonId,
}: {
  itemId: string
  hackathonId: string
}) => {
  const { mutate } = useScoringItems(hackathonId)

  const handleDelete = async () => {
    if (!confirm('この採点項目を削除しますか？')) return

    try {
      await scoringItems.delete(itemId)
      mutate() // SWRキャッシュを更新
    } catch (error) {
      console.error('Failed to delete scoring item:', error)
      alert('採点項目の削除に失敗しました')
    }
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete}>
      🗑️ 削除
    </Button>
  )
}
