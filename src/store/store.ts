// File: store.ts
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

// New interfaces for JSON structure
export interface PlanetData {
  name: string
  star: string
  mass_earth: number
  radius_earth: number
  semi_major_axis_au: number
  orbital_period_days: number
  discovery_year: number
  habitable_zone: boolean
}

export interface StarSystemData {
  name: string
  constellation: string
  distance_ly: number
  stars: StarData[]
  planets: PlanetData[]
}

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void
  activeOverlay: OverlayType
  setActiveOverlay: (overlay: OverlayType) => void
  selectedStar: StarData | null
  setSelectedStar: (star: StarData | null) => void
  // Add selected system for hover functionality
  hoveredSystem: StarSystemData | null
  setHoveredSystem: (system: StarSystemData | null) => void
  hoveredPlanet: PlanetData | null
  setHoveredPlanet: (planet: PlanetData | null) => void
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
}))