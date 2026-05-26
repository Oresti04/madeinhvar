import Link from 'next/link'
import { Product } from '../types/product'

export default function ProductGrid({ items }: { items: Product[] }){
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      {items.map(p=> (
        <Link href={`/product/${p.slug}`} key={p.id} className="block bg-white rounded overflow-hidden shadow-sm">
          <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="font-medium">{p.title}</div>
            <div className="text-muted mt-2">€{(p.price/100).toFixed(2)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
