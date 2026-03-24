import useSWR from 'swr'
import { hackathons, type Hackathon } from '@/lib/hackathons'

export function useHackathons() {
  const { data, error, isLoading, mutate } = useSWR<Hackathon[]>(
    'hackathons',
    () => hackathons.getAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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
    }
  )

  return {
    hackathon: data,
    isLoading,
    isError: error,
    mutate,
  }
}
