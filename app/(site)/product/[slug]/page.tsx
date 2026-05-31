import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import AddToCartButton from '@/components/AddToCartButton'
import ProductGallery from '@/components/ProductGallery'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: `${product.title} — Made in Hvar`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: 'website',
      images: product.images[0] ? [{ url: product.images[0], width: 800, height: 800, alt: product.title }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const allProducts = await getAllProducts()
  const sameCategory = allProducts.filter((p) => p.category === product.category && p.id !== product.id)
  const recommended = (sameCategory.length > 0 ? sameCategory : allProducts.filter((p) => p.id !== product.id)).slice(0, 3)

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-6">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <h1 className="text-3xl font-serif">{product.title}</h1>
          <p className="mt-4 text-muted">{product.description}</p>
          <p className="mt-6 text-xl">€{(product.price / 100).toFixed(2)}</p>
          <AddToCartButton product={product} />

          <section className="mt-8">
            <h3 className="font-serif">Details</h3>
            <ul className="text-muted mt-2 space-y-1">
              {product.materials && <li>Materials: {product.materials}</li>}
              {product.dimensions && <li>Dimensions: {product.dimensions}</li>}
              {product.shippingInfo && <li>{product.shippingInfo}</li>}
            </ul>
          </section>
        </div>
      </div>

      {recommended.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-serif mb-4">You may also like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group card overflow-hidden">
                <div className="relative h-52 overflow-hidden bg-stone">
                  {item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-black">{item.title}</h3>
                  <p className="text-sm text-muted mt-2">€{(item.price / 100).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
