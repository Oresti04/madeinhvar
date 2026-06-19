import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1C1208] text-[#c9b99a] mt-auto">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="font-serif text-white text-xl mb-3">Made in Hvar</div>
            <p className="text-sm leading-relaxed opacity-70">
              Small-batch ceramics, textiles and crafts handmade on the island of Hvar, Croatia.
            </p>
          </div>

          {/* Contact */}
          <div>
            <div className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Contact</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 opacity-50 text-xs">&#9679;</span>
                <span className="leading-relaxed">
                  Trg svetog Stjepana 18<br />21450, Hvar, Croatia
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="opacity-50 text-xs">&#9679;</span>
                <a href="tel:+38598168786" className="hover:text-white transition-colors duration-200">
                  +385 98 168 7864
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="opacity-50 text-xs">&#9679;</span>
                <a href="mailto:madeinhvar@gmail.com" className="hover:text-white transition-colors duration-200">
                  madeinhvar@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links + Social */}
          <div className="space-y-8">
            <div>
              <div className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Explore</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/shop" className="hover:text-white transition-colors duration-200">All products</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors duration-200">About us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Get in touch</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Follow</div>
              <a
                href="https://instagram.com/madeinhvar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm hover:text-white transition-colors duration-200 group"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="group-hover:scale-110 transition-transform duration-200">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @madeinhvar
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs opacity-40">
          <span>© {new Date().getFullYear()} Made in Hvar. All rights reserved.</span>
          <span>Handmade in Hvar, Croatia</span>
        </div>
      </div>
    </footer>
  )
}
