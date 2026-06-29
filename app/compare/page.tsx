'use client'

import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'
import { getCarById } from '@/data/cars'
import { useGarageStore } from '@/store/useGarageStore'

const SPEC_ROWS: { label: string; get: (c: NonNullable<ReturnType<typeof getCarById>>) => string }[] = [
    { label: 'Price', get: (c) => `$${c.price.toLocaleString()}` },
    { label: 'Engine', get: (c) => c.specs.engine },
    { label: 'Horsepower', get: (c) => `${c.specs.horsepower} hp` },
    { label: 'Torque', get: (c) => `${c.specs.torqueLbFt} lb-ft` },
    { label: '0\u201360 mph', get: (c) => `${c.specs.zeroToSixty}s` },
    { label: 'Top Speed', get: (c) => `${c.specs.topSpeedMph} mph` },
    { label: 'Drivetrain', get: (c) => c.specs.drivetrain },
    { label: 'Transmission', get: (c) => c.specs.transmission },
    { label: 'Weight', get: (c) => `${c.specs.weightLbs.toLocaleString()} lbs` },
]

export default function ComparePage() {
    const compareIds = useGarageStore((s) => s.compareIds)
    const toggleCompare = useGarageStore((s) => s.toggleCompare)
    const cars = compareIds.map((id) => getCarById(id)).filter(Boolean) as NonNullable<
        ReturnType<typeof getCarById>
    >[]

    return (
        <main className="min-h-screen bg-black text-white px-6 md:px-12 py-10">
            <Link href="/inventory" className="flex items-center gap-2 text-white/70 hover:text-white mb-8 w-fit">
                <ArrowLeft size={18} /> Back to Inventory
            </Link>

            <h1 className="text-3xl font-bold mb-8">Compare Vehicles</h1>

            {cars.length === 0 ? (
                <p className="text-white/50">
                    No cars selected. Go to the{' '}
                    <Link href="/inventory" className="underline">
                        inventory
                    </Link>{' '}
                    and tap the compare icon on up to 3 cars.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="p-3 text-white/40 font-normal text-sm">Spec</th>
                                {cars.map((car) => (
                                    <th key={car.id} className="p-3 align-top">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-lg font-semibold">
                                                    {car.make} {car.model}
                                                </p>
                                                <p className="text-white/50 text-sm">
                                                    {car.trim} &middot; {car.year}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => toggleCompare(car.id)}
                                                className="text-white/40 hover:text-white"
                                                aria-label="Remove from comparison"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SPEC_ROWS.map((row, i) => (
                                <tr key={row.label} className={i % 2 === 0 ? 'bg-white/5' : ''}>
                                    <td className="p-3 text-white/50 text-sm whitespace-nowrap">{row.label}</td>
                                    {cars.map((car) => (
                                        <td key={car.id} className="p-3">
                                            {row.get(car)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                <td className="p-3" />
                                {cars.map((car) => (
                                    <td key={car.id} className="p-3">
                                        <Link
                                            href={`/car/${car.id}`}
                                            className="inline-block bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
                                        >
                                            View in 3D
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}
