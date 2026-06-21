"use client"
import { useEffect, useMemo, useState } from 'react'
import useCart from '@/store/useCart'
import Link from 'next/link'

const NOTES_MAX = 500

const SHIPPING_OPTIONS = [
  { id: 'croatia', label: 'Croatia', subtitle: 'Fast local delivery', cost: 500 },
  { id: 'eu', label: 'EU', subtitle: 'Standard European delivery', cost: 1200 },
  { id: 'world', label: 'Worldwide', subtitle: 'International shipping', cost: 2000 }
] as const

const COUNTRIES = [
  'Croatia',
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo (Democratic Republic)', 'Congo (Republic)', 'Costa Rica', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen', 'Zambia', 'Zimbabwe',
]

const PHONE_PREFIXES = [
  { code: '+385', label: '+385 Croatia' },
  { code: '+93',  label: '+93 Afghanistan' },
  { code: '+355', label: '+355 Albania' },
  { code: '+213', label: '+213 Algeria' },
  { code: '+376', label: '+376 Andorra' },
  { code: '+244', label: '+244 Angola' },
  { code: '+1',   label: '+1 Antigua & Barbuda' },
  { code: '+54',  label: '+54 Argentina' },
  { code: '+374', label: '+374 Armenia' },
  { code: '+61',  label: '+61 Australia' },
  { code: '+43',  label: '+43 Austria' },
  { code: '+994', label: '+994 Azerbaijan' },
  { code: '+1',   label: '+1 Bahamas' },
  { code: '+973', label: '+973 Bahrain' },
  { code: '+880', label: '+880 Bangladesh' },
  { code: '+1',   label: '+1 Barbados' },
  { code: '+375', label: '+375 Belarus' },
  { code: '+32',  label: '+32 Belgium' },
  { code: '+501', label: '+501 Belize' },
  { code: '+229', label: '+229 Benin' },
  { code: '+975', label: '+975 Bhutan' },
  { code: '+591', label: '+591 Bolivia' },
  { code: '+387', label: '+387 Bosnia and Herzegovina' },
  { code: '+267', label: '+267 Botswana' },
  { code: '+55',  label: '+55 Brazil' },
  { code: '+673', label: '+673 Brunei' },
  { code: '+359', label: '+359 Bulgaria' },
  { code: '+226', label: '+226 Burkina Faso' },
  { code: '+257', label: '+257 Burundi' },
  { code: '+238', label: '+238 Cabo Verde' },
  { code: '+855', label: '+855 Cambodia' },
  { code: '+237', label: '+237 Cameroon' },
  { code: '+1',   label: '+1 Canada' },
  { code: '+236', label: '+236 Central African Republic' },
  { code: '+235', label: '+235 Chad' },
  { code: '+56',  label: '+56 Chile' },
  { code: '+86',  label: '+86 China' },
  { code: '+57',  label: '+57 Colombia' },
  { code: '+269', label: '+269 Comoros' },
  { code: '+243', label: '+243 Congo (DR)' },
  { code: '+242', label: '+242 Congo (Republic)' },
  { code: '+506', label: '+506 Costa Rica' },
  { code: '+53',  label: '+53 Cuba' },
  { code: '+357', label: '+357 Cyprus' },
  { code: '+420', label: '+420 Czech Republic' },
  { code: '+45',  label: '+45 Denmark' },
  { code: '+253', label: '+253 Djibouti' },
  { code: '+1',   label: '+1 Dominica' },
  { code: '+1',   label: '+1 Dominican Republic' },
  { code: '+593', label: '+593 Ecuador' },
  { code: '+20',  label: '+20 Egypt' },
  { code: '+503', label: '+503 El Salvador' },
  { code: '+240', label: '+240 Equatorial Guinea' },
  { code: '+291', label: '+291 Eritrea' },
  { code: '+372', label: '+372 Estonia' },
  { code: '+268', label: '+268 Eswatini' },
  { code: '+251', label: '+251 Ethiopia' },
  { code: '+679', label: '+679 Fiji' },
  { code: '+358', label: '+358 Finland' },
  { code: '+33',  label: '+33 France' },
  { code: '+241', label: '+241 Gabon' },
  { code: '+220', label: '+220 Gambia' },
  { code: '+995', label: '+995 Georgia' },
  { code: '+49',  label: '+49 Germany' },
  { code: '+233', label: '+233 Ghana' },
  { code: '+30',  label: '+30 Greece' },
  { code: '+1',   label: '+1 Grenada' },
  { code: '+502', label: '+502 Guatemala' },
  { code: '+224', label: '+224 Guinea' },
  { code: '+245', label: '+245 Guinea-Bissau' },
  { code: '+592', label: '+592 Guyana' },
  { code: '+509', label: '+509 Haiti' },
  { code: '+504', label: '+504 Honduras' },
  { code: '+36',  label: '+36 Hungary' },
  { code: '+354', label: '+354 Iceland' },
  { code: '+91',  label: '+91 India' },
  { code: '+62',  label: '+62 Indonesia' },
  { code: '+98',  label: '+98 Iran' },
  { code: '+964', label: '+964 Iraq' },
  { code: '+353', label: '+353 Ireland' },
  { code: '+972', label: '+972 Israel' },
  { code: '+39',  label: '+39 Italy' },
  { code: '+1',   label: '+1 Jamaica' },
  { code: '+81',  label: '+81 Japan' },
  { code: '+962', label: '+962 Jordan' },
  { code: '+7',   label: '+7 Kazakhstan' },
  { code: '+254', label: '+254 Kenya' },
  { code: '+686', label: '+686 Kiribati' },
  { code: '+383', label: '+383 Kosovo' },
  { code: '+965', label: '+965 Kuwait' },
  { code: '+996', label: '+996 Kyrgyzstan' },
  { code: '+856', label: '+856 Laos' },
  { code: '+371', label: '+371 Latvia' },
  { code: '+961', label: '+961 Lebanon' },
  { code: '+266', label: '+266 Lesotho' },
  { code: '+231', label: '+231 Liberia' },
  { code: '+218', label: '+218 Libya' },
  { code: '+423', label: '+423 Liechtenstein' },
  { code: '+370', label: '+370 Lithuania' },
  { code: '+352', label: '+352 Luxembourg' },
  { code: '+261', label: '+261 Madagascar' },
  { code: '+265', label: '+265 Malawi' },
  { code: '+60',  label: '+60 Malaysia' },
  { code: '+960', label: '+960 Maldives' },
  { code: '+223', label: '+223 Mali' },
  { code: '+356', label: '+356 Malta' },
  { code: '+692', label: '+692 Marshall Islands' },
  { code: '+222', label: '+222 Mauritania' },
  { code: '+230', label: '+230 Mauritius' },
  { code: '+52',  label: '+52 Mexico' },
  { code: '+691', label: '+691 Micronesia' },
  { code: '+373', label: '+373 Moldova' },
  { code: '+377', label: '+377 Monaco' },
  { code: '+976', label: '+976 Mongolia' },
  { code: '+382', label: '+382 Montenegro' },
  { code: '+212', label: '+212 Morocco' },
  { code: '+258', label: '+258 Mozambique' },
  { code: '+95',  label: '+95 Myanmar' },
  { code: '+264', label: '+264 Namibia' },
  { code: '+674', label: '+674 Nauru' },
  { code: '+977', label: '+977 Nepal' },
  { code: '+31',  label: '+31 Netherlands' },
  { code: '+64',  label: '+64 New Zealand' },
  { code: '+505', label: '+505 Nicaragua' },
  { code: '+227', label: '+227 Niger' },
  { code: '+234', label: '+234 Nigeria' },
  { code: '+850', label: '+850 North Korea' },
  { code: '+389', label: '+389 North Macedonia' },
  { code: '+47',  label: '+47 Norway' },
  { code: '+968', label: '+968 Oman' },
  { code: '+92',  label: '+92 Pakistan' },
  { code: '+680', label: '+680 Palau' },
  { code: '+970', label: '+970 Palestine' },
  { code: '+507', label: '+507 Panama' },
  { code: '+675', label: '+675 Papua New Guinea' },
  { code: '+595', label: '+595 Paraguay' },
  { code: '+51',  label: '+51 Peru' },
  { code: '+63',  label: '+63 Philippines' },
  { code: '+48',  label: '+48 Poland' },
  { code: '+351', label: '+351 Portugal' },
  { code: '+974', label: '+974 Qatar' },
  { code: '+40',  label: '+40 Romania' },
  { code: '+7',   label: '+7 Russia' },
  { code: '+250', label: '+250 Rwanda' },
  { code: '+1',   label: '+1 Saint Kitts & Nevis' },
  { code: '+1',   label: '+1 Saint Lucia' },
  { code: '+1',   label: '+1 Saint Vincent' },
  { code: '+685', label: '+685 Samoa' },
  { code: '+378', label: '+378 San Marino' },
  { code: '+239', label: '+239 São Tomé and Príncipe' },
  { code: '+966', label: '+966 Saudi Arabia' },
  { code: '+221', label: '+221 Senegal' },
  { code: '+381', label: '+381 Serbia' },
  { code: '+248', label: '+248 Seychelles' },
  { code: '+232', label: '+232 Sierra Leone' },
  { code: '+65',  label: '+65 Singapore' },
  { code: '+421', label: '+421 Slovakia' },
  { code: '+386', label: '+386 Slovenia' },
  { code: '+677', label: '+677 Solomon Islands' },
  { code: '+252', label: '+252 Somalia' },
  { code: '+27',  label: '+27 South Africa' },
  { code: '+82',  label: '+82 South Korea' },
  { code: '+211', label: '+211 South Sudan' },
  { code: '+34',  label: '+34 Spain' },
  { code: '+94',  label: '+94 Sri Lanka' },
  { code: '+249', label: '+249 Sudan' },
  { code: '+597', label: '+597 Suriname' },
  { code: '+46',  label: '+46 Sweden' },
  { code: '+41',  label: '+41 Switzerland' },
  { code: '+963', label: '+963 Syria' },
  { code: '+886', label: '+886 Taiwan' },
  { code: '+992', label: '+992 Tajikistan' },
  { code: '+255', label: '+255 Tanzania' },
  { code: '+66',  label: '+66 Thailand' },
  { code: '+670', label: '+670 Timor-Leste' },
  { code: '+228', label: '+228 Togo' },
  { code: '+676', label: '+676 Tonga' },
  { code: '+1',   label: '+1 Trinidad and Tobago' },
  { code: '+216', label: '+216 Tunisia' },
  { code: '+90',  label: '+90 Turkey' },
  { code: '+993', label: '+993 Turkmenistan' },
  { code: '+688', label: '+688 Tuvalu' },
  { code: '+256', label: '+256 Uganda' },
  { code: '+380', label: '+380 Ukraine' },
  { code: '+971', label: '+971 United Arab Emirates' },
  { code: '+44',  label: '+44 United Kingdom' },
  { code: '+1',   label: '+1 United States' },
  { code: '+598', label: '+598 Uruguay' },
  { code: '+998', label: '+998 Uzbekistan' },
  { code: '+678', label: '+678 Vanuatu' },
  { code: '+39',  label: '+39 Vatican City' },
  { code: '+58',  label: '+58 Venezuela' },
  { code: '+84',  label: '+84 Vietnam' },
  { code: '+967', label: '+967 Yemen' },
  { code: '+260', label: '+260 Zambia' },
  { code: '+263', label: '+263 Zimbabwe' },
]

function Chevron() {
  return (
    <svg className="w-4 h-4 text-muted pointer-events-none shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
    </svg>
  )
}

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [shipping, setShipping] = useState<'croatia' | 'eu' | 'world'>('croatia')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+385')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('Croatia')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const shippingOption = SHIPPING_OPTIONS.find((o) => o.id === shipping)!
  const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0)
  const total = subtotal + shippingOption.cost

  const itemSummary = useMemo(() => (
    items.map((item) => ({ ...item, totalPrice: item.price * item.quantity }))
  ), [items])

  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) {
    return (
      <section>
        <h1 className="text-2xl font-serif mb-6">Order Request</h1>
        <p className="text-muted">Loading…</p>
      </section>
    )
  }

  if (submittedOrderId) {
    return (
      <section>
        <div className="card no-hover-card p-8 text-center max-w-lg mx-auto">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-serif mb-3">Order request received</h1>
          <p className="text-muted mb-4">
            Thank you, <strong>{name}</strong>! We've noted your order and will send a secure payment link to <strong>{email}</strong> shortly.
          </p>
          <p className="text-sm text-muted mb-6">
            Order reference: <span className="font-mono">{submittedOrderId}</span>
          </p>
          <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
        </div>
      </section>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (items.length === 0) {
      setError('Your cart is empty. Please add at least one item before requesting an order.')
      return
    }
    setIsLoading(true)
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items, shipping,
        name: name.trim(),
        email: email.trim(),
        phone: `${phonePrefix} ${phone.trim()}`,
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country,
        notes: notes.trim(),
        total,
        _trap: '',
      })
    })
    const data = await response.json()
    setIsLoading(false)
    if (!response.ok || !data.success) {
      setError(data.error || 'Unable to submit your order request. Please try again.')
      return
    }
    clear()
    setSubmittedOrderId(data.orderId)
  }

  return (
    <section>
      <h1 className="text-2xl font-serif mb-2">Order Request</h1>
      <p className="text-muted mb-8">Fill in your details and we'll send a secure payment link to your email. No payment is taken on this page.</p>

      <form onSubmit={handleSubmit}>
        <input type="text" name="_trap" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Left: form */}
          <div className="space-y-6">

            <div className="card no-hover-card p-6">
              <h2 className="text-lg font-serif mb-4">Your details</h2>
              <div className="grid gap-4">
                <input
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="field"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  pattern="[A-Za-zÀ-ɏ '\-]{2,}"
                  title="Name must be at least 2 characters and contain only letters, spaces, hyphens or apostrophes"
                />
                <input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="field"
                  required
                  maxLength={100}
                  autoComplete="email"
                  inputMode="email"
                />
                {/* Phone with prefix */}
                <div className="flex overflow-hidden border border-black/[0.12] rounded-[0.85rem] bg-white transition-[border-color,box-shadow] duration-200 focus-within:border-terracotta focus-within:shadow-[0_0_0_3px_rgba(200,138,106,0.16)]">
                  <div className="relative flex items-center shrink-0 border-r border-black/[0.12] w-[6.5rem] overflow-hidden">
                    <select
                      value={phonePrefix}
                      onChange={e => setPhonePrefix(e.target.value)}
                      className="appearance-none bg-transparent pl-3 pr-7 py-[0.85rem] text-sm focus:outline-none cursor-pointer w-full"
                      autoComplete="tel-country-code"
                      aria-label="Phone country code"
                    >
                      {PHONE_PREFIXES.map((p, i) => (
                        <option key={i} value={p.code}>{p.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2"><Chevron /></div>
                  </div>
                  <input
                    placeholder="Phone number"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-transparent px-3 py-[0.85rem] text-[0.9375rem] focus:outline-none min-w-0"
                    required
                    minLength={4}
                    maxLength={20}
                    autoComplete="tel-national"
                    inputMode="numeric"
                    pattern="\d{4,}"
                    title="Enter a valid phone number (digits only)"
                  />
                </div>
              </div>
            </div>

            <div className="card no-hover-card p-6">
              <h2 className="text-lg font-serif mb-4">Shipping address</h2>
              <div className="grid gap-4 mb-5">
                <input
                  placeholder="Street address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="field"
                  required
                  minLength={5}
                  maxLength={200}
                  autoComplete="street-address"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="field"
                    required
                    minLength={2}
                    maxLength={50}
                    autoComplete="address-level2"
                    pattern="[A-Za-zÀ-ɏ \-'\.]{2,}"
                    title="Enter a valid city name"
                  />
                  <input
                    placeholder="Postal code"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    className="field"
                    required
                    minLength={2}
                    maxLength={12}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    pattern="\d{2,}"
                    title="Enter a valid postal code (digits only)"
                  />
                </div>
                {/* Country dropdown */}
                <div className="relative">
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="field appearance-none pr-10"
                    required autoComplete="country-name"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"><Chevron /></div>
                </div>
              </div>

              <div className="border-t border-black/8 pt-5">
                <p className="text-sm font-medium mb-3">Shipping method</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {SHIPPING_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`rounded-lg border p-3 cursor-pointer transition-colors ${shipping === option.id ? 'border-terracotta bg-terracotta/5' : 'border-black/10 hover:border-terracotta/50'}`}
                    >
                      <input type="radio" name="shipping" value={option.id} checked={shipping === option.id} onChange={() => setShipping(option.id)} className="sr-only" />
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted mt-0.5">{option.subtitle}</p>
                      <p className="text-sm mt-2">€{(option.cost / 100).toFixed(2)}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="card no-hover-card p-6">
              <h2 className="text-lg font-serif mb-1">Order notes <span className="text-sm font-sans font-normal text-muted">(optional)</span></h2>
              <p className="text-xs text-muted mb-4">Any special instructions or requests</p>
              <textarea
                placeholder="e.g. gift wrapping, colour preference…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="field min-h-[90px] resize-none"
                maxLength={NOTES_MAX}
              />
              <p className={`text-xs mt-1 text-right ${notes.length / NOTES_MAX >= 1 ? 'text-red-500' : notes.length / NOTES_MAX >= 0.8 ? 'text-terracotta' : 'text-muted'}`}>
                {notes.length} / {NOTES_MAX}
              </p>
            </div>

          </div>

          {/* Right: order summary */}
          <aside className="card no-hover-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-serif mb-4">Order summary</h2>
              {items.length === 0 ? (
                <p className="text-muted text-sm">No items in cart.</p>
              ) : (
                <div className="space-y-3">
                  {itemSummary.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-stone" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug truncate">{item.title}</p>
                        <p className="text-xs text-muted">{item.quantity} × €{(item.price / 100).toFixed(2)}</p>
                      </div>
                      <p className="text-sm flex-shrink-0">€{(item.totalPrice / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-black/8 pt-5 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>€{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>{shippingOption.label} shipping</span>
                <span>€{(shippingOption.cost / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-black/8 text-base">
                <span>Total</span>
                <span>€{(total / 100).toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full disabled:opacity-50">
              {isLoading ? 'Submitting…' : 'Submit order request'}
            </button>

            <p className="text-xs text-muted leading-relaxed">
              Payment is not collected here. After placing your request, we'll send a secure payment link to your email to complete the purchase.
            </p>

            <div className="border-t border-black/8 pt-5">
              <p className="text-sm font-medium mb-3">How it works</p>
              <ol className="text-sm text-muted space-y-2">
                <li><span className="font-medium text-foreground">1.</span> Submit your order request</li>
                <li><span className="font-medium text-foreground">2.</span> We send a secure payment link to your email</li>
                <li><span className="font-medium text-foreground">3.</span> Complete payment through the link</li>
                <li><span className="font-medium text-foreground">4.</span> We ship your items and send a tracking number</li>
              </ol>
            </div>
          </aside>

        </div>
      </form>
    </section>
  )
}
