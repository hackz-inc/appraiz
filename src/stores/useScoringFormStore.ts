import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScoringFormData {
  teamId: string
  scores: Record<string, number> // scoring_item_id -> score
  comment: string
}

interface ScoringFormStore {
  forms: Record<string, ScoringFormData> // teamId -> form data
  formSortKey: 'presentation' | 'score'

  // Actions
  setForm: (teamId: string, data: Partial<ScoringFormData>) => void
  getForm: (teamId: string) => ScoringFormData | undefined
  clearForm: (teamId: string) => void
  clearAllForms: () => void
  setFormSortKey: (key: 'presentation' | 'score') => void

  // For localStorage persistence with hackathonId
  initForHackathon: (hackathonId: string) => void
}

export const useScoringFormStore = create<ScoringFormStore>()(
  persist(
    (set, get) => ({
      forms: {},
      formSortKey: 'presentation',

      setForm: (teamId, data) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [teamId]: {
              ...state.forms[teamId],
              teamId,
              ...data,
            },
          },
        })),

      getForm: (teamId) => get().forms[teamId],

      clearForm: (teamId) =>
        set((state) => {
          const newForms = { ...state.forms }
          delete newForms[teamId]
          return { forms: newForms }
        }),

      clearAllForms: () => set({ forms: {} }),

      setFormSortKey: (key) => set({ formSortKey: key }),

      initForHackathon: (hackathonId) => {
        // Load from localStorage if exists
        const stored = localStorage.getItem(`scoring-forms-${hackathonId}`)
        if (stored) {
          try {
            const data = JSON.parse(stored)
            set({ forms: data.forms || {} })
          } catch (e) {
            console.error('Failed to load scoring forms from localStorage', e)
          }
        }
      },
    }),
    {
      name: 'scoring-form-storage',
      partialize: (state) => ({ forms: state.forms }),
    }
  )
)
