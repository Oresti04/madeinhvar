export default function About() {
  return (
    <section>
      <h1 className="text-3xl font-serif mb-6">About the Shop</h1>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <p className="text-muted">Located in Hvar, we make small-batch ceramics, linens and objects inspired by the island's light and traditional crafts.</p>
          <p className="mt-4">Our work focuses on natural materials, slow processes, and subtle forms. Each object is hand-finished by the artisan.</p>
        </div>
        <img src="/images/about-2.svg" alt="Workshop" className="rounded shadow-sm" />
      </div>
    </section>
  )
}
