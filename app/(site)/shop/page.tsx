import { getAllProducts } from '@/lib/products'
import ShopClient from '@/components/ShopClient'

export default async function ShopPage() {
  const products = await getAllProducts()

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl font-serif">Shop</h1>
        <p className="text-muted mt-2">Browse our handmade collection.</p>
      </header>
      <ShopClient products={products} />
    </section>
  )
}
