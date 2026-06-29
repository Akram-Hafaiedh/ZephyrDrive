'use client'

export type Filters = {
    make: string | 'All'
    bodyType: string | 'All'
    sort: 'price-asc' | 'price-desc' | 'year-desc'
}

type FilterPanelProps = {
    makes: string[]
    bodyTypes: string[]
    filters: Filters
    onChange: (filters: Filters) => void
}

export default function FilterPanel({ makes, bodyTypes, filters, onChange }: FilterPanelProps) {
    return (
        <div className="flex flex-wrap gap-4 items-center bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
            <Select
                label="Make"
                value={filters.make}
                options={['All', ...makes]}
                onChange={(v) => onChange({ ...filters, make: v })}
            />
            <Select
                label="Body Type"
                value={filters.bodyType}
                options={['All', ...bodyTypes]}
                onChange={(v) => onChange({ ...filters, bodyType: v })}
            />
            <Select
                label="Sort"
                value={filters.sort}
                options={['price-asc', 'price-desc', 'year-desc']}
                labels={{ 'price-asc': 'Price: Low to High', 'price-desc': 'Price: High to Low', 'year-desc': 'Newest First' }}
                onChange={(v) => onChange({ ...filters, sort: v as Filters['sort'] })}
            />
        </div>
    )
}

function Select({
    label,
    value,
    options,
    labels,
    onChange,
}: {
    label: string
    value: string
    options: string[]
    labels?: Record<string, string>
    onChange: (v: string) => void
}) {
    return (
        <label className="flex flex-col gap-1 text-sm text-white/60">
            {label}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {labels?.[opt] ?? opt}
                    </option>
                ))}
            </select>
        </label>
    )
}
