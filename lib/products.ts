import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import { Product } from '../types/product'

const reader = createReader(process.cwd(), keystaticConfig)

function resolveTitle(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object' && 'value' in raw && typeof (raw as any).value === 'string') {
    return (raw as any).value
  }
  return ''
}

function resolveImages(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((img): img is string => typeof img === 'string' && img.length > 0)
}

async function entryToProduct(slug: string): Promise<Product | null> {
  const entry = await reader.collections.products.read(slug)
  if (!entry) return null

  return {
    id: slug,
    title: resolveTitle(entry.title),
    slug,
    description: entry.description ?? '',
    price: entry.price ?? 0,
    images: resolveImages(entry.images),
    category: entry.category ?? '',
    featured: entry.featured ?? false,
    details: entry.details ?? undefined,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const slugs = await reader.collections.products.list()
  const results = await Promise.all(slugs.map(entryToProduct))
  return results.filter((p): p is Product => p !== null)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return entryToProduct(slug)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter((p) => p.featured)
}
