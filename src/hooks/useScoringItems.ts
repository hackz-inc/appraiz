import useSWR from 'swr'
import { scoringItems, type ScoringItem } from '@/lib/scoring'

export function useScoringItems(hackathonId: string) {
  const { data, error, isLoading, mutate } = useSWR<ScoringItem[]>(
    hackathonId ? `scoring-items-${hackathonId}` : null,
    () => scoringItems.getByHackathon(hackathonId)
  )

  return {
    scoringItems: data,
    // データが存在しない場合のみローディング状態とする
    isLoading: isLoading && !data,
    isError: error,
    mutate,
  }
}
