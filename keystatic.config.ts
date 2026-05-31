import { config, collection, fields } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'Made in Hvar' } },
  collections: {
    products: collection({
      label: 'Products',
      slugField: 'title',
      path: 'content/products/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        price: fields.integer({
          label: 'Price (in cents)',
          description: 'Enter price in euro cents — e.g. 4500 = €45.00',
          validation: { min: 1 }
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { value: 'Bookmarks', label: 'Bookmarks' },
            { value: 'Graphics', label: 'Graphics' },
            { value: 'Digital prints', label: 'Digital prints' },
            { value: 'Jewelry', label: 'Jewelry' },
            { value: 'Ceramics', label: 'Ceramics' },
            { value: 'Driftwood art', label: 'Driftwood art' },
            { value: 'Bags', label: 'Bags' },
            { value: 'Shavasana eyecovers', label: 'Shavasana eyecovers' },
            { value: 'T-Shirts', label: 'T-Shirts (Coming Soon)' },
            { value: 'Hoodies', label: 'Hoodies (Coming Soon)' },
          ],
          defaultValue: 'Bookmarks'
        }),
        featured: fields.checkbox({ label: 'Featured on homepage', defaultValue: false }),
        dimensions: fields.text({ label: 'Dimensions (optional)' }),
        materials: fields.text({ label: 'Materials (optional)' }),
        shippingInfo: fields.text({ label: 'Shipping info (optional)' }),
        images: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/images/products',
            publicPath: '/images/products/',
          }),
          { label: 'Product images', itemLabel: () => 'Image' }
        ),
      },
    }),
  },
})
