import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Made in Hvar — Demo',
  description: 'Artisanal shop demo — minimal Mediterranean ecommerce',
  openGraph: {
    title: 'Made in Hvar — Demo',
    description: 'Artisanal shop demo — minimal Mediterranean ecommerce',
    type: 'website',
    url: siteUrl,
    images: [{ url: '/images/hero-1.svg', width: 1200, height: 600, alt: 'Made in Hvar demo' }]
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container py-12">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
