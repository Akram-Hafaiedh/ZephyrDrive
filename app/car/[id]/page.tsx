'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, GitCompare } from 'lucide-react'
import { getCarById } from '@/data/cars'
import { useConfigStore } from '@/store/useConfigStore'
import { useGarageStore } from '@/store/useGarageStore'
import ConfiguratorPanel from '@/components/showroom/ConfiguratorPanel'
import MagneticButton from '@/components/ui/MagneticButton'

const ShowroomScene = dynamic(() => import('@/components/showroom/Scene'), {
    ssr: false,
    loading: () => (
        <div className="h-screen flex items-center justify-center text-2xl font-semibold text-white/60">
            Loading viewer...
        </div>
    ),
})

export default function CarDetailPage() {
    const params = useParams<{ id: string }>()
    const car = getCarById(params.id)

    const selectionsByCarId = useConfigStore((s) => s.selectionsByCarId)
    const selections = car ? (selectionsByCarId[car.id] ?? {}) : {}
    const setPartValue = useConfigStore((s) => s.setPartValue)
    const isFavorite = useGarageStore((s) => (car ? s.isFavorite(car.id) : false))
    const isComparing = useGarageStore((s) => (car ? s.isComparing(car.id) : false))
    const toggleFavorite = useGarageStore((s) => s.toggleFavorite)
    const toggleCompare = useGarageStore((s) => s.toggleCompare)

    // Lifted active tab state to coordinate camera zoom and UI tabs
    const [activeTab, setActiveTab] = useState(() => car?.parts[0]?.id ?? 'body')

    if (!car) return notFound()

    // Map selections to PartConfig format for 3D CarModel
    const partConfigs = car.parts.map((part) => ({
        paintTargets: part.paintTargets,
        color: selections[part.id] ?? part.options[0].value,
    }))

    // Map selections to Record<partId, selectedValue> for ConfiguratorPanel UI
    const activeSelections = car.parts.reduce((acc, part) => {
        acc[part.id] = selections[part.id] ?? part.options[0].value
        return acc
    }, {} as Record<string, string>)

    const handleSelectPart = (partId: string, value: string) => {
        setPartValue(car.id, partId, value)
    }

    return (
        <main className="relative h-screen w-full overflow-hidden bg-black text-white">
            <Link
                href="/inventory"
                className="absolute top-10 left-10 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} /> Back to Inventory
            </Link>

            <ShowroomScene modelPath={car.modelPath} partConfigs={partConfigs} activePartId={activeTab} />

            <div className="absolute top-10 right-10 z-10 text-right space-y-3 max-w-sm">
                <motion.h1
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-4xl font-bold drop-shadow-lg"
                >
                    {car.make} {car.model}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="text-xl text-white/70"
                >
                    {car.trim} &middot; {car.year}
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="text-3xl font-light"
                >
                    ${car.price.toLocaleString()}
                </motion.p>

                <div className="flex justify-end gap-2 pt-1">
                    <button
                        onClick={() => toggleFavorite(car.id)}
                        className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                            isFavorite ? 'bg-red-500/80 text-white' : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                    >
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={() => toggleCompare(car.id)}
                        className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                            isComparing ? 'bg-blue-500/80 text-white' : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                    >
                        <GitCompare size={18} />
                    </button>
                </div>

                <div className="pt-3">
                    <MagneticButton>Request Test Drive</MagneticButton>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-left bg-black/40 backdrop-blur-md rounded-xl p-4 mt-4 space-y-1.5 text-sm"
                >
                    <SpecRow label="Engine" value={car.specs.engine} />
                    <SpecRow label="Horsepower" value={`${car.specs.horsepower} hp`} />
                    <SpecRow label="0&ndash;60 mph" value={`${car.specs.zeroToSixty}s`} />
                    <SpecRow label="Top Speed" value={`${car.specs.topSpeedMph} mph`} />
                    <SpecRow label="Drivetrain" value={car.specs.drivetrain} />
                    <SpecRow label="Weight" value={`${car.specs.weightLbs.toLocaleString()} lbs`} />
                </motion.div>
            </div>

            <ConfiguratorPanel
                parts={car.parts}
                activeSelections={activeSelections}
                onSelect={handleSelectPart}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </main>
    )
}

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 text-white/80">
            <span className="text-white/50">{label}</span>
            <span>{value}</span>
        </div>
    )
}
