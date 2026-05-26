import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import product from './schemas/product'
import category from './schemas/category'
import homepage from './schemas/homepage'
import siteSettings from './schemas/siteSettings'

export default defineConfig({
  name: 'default',
  title: 'Made in Hvar Studio',
  projectId: process.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [deskTool()],
  schema: {
    types: [product, category, homepage, siteSettings]
  }
})
