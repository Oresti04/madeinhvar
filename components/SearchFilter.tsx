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
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-3 py-2 rounded">
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm text-muted">Showing {filtered.length} of {items.length}</div>
    </div>
  )
}
