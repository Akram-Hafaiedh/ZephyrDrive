'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, GitCompare } from 'lucide-react'
import { Car } from '@/data/cars'
import { useGarageStore } from '@/store/useGarageStore'

export default function CarCard({ car }: { car: Car }) {
    const isFavorite = useGarageStore((s) => s.isFavorite(car.id))
    const isComparing = useGarageStore((s) => s.isComparing(car.id))
    const toggleFavorite = useGarageStore((s) => s.toggleFavorite)
    const toggleCompare = useGarageStore((s) => s.toggleCompare)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/30 transition-colors"
        >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(car.id)
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFavorite ? 'bg-red-500/80 text-white' : 'bg-black/40 text-white/70 hover:text-white'
                    }`}
                    aria-label="Toggle favorite"
                >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        toggleCompare(car.id)
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isComparing ? 'bg-blue-500/80 text-white' : 'bg-black/40 text-white/70 hover:text-white'
                    }`}
                    aria-label="Toggle compare"
                >
                    <GitCompare size={16} />
                </button>
            </div>

            <Link href={`/car/${car.id}`}>
                <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative overflow-hidden">
                    {car.thumbnail ? (
                        <img 
                            src={car.thumbnail} 
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-white/30 text-sm">3D Preview &rarr;</span>
                    )}
                </div>
                <div className="p-5 space-y-1">
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                        {car.year} &middot; {car.bodyType}
                    </p>
                    <h3 className="text-xl font-semibold text-white">
                        {car.make} {car.model}
                    </h3>
                    <p className="text-white/60">{car.trim}</p>
                    <p className="text-lg font-medium text-white pt-2">
                        ${car.price.toLocaleString()}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
