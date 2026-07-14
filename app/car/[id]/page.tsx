'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
    const [showSpecs, setShowSpecs] = useState(false)

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
                className="absolute top-4 left-4 lg:top-10 lg:left-10 z-10 flex items-center gap-1.5 lg:gap-2 text-xs lg:text-base text-white/70 hover:text-white bg-black/45 lg:bg-transparent px-3.5 py-2 lg:px-0 lg:py-0 rounded-full border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none transition-colors shadow-lg"
            >
                <ArrowLeft size={16} className="lg:w-[18px] lg:h-[18px]" /> Back to Inventory
            </Link>

            <ShowroomScene modelPath={car.modelPath} partConfigs={partConfigs} activePartId={activeTab} />

            <div className="absolute top-4 right-4 lg:top-10 lg:right-10 z-10 text-right space-y-2 lg:space-y-3 max-w-[180px] lg:max-w-sm">
                <motion.h1
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-lg lg:text-4xl font-bold drop-shadow-lg"
                >
                    {car.make} {car.model}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="text-xs lg:text-xl text-white/70"
                >
                    {car.trim} &middot; {car.year}
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="text-sm lg:text-3xl font-light text-white/90"
                >
                    ${car.price.toLocaleString()}
                </motion.p>

                <div className="flex justify-end items-center gap-2 pt-1">
                    {/* Collapsible Specs Panel Trigger on Mobile */}
                    <button
                        onClick={() => setShowSpecs((prev) => !prev)}
                        className={`lg:hidden px-3 py-2 text-[10px] tracking-wider font-bold rounded-full backdrop-blur-md transition-colors ${
                            showSpecs ? 'bg-white text-black' : 'bg-white/10 text-white/80'
                        }`}
                    >
                        SPECS
                    </button>
                    <button
                        onClick={() => toggleFavorite(car.id)}
                        className={`p-2.5 lg:p-3 rounded-full backdrop-blur-md transition-colors ${
                            isFavorite ? 'bg-red-500/80 text-white' : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                    >
                        <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} className="lg:w-[18px] lg:h-[18px]" />
                    </button>
                    <button
                        onClick={() => toggleCompare(car.id)}
                        className={`p-2.5 lg:p-3 rounded-full backdrop-blur-md transition-colors ${
                            isComparing ? 'bg-blue-500/80 text-white' : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                    >
                        <GitCompare size={16} className="lg:w-[18px] lg:h-[18px]" />
                    </button>
                </div>

                <div className="pt-2 lg:pt-3">
                    <MagneticButton>
                        <span className="text-xs lg:text-sm">Request Test Drive</span>
                    </MagneticButton>
                </div>

                {/* Desktop Specs Panel: Always visible on desktop (hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="hidden lg:block text-left bg-black/40 backdrop-blur-md rounded-xl p-4 mt-4 space-y-1.5 text-sm border border-white/5 shadow-2xl"
                >
                    <SpecRow label="Engine" value={car.specs.engine} />
                    <SpecRow label="Horsepower" value={`${car.specs.horsepower} hp`} />
                    <SpecRow label="0&ndash;60 mph" value={`${car.specs.zeroToSixty}s`} />
                    <SpecRow label="Top Speed" value={`${car.specs.topSpeedMph} mph`} />
                    <SpecRow label="Drivetrain" value={car.specs.drivetrain} />
                    <SpecRow label="Weight" value={`${car.specs.weightLbs.toLocaleString()} lbs`} />
                </motion.div>

                {/* Mobile Specs Panel: Toggleable on mobile (hidden on desktop) */}
                <AnimatePresence>
                    {showSpecs && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            className="lg:hidden text-left bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 mt-3 space-y-1.5 text-[11px] shadow-2xl"
                        >
                            <SpecRow label="Engine" value={car.specs.engine} />
                            <SpecRow label="Horsepower" value={`${car.specs.horsepower} hp`} />
                            <SpecRow label="0&ndash;60 mph" value={`${car.specs.zeroToSixty}s`} />
                            <SpecRow label="Top Speed" value={`${car.specs.topSpeedMph} mph`} />
                            <SpecRow label="Drivetrain" value={car.specs.drivetrain} />
                            <SpecRow label="Weight" value={`${car.specs.weightLbs.toLocaleString()} lbs`} />
                        </motion.div>
                    )}
                </AnimatePresence>
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
