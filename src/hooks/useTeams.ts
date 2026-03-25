import useSWR from 'swr'
import { teams, type Team } from '@/lib/teams'

export function useTeams(hackathonId: string) {
  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    hackathonId ? `teams-${hackathonId}` : null,
    () => teams.getByHackathon(hackathonId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false, // キャッシュがある場合は再検証しない
      dedupingInterval: 60000,
    }
  )

  return {
    teams: data,
    isLoading,
    isError: error,
    mutate,
  }
}
