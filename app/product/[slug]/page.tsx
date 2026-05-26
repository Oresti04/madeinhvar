import { products } from '../../../lib/mock/products'
import AddToCartButton from '../../../components/AddToCartButton'

export default async function ProductPage({ params }: any) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return <p>Product not found</p>

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded overflow-hidden">
          <img src={product.images[0]} alt={product.title} className="w-full h-96 object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-serif">{product.title}</h1>
          <p className="mt-4 text-muted">{product.description}</p>
          <p className="mt-6 text-xl">€{(product.price / 100).toFixed(2)}</p>
          <AddToCartButton product={product} />

          <section className="mt-8">
            <h3 className="font-serif">Details</h3>
            <ul className="text-muted mt-2">
              <li>Materials: {product.materials}</li>
              <li>Dimensions: {product.dimensions}</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  )
}
