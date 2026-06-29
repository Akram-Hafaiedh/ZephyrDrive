export type ColorOption = {
    name: string
    hex: string
    threeValue: string
}

export type ConfigOption = {
    name: string
    value: string
}

export type ConfigPart = {
    id: string
    label: string
    type: 'color'
    paintTargets: string[]
    options: ConfigOption[]
}

export type Car = {
    id: string
    make: string
    model: string
    trim: string
    year: number
    price: number
    bodyType: 'Coupe' | 'Convertible' | 'SUV' | 'Sedan' | 'Hatchback'
    modelPath: string // path under /public
    paintTargets: string[] // substrings of material names to recolor (case-insensitive)
    thumbnail?: string // optional 2D image for cards, falls back to a placeholder
    specs: {
        horsepower: number
        torqueLbFt: number
        zeroToSixty: number // seconds
        topSpeedMph: number
        drivetrain: 'RWD' | 'AWD' | 'FWD'
        transmission: string
        engine: string
        weightLbs: number
    }
    colors: ColorOption[]
    parts: ConfigPart[]
    description: string
}

export const cars: Car[] = [
    {
        id: 'porsche-911-gt3',
        make: 'Porsche',
        model: '911',
        trim: 'GT3',
        year: 2022,
        price: 161100,
        bodyType: 'Coupe',
        modelPath: '/models/porsche-911-gt3.glb',
        paintTargets: ['Paint', 'Coloured'],
        thumbnail: '/porsche-911-gt3.png',
        specs: {
            horsepower: 502,
            torqueLbFt: 346,
            zeroToSixty: 3.2,
            topSpeedMph: 197,
            drivetrain: 'RWD',
            transmission: '7-speed PDK / 6-speed manual',
            engine: '4.0L Naturally Aspirated Flat-6',
            weightLbs: 3164,
        },
        colors: [
            { name: 'GT Silver', hex: '#9a9a9a', threeValue: '#9a9a9a' },
            { name: 'Guards Red', hex: '#c5172e', threeValue: '#c5172e' },
            { name: 'Shark Blue', hex: '#1f4e8c', threeValue: '#1f4e8c' },
            { name: 'Jet Black', hex: '#0a0a0a', threeValue: '#0a0a0a' },
        ],
        parts: [
            {
                id: 'body',
                label: 'Body',
                type: 'color',
                paintTargets: ['Paint', 'Coloured'],
                options: [
                    { name: 'GT Silver', value: '#9a9a9a' },
                    { name: 'Guards Red', value: '#c5172e' },
                    { name: 'Shark Blue', value: '#1f4e8c' },
                    { name: 'Jet Black', value: '#0a0a0a' },
                ]
            },
            {
                id: 'wheels',
                label: 'Wheels',
                type: 'color',
                paintTargets: ['Wheel1A'],
                options: [
                    { name: 'Silver', value: '#aaaaaa' },
                    { name: 'Gloss Black', value: '#111111' },
                    { name: 'Aurum Gold', value: '#d4af37' },
                ]
            },
            {
                id: 'calipers',
                label: 'Brake Calipers',
                type: 'color',
                paintTargets: ['Calli'],
                options: [
                    { name: 'Guards Red', value: '#c5172e' },
                    { name: 'Speed Yellow', value: '#f5d020' },
                    { name: 'Gloss Black', value: '#111111' },
                ]
            }
        ],
        description:
            'The pinnacle of naturally-aspirated performance, the 911 GT3 brings motorsport-derived engineering to the road with a screaming 4.0L flat-six and razor-sharp handling.',
    },
    {
        id: 'porsche-718-cayman-gt4',
        make: 'Porsche',
        model: '718 Cayman',
        trim: 'GT4',
        year: 2020,
        price: 99200,
        bodyType: 'Coupe',
        modelPath: '/models/porsche-718-cayman-gt4.glb',
        paintTargets: ['Paint', 'Coloured'],
        thumbnail: '/porsche-718-cayman-gt4.png',
        specs: {
            horsepower: 414,
            torqueLbFt: 309,
            zeroToSixty: 4.2,
            topSpeedMph: 188,
            drivetrain: 'RWD',
            transmission: '6-speed manual / 7-speed PDK',
            engine: '4.0L Naturally Aspirated Flat-6',
            weightLbs: 3197,
        },
        colors: [
            { name: 'Racing Yellow', hex: '#f5d020', threeValue: '#f5d020' },
            { name: 'Carrara White', hex: '#eaeaea', threeValue: '#eaeaea' },
            { name: 'Miami Blue', hex: '#1fb6c9', threeValue: '#1fb6c9' },
            { name: 'Jet Black', hex: '#0a0a0a', threeValue: '#0a0a0a' },
        ],
        parts: [
            {
                id: 'body',
                label: 'Body',
                type: 'color',
                paintTargets: ['Paint', 'Coloured'],
                options: [
                    { name: 'Racing Yellow', value: '#f5d020' },
                    { name: 'Carrara White', value: '#eaeaea' },
                    { name: 'Miami Blue', value: '#1fb6c9' },
                    { name: 'Jet Black', value: '#0a0a0a' },
                ]
            },
            {
                id: 'wheels',
                label: 'Wheels',
                type: 'color',
                paintTargets: ['Wheel1A'],
                options: [
                    { name: 'Platinum Grey', value: '#666666' },
                    { name: 'Satin Black', value: '#111111' },
                    { name: 'Satin Aurum', value: '#b5a642' },
                ]
            },
            {
                id: 'calipers',
                label: 'Brake Calipers',
                type: 'color',
                paintTargets: ['CALIP'],
                options: [
                    { name: 'Speed Yellow', value: '#f5d020' },
                    { name: 'Guards Red', value: '#c5172e' },
                    { name: 'Black', value: '#111111' },
                ]
            }
        ],
        description:
            'A mid-engine purist’s dream, the 718 Cayman GT4 pairs a high-revving flat-six with perfectly balanced handling, built for the road and the track alike.',
    },
]

export const getCarById = (id: string) => cars.find((c) => c.id === id)

export const bodyTypes = Array.from(new Set(cars.map((c) => c.bodyType)))
export const makes = Array.from(new Set(cars.map((c) => c.make)))
