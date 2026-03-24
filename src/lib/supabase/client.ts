import { createBrowserClient } from '@supabase/ssr'

export type Database = {
  public: {
    Tables: {
      admin: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      guest: {
        Row: {
          id: string
          name: string
          company_name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company_name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company_name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      hackathon: {
        Row: {
          id: string
          name: string
          scoring_date: string
          access_password: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scoring_date: string
          access_password: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scoring_date?: string
          access_password?: string
          created_at?: string
          updated_at?: string
        }
      }
      team: {
        Row: {
          id: string
          name: string
          hackathon_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          hackathon_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          hackathon_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      scoring_item: {
        Row: {
          id: string
          name: string
          max_score: number
          hackathon_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          max_score: number
          hackathon_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          max_score?: number
          hackathon_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      scoring_result: {
        Row: {
          id: string
          judge_name: string
          comment: string
          team_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          judge_name: string
          comment?: string
          team_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          judge_name?: string
          comment?: string
          team_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      scoring_item_result: {
        Row: {
          id: string
          score: number
          scoring_item_id: string
          scoring_result_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          score: number
          scoring_item_id: string
          scoring_result_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          score?: number
          scoring_item_id?: string
          scoring_result_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      hackathon_guest: {
        Row: {
          id: number
          hackathon_id: string
          guest_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          hackathon_id: string
          guest_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          hackathon_id?: string
          guest_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      presentation_order: {
        Row: {
          id: number
          order: number
          team_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          order: number
          team_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          order?: number
          team_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      confirmed_team_order: {
        Row: {
          id: number
          hackathon_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          hackathon_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          hackathon_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_social: {
        Row: {
          id: number
          team_id: string
          platform: string
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          team_id: string
          platform: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          team_id?: string
          platform?: string
          url?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Client-side Supabase client for use in Client Components
export const createClient = (): ReturnType<typeof createBrowserClient<Database>> => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
