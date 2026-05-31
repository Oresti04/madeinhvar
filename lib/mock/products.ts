import { Product } from '../../types/product'

export const products: Product[] = [
  {
    id: 'p1',
    title: 'Hvar Ceramic Bowl',
    slug: 'hvar-ceramic-bowl',
    description: 'Hand-thrown ceramic bowl with matte glaze.',
    price: 4500,
    images: ['/images/product-1.svg?v=1', '/images/product-1.svg?v=2', '/images/product-1.svg?v=3'],
    category: 'Ceramics',
    featured: true,
    dimensions: 'Ø20cm',
    materials: 'Stoneware, glaze',
    shippingInfo: 'Ships within 3-5 days'
  },
  {
    id: 'p2',
    title: 'Linen Napkin Set',
    slug: 'linen-napkin-set',
    description: 'Soft hand-dyed linen napkins.',
    price: 2500,
    images: ['/images/product-2.svg'],
    category: 'Textiles',
    featured: true,
    dimensions: '50x50cm',
    materials: 'Linen',
    shippingInfo: 'Ships within 2-4 days'
  },
  {
    id: 'p3',
    title: 'Olive Wood Spoon',
    slug: 'olive-wood-spoon',
    description: 'Hand-carved olive wood kitchen spoon.',
    price: 1200,
    images: ['/images/product-3.svg'],
    category: 'Kitchen',
    featured: false,
    dimensions: 'L25cm',
    materials: 'Olive wood',
    shippingInfo: 'Ships within 1-3 days'
  },
  {
    id: 'p4',
    title: 'Ceramic Pitcher',
    slug: 'ceramic-pitcher',
    description: 'Elegant pourer with subtle texture.',
    price: 6500,
    images: ['/images/product-4.svg?v=1', '/images/product-4.svg?v=2'],
    category: 'Ceramics',
    featured: false,
    dimensions: 'H20cm',
    materials: 'Stoneware',
    shippingInfo: 'Ships within 3-5 days'
  },
  {
    id: 'p5',
    title: 'Handwoven Basket',
    slug: 'handwoven-basket',
    description: 'Small handwoven storage basket.',
    price: 3200,
    images: ['/images/product-5.svg'],
    category: 'Home',
    featured: true,
    dimensions: 'Ø30cm',
    materials: 'Seagrass',
    shippingInfo: 'Ships within 4-7 days'
  },
  {
    id: 'p6',
    title: 'Terracotta Vase',
    slug: 'terracotta-vase',
    description: 'Handbuilt terracotta vase with natural glaze.',
    price: 5400,
    images: ['/images/product-6.svg'],
    category: 'Ceramics',
    featured: false,
    dimensions: 'H18cm',
    materials: 'Terracotta',
    shippingInfo: 'Ships within 3-5 days'
  },
  {
    id: 'p7',
    title: 'Small Throw Pillow',
    slug: 'small-throw-pillow',
    description: 'Linen pillow with natural filling.',
    price: 2800,
    images: ['/images/product-7.svg'],
    category: 'Textiles',
    featured: false,
    dimensions: '40x40cm',
    materials: 'Linen, wool',
    shippingInfo: 'Ships within 2-4 days'
  },
  {
    id: 'p8',
    title: 'Ceramic Spoon Rest',
    slug: 'ceramic-spoon-rest',
    description: 'Minimal spoon rest for daily use.',
    price: 900,
    images: ['/images/product-8.svg'],
    category: 'Kitchen',
    featured: false,
    dimensions: 'W10cm',
    materials: 'Stoneware',
    shippingInfo: 'Ships within 1-3 days'
  }
]
