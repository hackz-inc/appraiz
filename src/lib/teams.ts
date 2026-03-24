import { createClient } from '@/lib/supabase/client'

export interface Team {
  id: string
  name: string
  hackathon_id: string
  created_at: string
  updated_at: string
}

export interface CreateTeamInput {
  name: string
  hackathon_id: string
}

export const teams = {
  async getByHackathon(hackathonId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .eq('hackathon_id', hackathonId)
      .order('name')

    if (error) throw new Error(error.message)
    return data as Team[]
  },

  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as Team
  },

  async create(input: CreateTeamInput) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('team')
      .insert([input])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Team
  },

  async update(id: string, input: Partial<CreateTeamInput>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('team')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Team
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('team')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}
