import Image from 'next/image'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import { getFeaturedProducts } from '@/lib/products'

export default async function Home() {
  const featured = (await getFeaturedProducts()).slice(0, 4)

  return (
    <section>
      <header className="mb-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-terracotta mb-3">Hvar, Croatia</p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight">Handmade in Hvar</h1>
            <p className="mt-4 text-muted text-lg leading-relaxed">Small-batch ceramics, textiles and crafts inspired by Hvar's light and sea.</p>
            <div className="flex gap-3 mt-7">
              <Link href="/shop" className="btn btn-primary">Shop now</Link>
              <Link href="/about" className="btn btn-secondary">Our story</Link>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-72 md:h-[420px]">
            <Image
              src="/images/hero-1.jpg"
              alt="Made in Hvar — handmade crafts from Hvar, Croatia"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </header>

      <section className="mb-16 reveal">
        <h2 className="text-2xl font-serif mb-8">Featured products</h2>
        <ProductGrid items={featured} />
      </section>

      <section className="mb-16 reveal">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-terracotta mb-2">Our craft</p>
            <h3 className="text-2xl font-serif mb-3">Made slowly, made well</h3>
            <p className="text-muted leading-relaxed">We create objects that feel rooted in Mediterranean craft — slow-made, thoughtfully designed for everyday life on the island.</p>
            <Link href="/about" className="inline-block btn btn-secondary mt-5 text-sm">Learn more</Link>
          </div>
          <img src="/images/about-1.svg" alt="Workshop" className="w-full rounded-2xl shadow-md" />
        </div>
      </section>

    </section>
  )
}
