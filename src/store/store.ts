import { create } from 'zustand'

export type Language = 'ru' | 'en'
export type OverlayType = 'about' | 'education' | 'experience' | 'projects' | null

export interface StarData {
  name: string
  x: number
  y: number
  z: number
  magnitude: number
  color: string
}

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void
  activeOverlay: OverlayType
  setActiveOverlay: (overlay: OverlayType) => void
  selectedStar: StarData | null
  setSelectedStar: (star: StarData | null) => void
}

export const useStore = create<AppState>((set) => ({
  language: 'ru',
  setLanguage: (lang) => set({ language: lang }),
  activeOverlay: null,
  setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),
  selectedStar: null,
  setSelectedStar: (star) => set({ selectedStar: star }),
}))