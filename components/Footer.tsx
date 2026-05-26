export default function Footer(){
  return (
    <footer className="border-t mt-12 bg-white">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-start">
        <div>
          <div className="font-serif">Made in Hvar</div>
          <div className="text-muted text-sm">Handmade in Hvar, Croatia</div>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-muted">© {new Date().getFullYear()} Made in Hvar — Demo</div>
      </div>
    </footer>
  )
}
