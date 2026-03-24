'use client'

import { Button } from '@/components/ui'
import { deleteTeam } from './actions'

export function DeleteTeamButton({
  teamId,
  hackathonId,
}: {
  teamId: string
  hackathonId: string
}) {
  const handleDelete = async () => {
    if (!confirm('このチームを削除しますか？')) return

    const result = await deleteTeam(teamId, hackathonId)
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
