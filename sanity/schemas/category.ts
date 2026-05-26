export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } }
  ]
}
