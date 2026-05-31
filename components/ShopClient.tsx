"use client"
import { useState } from 'react'
import ProductGrid from './ProductGrid'
import SearchFilter from './SearchFilter'
import { Product } from '../types/product'

export default function ShopClient({ products }: { products: Product[] }) {
  const [filtered, setFiltered] = useState(products)
  return (
    <>
      <SearchFilter items={products} onFiltered={setFiltered} />
      <ProductGrid items={filtered} />
    </>
  )
}
