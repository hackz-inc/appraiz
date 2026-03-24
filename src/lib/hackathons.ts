import { createClient } from '@/lib/supabase/client'

export interface Hackathon {
  id: string
  name: string
  scoring_date: string
  access_password: string
  created_at: string
  updated_at: string
}

export interface CreateHackathonInput {
  name: string
  scoring_date: string
  access_password: string
}

export const hackathons = {
  async getAll() {
    const supabase = createClient()
    const { data, error } = await (supabase
      .from('hackathon') as any)
      .select('*')
      .order('scoring_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data as Hackathon[]
  },

  async getById(id: string) {
    const supabase = createClient()
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

  async create(input: CreateHackathonInput) {
    const supabase = createClient()
    const { data, error } = await (supabase
      .from('hackathon') as any)
      .insert([input])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Hackathon
  },

  async update(id: string, input: Partial<CreateHackathonInput>) {
    const supabase = createClient()
    const { data, error } = await (supabase
      .from('hackathon') as any)
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Hackathon
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await (supabase
      .from('hackathon') as any)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  },

  async verifyPassword(hackathonId: string, password: string) {
    const supabase = createClient()
    const { data, error } = await (supabase
      .from('hackathon') as any)
      .select('access_password')
      .eq('id', hackathonId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data.access_password === password
  },
}
