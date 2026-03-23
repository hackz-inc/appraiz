import { create } from 'zustand'

interface HackathonStore {
  currentHackathonId: string | null
  setCurrentHackathonId: (id: string | null) => void
}

export const useHackathonStore = create<HackathonStore>((set) => ({
  currentHackathonId: null,
  setCurrentHackathonId: (id) => set({ currentHackathonId: id }),
}))
