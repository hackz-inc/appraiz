'use client'

import { Button } from '@/components/ui'
import { teams } from '@/lib/teams'
import { useTeams } from '@/hooks/useTeams'

export const DeleteTeamButton = ({
  teamId,
  hackathonId,
}: {
  teamId: string
  hackathonId: string
}) => {
  const { mutate } = useTeams(hackathonId)

  const handleDelete = async () => {
    if (!confirm('このチームを削除しますか？')) return

    try {
      await teams.delete(teamId)
      mutate() // SWRキャッシュを更新
    } catch (error) {
      console.error('Failed to delete team:', error)
      alert('チームの削除に失敗しました')
    }
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete}>
      🗑️ 削除
    </Button>
  )
}
