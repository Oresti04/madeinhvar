export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    { name: 'heroTitle', type: 'string' },
    { name: 'heroImage', type: 'image' },
    { name: 'featuredProducts', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] }
  ]
}
