"use client"
import { useState } from 'react'
import ProductGrid from '../../components/ProductGrid'
import { products } from '../../lib/mock/products'
import SearchFilter from '../../components/SearchFilter'

export default function ShopPage() {
  const [filtered, setFiltered] = useState(products)

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl font-serif">Shop</h1>
        <p className="text-muted mt-2">Browse our handmade collection.</p>
      </header>

      <SearchFilter items={products} onFiltered={setFiltered} />

      <ProductGrid items={filtered} />
    </section>
  )
}
