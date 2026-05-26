export default function ContactPage(){
  return (
    <section>
      <h1 className="text-2xl font-serif mb-4">Contact</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-muted">Email: hello@madeinhvar.demo</p>
          <p className="mt-2">Phone: +385 99 000 0000</p>
          <form className="mt-6 grid gap-3 max-w-md">
            <input placeholder="Your name" className="border px-3 py-2 rounded" />
            <input placeholder="Email" className="border px-3 py-2 rounded" />
            <textarea placeholder="Message" className="border px-3 py-2 rounded" />
            <button className="bg-terracotta text-white px-4 py-2 rounded">Send</button>
          </form>
        </div>
        <div>
          <iframe title="Hvar map" src="https://www.google.com/maps?q=Hvar,+Croatia&output=embed" className="w-full h-64 rounded" />
        </div>
      </div>
    </section>
  )
}
