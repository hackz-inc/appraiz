import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import type { Team } from '@/lib/teams'

export const getTeamsByHackathon = unstable_cache(
  async (hackathonId: string) => {
    const supabase = await createClient()
    const { data, error } = await (supabase
      .from('team') as any)
      .select('*')
      .eq('hackathon_id', hackathonId)
      .order('name')

    if (error) throw new Error(error.message)
    return data as Team[]
  },
  ['teams']
)
