import { create } from 'zustand'

interface ConfigState {
    selectionsByCarId: Record<string, Record<string, string>>
    setPartValue: (carId: string, partId: string, value: string) => void
    getPartValue: (carId: string, partId: string, fallback: string) => string
}

export const useConfigStore = create<ConfigState>((set, get) => ({
    selectionsByCarId: {},
    setPartValue: (carId, partId, value) =>
        set((state) => {
            const carSelections = state.selectionsByCarId[carId] ?? {}
            return {
                selectionsByCarId: {
                    ...state.selectionsByCarId,
                    [carId]: {
                        ...carSelections,
                        [partId]: value,
                    },
                },
            }
        }),
    getPartValue: (carId, partId, fallback) => {
        return get().selectionsByCarId[carId]?.[partId] ?? fallback
    },
}))
