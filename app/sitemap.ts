import { MetadataRoute } from 'next'
import { products } from '../lib/mock/products'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/cart`, lastModified: new Date() },
    { url: `${baseUrl}/checkout`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date()
    }))
  ]
}
