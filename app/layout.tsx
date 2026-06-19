import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Made in Hvar',
  description: 'Small-batch ceramics, textiles and crafts handmade in Hvar, Croatia.',
  openGraph: {
    title: 'Made in Hvar',
    description: 'Small-batch ceramics, textiles and crafts handmade in Hvar, Croatia.',
    type: 'website',
    url: siteUrl,
    images: [{ url: '/images/hero-1.svg', width: 1200, height: 600, alt: 'Made in Hvar' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
