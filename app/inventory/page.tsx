'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cars, bodyTypes, makes } from '@/data/cars'
import CarCard from '@/components/showroom/CarCard'
import FilterPanel, { Filters } from '@/components/showroom/FilterPanel'
import { Heart, GitCompare } from 'lucide-react'
import { useGarageStore } from '@/store/useGarageStore'

export default function InventoryPage() {
    const [filters, setFilters] = useState<Filters>({ make: 'All', bodyType: 'All', sort: 'year-desc' })
    const favoriteCount = useGarageStore((s) => s.favoriteIds.length)
    const compareCount = useGarageStore((s) => s.compareIds.length)

    const filtered = useMemo(() => {
        let result = cars.filter((c) => {
            const makeOk = filters.make === 'All' || c.make === filters.make
            const bodyOk = filters.bodyType === 'All' || c.bodyType === filters.bodyType
            return makeOk && bodyOk
        })
        result = [...result].sort((a, b) => {
            if (filters.sort === 'price-asc') return a.price - b.price
            if (filters.sort === 'price-desc') return b.price - a.price
            return b.year - a.year
        })
        return result
    }, [filters])

    return (
        <main className="min-h-screen bg-black text-white px-6 md:px-12 py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Showroom Inventory</h1>
                <div className="flex gap-2.5 sm:gap-3 flex-wrap items-center">
                    <Link
                        href="/compare"
                        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full transition-colors shadow-md"
                    >
                        <GitCompare size={14} className="sm:w-4 sm:h-4" /> Compare ({compareCount})
                    </Link>
                    <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-white/10 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full shadow-md">
                        <Heart size={14} className="sm:w-4 sm:h-4" /> {favoriteCount} Saved
                    </span>
                </div>
            </div>

            <FilterPanel makes={makes} bodyTypes={bodyTypes} filters={filters} onChange={setFilters} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((car) => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-white/50 text-center py-20">No cars match these filters.</p>
            )}
        </main>
    )
}
