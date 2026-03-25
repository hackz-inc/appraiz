import useSWR from 'swr'
import { scoringItems, type ScoringItem } from '@/lib/scoring'

export function useScoringItems(hackathonId: string) {
  const { data, error, isLoading, mutate } = useSWR<ScoringItem[]>(
    hackathonId ? `scoring-items-${hackathonId}` : null,
    () => scoringItems.getByHackathon(hackathonId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  )

  return {
    scoringItems: data,
    isLoading,
    isError: error,
    mutate,
  }
}
