'use client'

import { Button } from '@/components/ui'
import { deleteScoringItem } from './actions'

export function DeleteScoringItemButton({
  itemId,
  hackathonId,
}: {
  itemId: string
  hackathonId: string
}) {
  const handleDelete = async () => {
    if (!confirm('この採点項目を削除しますか？')) return

    const result = await deleteScoringItem(itemId, hackathonId)
    if (!result.success) {
      alert(result.error)
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleDelete}>
      削除
    </Button>
  )
}
