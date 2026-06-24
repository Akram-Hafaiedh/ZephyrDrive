import { create } from 'zustand'

type ColorOption = {
    name: string
    hex: string
    threeValue: string // color string for mesh material
}

interface ConfigState {
    colors: ColorOption[]
    activeColor: ColorOption
    setActiveColor: (color: ColorOption) => void
}

const availableColors: ColorOption[] = [
    { name: 'Midnight', hex: '#1e1b4b', threeValue: '#1e1b4b' },
    { name: 'Crimson', hex: '#dc2626', threeValue: '#dc2626' },
    { name: 'Forest', hex: '#166534', threeValue: '#166534' },
    { name: 'Blush', hex: '#f9a8d4', threeValue: '#f9a8d4' },
]

export const useConfigStore = create<ConfigState>((set) => ({
    colors: availableColors,
    activeColor: availableColors[0],
    setActiveColor: (color) => set({ activeColor: color }),
}))