'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/client'

// 16文字のランダムなアクセスパスワードを生成
const generateAccessPassword = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export interface CreateHackathonInput {
  name: string
  scoring_date: string
}

export async function createHackathon(input: CreateHackathonInput) {
  try {
    const supabase = createAdminClient()

    const insertData: Database['public']['Tables']['hackathon']['Insert'] = {
      name: input.name,
      scoring_date: input.scoring_date,
      access_password: generateAccessPassword(),
    }

    const { data, error } = await (supabase
      .from('hackathon') as any)
      .insert(insertData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ハッカソンの作成に失敗しました',
    }
  }
}

export async function updateHackathon(id: string, input: CreateHackathonInput) {
  try {
    const supabase = createAdminClient()

    const updateData: Database['public']['Tables']['hackathon']['Update'] = {
      name: input.name,
      scoring_date: input.scoring_date,
    }

    const { data, error } = await (supabase
      .from('hackathon') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ハッカソンの更新に失敗しました',
    }
  }
}

export async function deleteHackathon(id: string) {
  try {
    const supabase = createAdminClient()

    const { error } = await (supabase
      .from('hackathon') as any)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ハッカソンの削除に失敗しました',
    }
  }
}
