import useSWR from 'swr'
import { hackathons, type Hackathon } from '@/lib/hackathons'

export function useHackathons() {
  const { data, error, isLoading, mutate } = useSWR<Hackathon[]>(
    'hackathons',
    () => hackathons.getAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false, // キャッシュがある場合は再検証しない
      dedupingInterval: 60000, // 60秒間は重複リクエストしない
    }
  )

  return {
    hackathons: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useHackathon(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Hackathon>(
    id ? `hackathon-${id}` : null,
    () => hackathons.getById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false, // キャッシュがある場合は再検証しない
      dedupingInterval: 60000,
    }
  )

  return {
    hackathon: data,
    isLoading,
    isError: error,
    mutate,
  }
}
