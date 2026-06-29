import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_COMPARE = 3

interface GarageState {
    favoriteIds: string[]
    compareIds: string[]
    toggleFavorite: (carId: string) => void
    isFavorite: (carId: string) => boolean
    toggleCompare: (carId: string) => void
    isComparing: (carId: string) => boolean
    clearCompare: () => void
    compareLimitReached: boolean
}

export const useGarageStore = create<GarageState>()(
    persist(
        (set, get) => ({
            favoriteIds: [],
            compareIds: [],
            compareLimitReached: false,
            toggleFavorite: (carId) =>
                set((state) => ({
                    favoriteIds: state.favoriteIds.includes(carId)
                        ? state.favoriteIds.filter((id) => id !== carId)
                        : [...state.favoriteIds, carId],
                })),
            isFavorite: (carId) => get().favoriteIds.includes(carId),
            toggleCompare: (carId) =>
                set((state) => {
                    if (state.compareIds.includes(carId)) {
                        return { compareIds: state.compareIds.filter((id) => id !== carId) }
                    }
                    if (state.compareIds.length >= MAX_COMPARE) {
                        return state
                    }
                    return { compareIds: [...state.compareIds, carId] }
                }),
            isComparing: (carId) => get().compareIds.includes(carId),
            clearCompare: () => set({ compareIds: [] }),
        }),
        { name: 'garage-storage' }
    )
)
