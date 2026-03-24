import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import type { ScoringItem } from '@/lib/scoring'

export const getScoringItemsByHackathon = unstable_cache(
  async (hackathonId: string) => {
    const supabase = await createClient()
    const { data, error } = await (supabase
      .from('scoring_item') as any)
      .select('*')
      .eq('hackathon_id', hackathonId)
      .order('created_at')

    if (error) throw new Error(error.message)
    return data as ScoringItem[]
  },
  ['scoring-items']
)
