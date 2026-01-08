# WriteFlow AI - Quick Start Guide

## You're 5 Minutes Away From Your Own AI Business!

### What You Need (All Free to Start)

1. **Database** - Get a free PostgreSQL at [neon.tech](https://neon.tech)
2. **AI** - Get an OpenAI key at [platform.openai.com](https://platform.openai.com) (~$5 to start)
3. **Payments** - Get Stripe keys at [stripe.com](https://stripe.com)

---

## Step-by-Step Setup

### Step 1: Open Terminal

Navigate to the project folder:
```bash
cd ai-writing-platform
```

### Step 2: Run One-Click Setup

**On Mac/Linux:**
```bash
chmod +x scripts/launch.sh
./scripts/launch.sh
```

**On Windows:**
```bash
npm install
npm run setup
npx prisma db push
npm run dev
```

### Step 3: Follow the Setup Wizard

The wizard will ask for:

1. **Database URL** - Copy from Neon dashboard
2. **OpenAI API Key** - Copy from OpenAI dashboard
3. **Stripe Keys** - Copy from Stripe dashboard
4. **Stripe Price ID** - Create a $9.99/month product in Stripe

### Step 4: Open Your Browser

Go to **http://localhost:3000** - Your platform is live!

---

## Creating Your First $9.99/Month Subscription Product

1. Go to [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Click **"Add Product"**
3. Fill in:
   - Name: `WriteFlow Pro`
   - Description: `Unlimited AI writing generations`
4. Click **"Add pricing"**:
   - Price: `$9.99`
   - Billing period: `Monthly`
5. Click **"Save product"**
6. Copy the **Price ID** (starts with `price_`)
7. Paste it during setup

---

## Testing Your Platform

1. **Register** - Create a test account
2. **Try Free Tier** - Generate 5 pieces of content
3. **Test Upgrade** - Click upgrade and use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

---

## Deploy to Production (Vercel - Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect your GitHub repo
5. Add environment variables from `.env`
6. Click "Deploy"

Your live URL will be: `https://your-app.vercel.app`

---

## Revenue Goal: $1000/Month

| Users | Monthly Revenue |
|-------|-----------------|
| 25    | $250            |
| 50    | $500            |
| 100   | $1,000          |
| 200   | $2,000          |

Get 100 paying users at $9.99/month = **$999/month**!

---

## Marketing Tips

1. **Launch on Product Hunt** - Get initial users
2. **Post on Twitter/X** - Share your journey with #buildinpublic
3. **Reddit** - Share on r/SideProject, r/Entrepreneur
4. **SEO** - Target "AI blog writer", "AI email writer" keywords

---

## Need Help?

1. Check that all environment variables are correct
2. Make sure your database is accessible
3. Verify your OpenAI API has credits
4. Confirm Stripe webhook is set up for production

---

**That's it!** You now have a fully functional AI SaaS business.

Run `npm run dev` and start building your income stream!
