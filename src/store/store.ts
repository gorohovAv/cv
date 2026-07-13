// File: src/store/store.ts
import { create } from 'zustand'
import type { StarData, PlanetData } from '../csvParser'

export type Language = 'ru' | 'en'
export type OverlayType = 'about' | 'education' | 'experience' | 'projects' | 'skills' | 'contacts' | 'license' | null

export interface StarSystemData {
  id: number
  name: string
  ra: number
  dec: number
  dist: number
  mag: number
  spect: string
  x: number
  y: number
  z: number
  color: string
  planets: PlanetData[]
}

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void
  activeOverlay: OverlayType
  setActiveOverlay: (overlay: OverlayType) => void
  selectedStar: StarSystemData | null
  setSelectedStar: (star: StarSystemData | null) => void
  hoveredSystem: StarSystemData | null
  setHoveredSystem: (system: StarSystemData | null) => void
  hoveredPlanet: PlanetData | null
  setHoveredPlanet: (planet: PlanetData | null) => void
  
  stars: StarData[]
  setStars: (stars: StarData[]) => void
  planets: PlanetData[]
  setPlanets: (planets: PlanetData[]) => void
  
  isLoading: boolean
  loadingProgress: number
  loadingText: string
  setLoading: (isLoading: boolean, progress: number, text: string) => void
}

export const useStore = create<AppState>((set) => ({
  language: 'ru',
  setLanguage: (lang) => set({ language: lang }),
  activeOverlay: null,
  setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),
  selectedStar: null,
  setSelectedStar: (star) => set({ selectedStar: star }),
  hoveredSystem: null,
  setHoveredSystem: (system) => set({ hoveredSystem: system }),
  hoveredPlanet: null,
  setHoveredPlanet: (planet) => set({ hoveredPlanet: planet }),
  
  stars: [],
  setStars: (stars) => set({ stars }),
  planets: [],
  setPlanets: (planets) => set({ planets }),
  
  isLoading: false,
  loadingProgress: 0,
  loadingText: '',
  setLoading: (isLoading, progress, text) => set({ 
    isLoading, 
    loadingProgress: progress, 
    loadingText: text 
  }),
}))