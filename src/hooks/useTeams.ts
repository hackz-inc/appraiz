import useSWR from 'swr'
import { teams, type Team } from '@/lib/teams'

export function useTeams(hackathonId: string) {
  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    hackathonId ? `teams-${hackathonId}` : null,
    () => teams.getByHackathon(hackathonId)
  )

  return {
    teams: data,
    // データが存在しない場合のみローディング状態とする
    isLoading: isLoading && !data,
    isError: error,
    mutate,
  }
}
