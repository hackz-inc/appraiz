'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

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

    const { data, error } = await supabase
      .from('hackathon')
      .insert([
        {
          name: input.name,
          scoring_date: input.scoring_date,
          access_password: generateAccessPassword(),
        },
      ])
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
