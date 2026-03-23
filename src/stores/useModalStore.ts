import { create } from 'zustand'

interface ModalStore {
  // Hackathon modals
  isEditHackathonModalOpen: boolean
  isDeleteHackathonModalOpen: boolean
  isCreateHackathonModalOpen: boolean

  // Team modals
  isEditTeamModalOpen: boolean
  isDeleteTeamModalOpen: boolean
  isConfirmTeamOrderModalOpen: boolean

  // Scoring modals
  isEditScoringModalOpen: boolean
  isDeleteScoringModalOpen: boolean
  isConfirmScoringModalOpen: boolean

  // Access password modal
  isAccessPasswordModalOpen: boolean

  // Actions
  openModal: (modalName: keyof Omit<ModalStore, 'openModal' | 'closeModal' | 'closeAllModals'>) => void
  closeModal: (modalName: keyof Omit<ModalStore, 'openModal' | 'closeModal' | 'closeAllModals'>) => void
  closeAllModals: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  // Initial state
  isEditHackathonModalOpen: false,
  isDeleteHackathonModalOpen: false,
  isCreateHackathonModalOpen: false,
  isEditTeamModalOpen: false,
  isDeleteTeamModalOpen: false,
  isConfirmTeamOrderModalOpen: false,
  isEditScoringModalOpen: false,
  isDeleteScoringModalOpen: false,
  isConfirmScoringModalOpen: false,
  isAccessPasswordModalOpen: false,

  // Actions
  openModal: (modalName) =>
    set((state) => ({ ...state, [modalName]: true })),
  closeModal: (modalName) =>
    set((state) => ({ ...state, [modalName]: false })),
  closeAllModals: () =>
    set({
      isEditHackathonModalOpen: false,
      isDeleteHackathonModalOpen: false,
      isCreateHackathonModalOpen: false,
      isEditTeamModalOpen: false,
      isDeleteTeamModalOpen: false,
      isConfirmTeamOrderModalOpen: false,
      isEditScoringModalOpen: false,
      isDeleteScoringModalOpen: false,
      isConfirmScoringModalOpen: false,
      isAccessPasswordModalOpen: false,
    }),
}))
