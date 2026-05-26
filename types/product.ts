export type Product = {
  id: string
  title: string
  slug: string
  description: string
  price: number // in cents
  images: string[]
  category: string
  featured?: boolean
  dimensions?: string
  materials?: string
  shippingInfo?: string
}
