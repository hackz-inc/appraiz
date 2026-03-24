import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import type { Hackathon } from '@/lib/hackathons'

export const getHackathons = unstable_cache(
  async () => {
    const supabase = await createClient()
    const { data, error } = await (supabase
      .from('hackathon') as any)
      .select('*')
      .order('scoring_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data as Hackathon[]
  },
  ['hackathons']
)

export const getHackathonById = unstable_cache(
  async (id: string) => {
    const supabase = await createClient()
    const { data, error } = await (supabase
      .from('hackathon') as any)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Hackathon
  },
  ['hackathon']
)
