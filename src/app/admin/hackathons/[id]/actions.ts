'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { teams } from '@/lib/teams'
import { scoringItems } from '@/lib/scoring'

export async function deleteTeam(teamId: string, hackathonId: string) {
  try {
    await teams.delete(teamId)
    revalidatePath(`/admin/hackathons/${hackathonId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'チームの削除に失敗しました',
    }
  }
}

export async function deleteScoringItem(itemId: string, hackathonId: string) {
  try {
    await scoringItems.delete(itemId)
    revalidatePath(`/admin/hackathons/${hackathonId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '採点項目の削除に失敗しました',
    }
  }
}
