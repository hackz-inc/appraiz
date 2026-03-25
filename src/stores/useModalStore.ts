import { create } from 'zustand'
import type { ReactNode } from 'react'

export type ModalType =
  | 'createHackathon'
  | 'editHackathon'
  | 'deleteHackathon'
  | 'createTeam'
  | 'editTeam'
  | 'deleteTeam'
  | 'createScoringItem'
  | 'editScoringItem'
  | 'deleteScoringItem'
  | null

interface ModalConfig {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  content?: ReactNode
  data?: any
}

interface ModalStore {
  isOpen: boolean
  type: ModalType
  config: ModalConfig

  openModal: (type: ModalType, config?: ModalConfig) => void
  closeModal: () => void
  updateConfig: (config: Partial<ModalConfig>) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  config: {},

  openModal: (type, config = {}) =>
    set({ isOpen: true, type, config }),

  closeModal: () =>
    set({ isOpen: false, type: null, config: {} }),

  updateConfig: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),
}))
