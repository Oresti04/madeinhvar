export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    { name: 'category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'featured', type: 'boolean' },
    { name: 'dimensions', type: 'string' },
    { name: 'materials', type: 'string' },
    { name: 'shippingInfo', type: 'text' }
  ]
}
