import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import type { ScoringItem } from '@/lib/scoring'

export const getScoringItemsByHackathon = cache(async (hackathonId: string) => {
  const supabase = await createClient()
  const { data, error } = await (supabase
    .from('scoring_item') as any)
    .select('*')
    .eq('hackathon_id', hackathonId)
    .order('created_at')

  if (error) throw new Error(error.message)
  return data as ScoringItem[]
})
