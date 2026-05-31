import Image from 'next/image'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import { getFeaturedProducts } from '@/lib/products'

export default async function Home() {
  const featured = (await getFeaturedProducts()).slice(0, 4)

  return (
    <section>
      <header className="mb-12">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight">Handmade in Hvar</h1>
            <p className="mt-4 text-muted">Small-batch ceramics, textiles and crafts inspired by Hvar's light and sea.</p>
            <Link href="/shop" className="inline-block btn btn-primary mt-6">Shop now</Link>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src="/images/hero-1.svg" alt="Hero" className="w-full h-64 object-cover" />
          </div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-serif mb-6">Featured</h2>
        <ProductGrid items={featured} />
      </section>

      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-serif">Our Story</h3>
            <p className="mt-2 text-muted">We create objects that feel rooted in Mediterranean craft — slow-made, thoughtfully designed.</p>
          </div>
          <img src="/images/about-1.svg" alt="Workshop" className="w-full rounded-lg shadow-sm" />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-serif mb-4">Instagram</h3>
        <div className="grid grid-cols-3 gap-3">
          <img src="/images/insta-1.svg" alt="Instagram" className="w-full h-32 object-cover rounded" />
          <img src="/images/insta-2.svg" alt="Instagram" className="w-full h-32 object-cover rounded" />
          <img src="/images/insta-3.svg" alt="Instagram" className="w-full h-32 object-cover rounded" />
        </div>
      </section>
    </section>
  )
}
