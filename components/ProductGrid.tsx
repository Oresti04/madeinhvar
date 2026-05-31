import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../types/product'

export default function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return <p className="text-muted">No products found.</p>
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((p) => (
        <Link href={`/product/${p.slug}`} key={p.id} className="group card overflow-hidden">
          <div className="relative h-48 overflow-hidden bg-stone">
            {p.images[0] ? (
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : (
              <div className="w-full h-full bg-stone" />
            )}
          </div>
          <div className="p-5">
            <div className="font-medium text-black">{p.title}</div>
            <div className="text-muted mt-2">€{(p.price / 100).toFixed(2)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
