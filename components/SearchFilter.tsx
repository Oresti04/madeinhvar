"use client"
import { useEffect, useMemo, useState } from 'react'
import { Product } from '../types/product'

export default function SearchFilter({ items, onFiltered }: { items: Product[]; onFiltered: (items: Product[]) => void }){
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = Array.from(new Set(items.map(i => i.category)))

  const filtered = useMemo(
    () => items.filter(i => {
      if (category !== 'all' && i.category !== category) return false
      if (query && !i.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    }),
    [items, category, query]
  )

  useEffect(() => {
    onFiltered(filtered)
  }, [filtered, onFiltered])

  return (
    <div className="mb-6">
      <div className="flex gap-3 mb-3">
        <input placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 border px-3 py-2 rounded" />
        {/* Mobile: arrow-only */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:hidden shrink-0 w-10 appearance-none border border-black/[0.12] rounded-[0.85rem] bg-white cursor-pointer focus:outline-none focus:border-terracotta" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236F6A63'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '1.1rem', color: 'transparent' }}>
          <option value="all">All</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Desktop: full label */}
        <div className="hidden sm:block w-36 shrink-0">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="field">
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-sm text-muted">Showing {filtered.length} of {items.length}</div>
    </div>
  )
}
