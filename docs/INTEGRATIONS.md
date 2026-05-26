# Integration Instructions

## Sanity CMS
1. Create a free Sanity project at https://www.sanity.io/
2. Copy `SANITY_PROJECT_ID` and `SANITY_DATASET` into `.env.local`
3. Copy `SANITY_API_TOKEN` from your Sanity dashboard into `.env.local`
4. Install studio dependencies and run the studio from the `sanity/` directory:

```bash
cd sanity
npm install
npx sanity init
```

5. Use the schemas in `sanity/schemas/` to configure the studio:
   - `product`
   - `category`
   - `homepage`
   - `siteSettings`

6. Deploy Sanity Studio later using Vercel or Sanity hosting.

## Stripe Checkout
1. Create a Stripe account at https://dashboard.stripe.com/.
2. In Stripe, create a payment product or use the Price API. This app uses dynamic `price_data` in the checkout route.
3. Add these keys to `.env.local` and to your Vercel environment variables:
   - `STRIPE_SECRET_KEY` -> your Stripe secret API key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` -> your Stripe publishable key
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain, for example `https://your-shop.vercel.app`.
5. The app already includes `app/api/stripe/checkout/route.ts` to create a Stripe Checkout session.
6. After deployment, Stripe checkout will use `/api/stripe/checkout` automatically.

## Resend Email
1. Create a free Resend account at https://resend.com/.
2. Add these keys to `.env.local` and to Vercel environment variables:
   - `RESEND_API_KEY` -> your Resend API key
   - `RESEND_FROM_EMAIL` -> the verified from address in Resend (e.g. `orders@yourdomain.com`)
   - `RESEND_NOTIFY_EMAIL` -> shop owner notification email (e.g. `owner@yourdomain.com`)
3. Use `emails/templates.html` as the starter format for customer and owner emails.
4. The app includes `app/api/email/route.ts` for sending confirmation emails from the server.
5. Replace the hardcoded placeholder addresses in `.env.local` with your real verified sending address and notification recipient.

## Vercel Deployment
1. Push the repository to GitHub.
2. Create a new Vercel project and connect it to the repo.
3. Add these environment variables in Vercel:
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET`
   - `SANITY_API_TOKEN`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Confirm that `NEXT_PUBLIC_SITE_URL` matches your Vercel domain or custom domain.
5. Deploy the app and verify the homepage, shop, cart, and checkout routes.

## Sanity CMS
1. Create a free Sanity project at https://www.sanity.io/.
2. Copy `SANITY_PROJECT_ID` and `SANITY_DATASET` into `.env.local`.
3. Copy `SANITY_API_TOKEN` from the Sanity dashboard into `.env.local`.
4. In the `sanity/` folder, run:

```bash
cd sanity
npm install
npx sanity init
```

5. Use the schemas in `sanity/schemas/` to manage:
   - `product`
   - `category`
   - `homepage`
   - `siteSettings`
6. Deploy Sanity Studio separately on Vercel or Sanity hosting if you want a public content admin area.

## Important Deployment Notes
- The current demo uses mocked data from `lib/mock/products.ts`. For production, connect these pages to Sanity content.
- `NEXT_PUBLIC_SITE_URL` is required for metadata, OpenGraph, sitemap generation, and Stripe callback URLs.
- Vercel will pick up the Next.js app automatically; no custom build system is required.

## Notes
- This demo uses mock data in `lib/mock/products.ts`.
- Local cart state is managed with Zustand at `store/useCart.ts`.
- Shipping rates are fixed and selected during checkout.
- No payment or email service is active until real integration is added.
