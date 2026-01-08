# WriteFlow AI - AI-Powered Writing Platform

A complete, production-ready SaaS platform for AI-powered content generation. Generate blog posts, emails, social media content, and product descriptions with the power of AI.

**Business Model:** $9.99/month subscription = 100 subscribers = $999/month revenue

## Features

- **6 AI Writing Tools:**
  - Blog Post Generator
  - Email Writer
  - Social Media Content Creator
  - Product Description Writer
  - Headline Generator
  - Content Rewriter

- **Monetization Ready:**
  - Stripe subscription billing
  - Free tier (5 generations/month)
  - Pro tier ($9.99/month, unlimited)

- **Full User Management:**
  - User registration & login
  - Session-based authentication
  - Usage tracking

## Quick Start (5 Minutes)

### Prerequisites

You'll need accounts (all have free tiers) on:
1. **Database:** [Neon](https://neon.tech) (free PostgreSQL)
2. **AI:** [OpenAI](https://platform.openai.com) (pay-as-you-go)
3. **Payments:** [Stripe](https://stripe.com) (free to start)

### Step 1: Clone and Install

```bash
cd ai-writing-platform
npm install
```

### Step 2: Run Setup Wizard

```bash
npm run setup
```

This interactive wizard will guide you through configuring:
- Database connection
- OpenAI API key
- Stripe API keys

### Step 3: Initialize Database

```bash
npx prisma db push
```

### Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000 - your platform is live!

---

## Detailed Setup Instructions

### 1. Get a Free PostgreSQL Database (Neon)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@host/db?sslmode=require`)

### 2. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login
3. Go to API Keys section
4. Create a new API key
5. Add credits ($5-10 is enough to start)

### 3. Set Up Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up for a Stripe account
3. Get your API keys:
   - Go to Developers → API keys
   - Copy the Publishable key (pk_test_...)
   - Copy the Secret key (sk_test_...)

4. Create a subscription product:
   - Go to Products → Add product
   - Name: "WriteFlow Pro"
   - Pricing: $9.99/month, recurring
   - Save and copy the Price ID (price_...)

5. Set up webhook (for subscription events):
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the Webhook signing secret

### 4. Configure Environment Variables

Create a `.env` file in the root directory (or run `npm run setup`):

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-random-secret-key"
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Deploy to Production (Vercel - Free)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Post-Deploy Steps

1. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
2. Update Stripe webhook endpoint to your production URL
3. Switch from Stripe test keys to live keys when ready

---

## Marketing Your Platform

### Launch Checklist

1. **Product Hunt:**
   - Create a maker profile
   - Prepare screenshots and demo video
   - Launch on a Tuesday-Thursday for best visibility

2. **Social Media:**
   - Share on Twitter/X with #buildinpublic
   - Post on LinkedIn
   - Share in relevant Facebook groups

3. **Communities:**
   - Reddit: r/SideProject, r/startups, r/Entrepreneur
   - Indie Hackers
   - Hacker News (Show HN)

4. **SEO:**
   - Write blog posts about AI writing
   - Target keywords like "AI blog writer", "AI email generator"

### Pricing Strategy

- **Free Tier:** 5 generations/month (converts users)
- **Pro Tier:** $9.99/month (100 users = $999/month goal)
- Consider annual plans: $99/year (save $20)

---

## Costs Breakdown

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|------------------------|
| Vercel | Free | $0 |
| Neon (DB) | Free (3GB) | $0 |
| OpenAI | Pay-as-you-go | ~$5-20 |
| Stripe | 2.9% + $0.30/transaction | ~$30 at $1000 revenue |

**Total overhead at $1000 revenue:** ~$35-55/month
**Net profit:** ~$945-965/month

---

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with HTTP-only cookies
- **Payments:** Stripe Subscriptions
- **AI:** OpenAI GPT-4o-mini

---

## Customization

### Change Pricing

Edit the price in Stripe Dashboard and update the Price ID in `.env`

### Add New Tools

1. Add tool config in `lib/openai.js`
2. Add tool card in `app/(dashboard)/dashboard/page.js`
3. The tool page automatically works via dynamic routing

### Customize Branding

- Update app name in `next.config.js`
- Modify colors in `tailwind.config.js`
- Update logo in `components/Navbar.js`

---

## Support

If you encounter issues:

1. Check that all environment variables are set correctly
2. Ensure your database is accessible
3. Verify your OpenAI API key has credits
4. Check Stripe webhook is configured properly

---

## License

MIT License - Feel free to use this for your own business!

---

**Ready to make $1000/month?** Run `npm run setup` and launch your AI writing platform today!
