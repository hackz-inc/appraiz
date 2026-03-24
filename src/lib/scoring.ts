import { createClient } from '@/lib/supabase/client'

export interface ScoringItem {
  id: string
  name: string
  max_score: number
  hackathon_id: string
  created_at: string
  updated_at: string
}

export interface CreateScoringItemInput {
  name: string
  max_score: number
  hackathon_id: string
}

export interface ScoringResult {
  id: string
  judge_name: string
  comment: string
  team_id: string
  created_at: string
  updated_at: string
}

export interface ScoringItemResult {
  id: string
  score: number
  scoring_item_id: string
  scoring_result_id: string
  created_at: string
  updated_at: string
}

export interface SubmitScoreInput {
  judge_name: string
  comment: string
  team_id: string
  scores: Array<{
    scoring_item_id: string
    score: number
  }>
}

export interface TeamScoreResult {
  team_id: string
  team_name: string
  total_score: number
  average_score: number
  judge_count: number
  item_scores: Array<{
    item_id: string
    item_name: string
    max_score: number
    average_score: number
  }>
}

export const scoringItems = {
  async getByHackathon(hackathonId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('scoring_item')
      .select('*')
      .eq('hackathon_id', hackathonId)
      .order('created_at')

    if (error) throw new Error(error.message)
    return data as ScoringItem[]
  },

  async create(input: CreateScoringItemInput) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('scoring_item')
      .insert([input])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as ScoringItem
  },

  async update(id: string, input: Partial<CreateScoringItemInput>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('scoring_item')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as ScoringItem
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('scoring_item')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}

export const scoring = {
  async submitScore(input: SubmitScoreInput) {
    const supabase = createClient()

    // Create scoring result
    const { data: result, error: resultError } = await supabase
      .from('scoring_result')
      .insert([
        {
          judge_name: input.judge_name,
          comment: input.comment,
          team_id: input.team_id,
        },
      ])
      .select()
      .single()

    if (resultError) throw new Error(resultError.message)

    // Create scoring item results
    const itemResults = input.scores.map(score => ({
      score: score.score,
      scoring_item_id: score.scoring_item_id,
      scoring_result_id: result.id,
    }))

    const { error: itemsError } = await supabase
      .from('scoring_item_result')
      .insert(itemResults)

    if (itemsError) throw new Error(itemsError.message)

    return result as ScoringResult
  },

  async getResultsByTeam(teamId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('scoring_result')
      .select(`
        *,
        scoring_item_result (
          score,
          scoring_item (name, max_score)
        )
      `)
      .eq('team_id', teamId)

    if (error) throw new Error(error.message)
    return data
  },

  async getHackathonResults(hackathonId: string): Promise<TeamScoreResult[]> {
    const supabase = createClient()

    // Get all teams for this hackathon
    const { data: teams, error: teamsError } = await supabase
      .from('team')
      .select('id, name')
      .eq('hackathon_id', hackathonId)

    if (teamsError) throw new Error(teamsError.message)

    // Get all scoring items
    const { data: items, error: itemsError } = await supabase
      .from('scoring_item')
      .select('id, name, max_score')
      .eq('hackathon_id', hackathonId)

    if (itemsError) throw new Error(itemsError.message)

    // Get all scoring results and item results
    const { data: results, error: resultsError } = await supabase
      .from('scoring_result')
      .select(`
        id,
        team_id,
        scoring_item_result (
          score,
          scoring_item_id
        )
      `)
      .in('team_id', teams.map(t => t.id))

    if (resultsError) throw new Error(resultsError.message)

    // Calculate scores for each team
    const teamScores: TeamScoreResult[] = teams.map(team => {
      const teamResults = results.filter(r => r.team_id === team.id)

      const itemScores = items.map(item => {
        const itemResults = teamResults.flatMap(r =>
          r.scoring_item_result.filter(sir => sir.scoring_item_id === item.id)
        )

        const avgScore = itemResults.length > 0
          ? itemResults.reduce((sum, ir) => sum + ir.score, 0) / itemResults.length
          : 0

        return {
          item_id: item.id,
          item_name: item.name,
          max_score: item.max_score,
          average_score: avgScore,
        }
      })

      const totalScore = itemScores.reduce((sum, is) => sum + is.average_score, 0)
      const averageScore = itemScores.length > 0 ? totalScore / itemScores.length : 0

      return {
        team_id: team.id,
        team_name: team.name,
        total_score: totalScore,
        average_score: averageScore,
        judge_count: teamResults.length,
        item_scores: itemScores,
      }
    })

    return teamScores.sort((a, b) => b.total_score - a.total_score)
  },
}
