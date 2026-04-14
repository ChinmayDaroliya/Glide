# Glide - Instagram Automation Platform

![Glide Logo](https://via.placeholder.com/150x50/000000/FFFFFF?text=GLIDE)

**Transform Your Instagram Engagement with Intelligent Automation**

Glide is a powerful Instagram automation platform that helps content creators, businesses, and influencers boost their engagement through intelligent comment responses and direct messaging automation.

## [**Live Demo**](http://glide-sandy.vercel.app/) | [**Documentation**](#documentation)

---

## **Features**

### **Instagram Integration**
- **OAuth Authentication**: Secure Instagram Business Account connection
- **Webhook Processing**: Real-time comment and message handling
- **Automated Responses**: Smart replies based on keyword triggers
- **Direct Messaging**: Send personalized DMs to users who engage

### **Automation Engine**
- **Keyword Triggers**: Set up custom keywords to activate automations
- **Smart AI Responses**: Powered by OpenAI GPT-4 for intelligent replies
- **Custom Prompts**: Define your own message templates
- **Multi-Post Support**: Apply automations across multiple Instagram posts

### **Analytics & Dashboard**
- **Real-time Metrics**: Track engagement and automation performance
- **Activity Charts**: Visual representation of automated interactions
- **Response Tracking**: Monitor successful automations and engagement
- **User Insights**: Understand your audience better

### **Subscription Management**
- **Free Plan**: Basic automation features
- **Pro Plan ($99/month)**: Advanced AI-powered features
- **Stripe Integration**: Secure payment processing
- **Plan Management**: Easy upgrade/downgrade options

---

## **Screenshots**

### **Landing Page**
![Landing Page](https://via.placeholder.com/800x400/1e293b/ffffff?text=Glide+Landing+Page)
*Modern gradient design with clear value proposition and pricing*

### **Dashboard**
![Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=Analytics+Dashboard)
*Comprehensive analytics with metrics charts and activity tracking*

### **Automation Page**
![Automation Page](https://via.placeholder.com/800x400/1e293b/ffffff?text=Automation+Management)
*Create and manage Instagram automation workflows*

### **Integration Page**
![Integration Page](https://via.placeholder.com/800x400/1e293b/ffffff?text=Instagram+Integration)
*Connect and manage your Instagram Business Account*

### **Settings Page**
![Settings Page](https://via.placeholder.com/800x400/1e293b/ffffff?text=Settings+Billing)
*Account settings and subscription management*

### **Payment Page**
![Payment Page](https://via.placeholder.com/800x400/1e293b/ffffff?text=Stripe+Payment)
*Secure Stripe checkout for subscription upgrades*

---

## **Tech Stack**

### **Frontend**
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **TanStack Query** - Data fetching and caching

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **Clerk Authentication** - User management
- **OpenAI API** - AI-powered responses

### **Infrastructure**
- **Vercel** - Deployment and hosting
- **Stripe** - Payment processing
- **Facebook Graph API** - Instagram integration

---

## **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Instagram Business Account
- Facebook Developer App
- OpenAI API key (for AI features)
- Stripe account (for payments)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/ChinmayDaroliya/Glide.git
cd Glide
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/glide"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL="/dashboard"

# Instagram Integration
INSTAGRAM_CLIENT_ID="your_instagram_client_id"
INSTAGRAM_CLIENT_SECRET="your_instagram_client_secret"
INSTAGRAM_TOKEN_URL="https://api.instagram.com/oauth/access_token"
INSTAGRAM_BASE_URL="https://graph.instagram.com"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/callback/instagram"
NEXT_PUBLIC_HOST_URL="http://localhost:3000"
INSTAGRAM_OAUTH_SCOPE="user_profile,user_media"
INSTAGRAM_OAUTH_STATE_SECRET="your_oauth_state_secret"

# OpenAI
OPENAI_API_KEY="your_openai_api_key"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_CLIENT_SECRET="your_stripe_client_secret"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_SUBSCRIPTION_PRICE_ID="price_your_subscription_price_id"
```

5. **Database Setup**
```bash
npx prisma generate
npx prisma db push
```

6. **Start development server**
```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000)**

---

## **Project Structure**

```
glide/
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Project dependencies and scripts
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── prisma.config.ts           # Prisma configuration
├── public/                        # Static assets
│   ├── favicon.ico                # Favicon
│   └── next.svg                  # Next.js logo
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (website)/             # Public landing page
│   │   │   └── page.tsx           # Landing page with pricing
│   │   ├── (protected)/           # Authenticated user area
│   │   │   ├── dashboard/          # Dashboard pages
│   │   │   │   ├── page.tsx       # Main dashboard redirect
│   │   │   │   ├── [slug]/        # Dynamic user dashboard
│   │   │   │   │   ├── page.tsx   # User dashboard
│   │   │   │   │   ├── automations/
│   │   │   │   │   │   ├── page.tsx   # Automation management
│   │   │   │   │   │   └── _components/
│   │   │   │   │   │       ├── create-automation.tsx
│   │   │   │   │   │       └── integration-card.tsx
│   │   │   │   │   ├── integrations/
│   │   │   │   │   │   ├── page.tsx   # Instagram integration
│   │   │   │   │   │   └── _components/
│   │   │   │   │   │       └── integration-card.tsx
│   │   │   │   │   └── settings/
│   │   │   │   │       └── page.tsx   # Billing settings
│   │   │   │   ├── layout.tsx      # Dashboard layout
│   │   │   │   └── loading.tsx    # Loading state
│   │   │   ├── payment/           # Payment handling
│   │   │   │   └── page.tsx       # Stripe payment callback
│   │   │   ├── api/               # API endpoints
│   │   │   │   ├── webhook/
│   │   │   │   │   └── instagram/
│   │   │   │   │       └── route.ts   # Instagram webhook handler
│   │   │   │   └── webhook/       # Stripe webhook
│   │   │   │       └── stripe/
│   │   │   │           └── route.ts   # Stripe webhook handler
│   │   │   └── callback/         # OAuth callbacks
│   │   │       └── instagram/
│   │   │           └── route.ts   # Instagram OAuth callback
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/                # React components
│   │   ├── global/               # Reusable components
│   │   │   ├── activate-automation-button/
│   │   │   ├── automation-list/
│   │   │   ├── automations/
│   │   │   │   ├── trigger/
│   │   │   │   ├── listener/
│   │   │   │   ├── keyword/
│   │   │   │   ├── post/
│   │   │   │   ├── create-automation.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── smart-ai.tsx
│   │   │   ├── billing/
│   │   │   │   ├── index.tsx
│   │   │   │   └── paymentCard.tsx
│   │   │   ├── create-automation/
│   │   │   ├── double-gradient-card/
│   │   │   ├── gradient-button/
│   │   │   ├── loader/
│   │   │   ├── navbar/
│   │   │   ├── notifications/
│   │   │   ├── payment-button/
│   │   │   ├── popover/
│   │   │   ├── search/
│   │   │   ├── sheet/
│   │   │   ├── sidebar/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── items.tsx
│   │   │   │   └── upgrade.tsx
│   │   │   ├── subscription-plan/
│   │   │   └── bread-crumbs/
│   │   │       ├── index.tsx
│   │   │       └── separator.tsx
│   │   └── ui/                 # Base UI components (shadcn/ui)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── combobox.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── empty.tsx
│   │       ├── field.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-group.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── item.tsx
│   │       ├── kbd.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── native-select.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── spinner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   ├── actions/                  # Server actions
│   │   ├── automations/
│   │   │   ├── index.tsx
│   │   │   └── queries.ts
│   │   ├── integrations/
│   │   │   ├── index.ts
│   │   │   └── query.ts
│   │   ├── user/
│   │   │   ├── index.ts
│   │   │   └── queries.ts
│   │   └── webhook/
│   │       └── queries.ts
│   ├── constants/                # Application constants
│   │   ├── dashboard.ts
│   │   ├── integrations.ts
│   │   └── index.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── user-queries.ts
│   │   ├── user-nav.ts
│   │   └── index.ts
│   ├── icons/                   # Icon components
│   │   ├── index.ts
│   │   └── [75 icon files]
│   ├── lib/                     # Utilities and configurations
│   │   ├── fetch.ts              # API functions
│   │   ├── openai.ts             # OpenAI configuration
│   │   ├── prisma-payloads.ts    # Prisma type definitions
│   │   ├── prisma.ts             # Prisma client
│   │   ├── stripe.ts             # Stripe configuration
│   │   └── utils.ts              # Utility functions
│   ├── providers/               # React providers
│   │   ├── clerk-provider.tsx
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── react-query/             # React Query configuration
│   │   └── client.ts
│   ├── redux/                  # Redux store
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── svgs/                   # SVG components
│   │   └── logo-small.tsx
│   └── types/                  # TypeScript definitions
│       └── index.ts
├── middleware.ts                 # Next.js middleware (Clerk)
└── node_modules/                 # Dependencies
```

---

## **API Documentation**

### **Instagram Webhook**
```typescript
POST /api/webhook/instagram
```
Handles incoming Instagram comment and message events.

### **OAuth Callback**
```typescript
GET /callback/instagram
```
Processes Instagram OAuth authentication.

### **Payment Webhook**
```typescript
POST /api/webhook/stripe
```
Handles Stripe payment events.

---

## **Database Schema**

### **Core Models**
- **User**: User accounts and authentication
- **Automation**: Automation workflows
- **Integrations**: Instagram account connections
- **Subscription**: User subscription plans
- **Keyword**: Trigger keywords for automations
- **Listener**: Response configurations
- **Post**: Instagram posts associated with automations

---

## **Deployment**

### **Vercel Deployment**

1. **Connect to Vercel**
```bash
npx vercel
```

2. **Configure Environment Variables**
   - Add all environment variables to Vercel dashboard
   - Ensure webhook URLs are updated for production

3. **Database Setup**
   - Use Vercel Postgres or external PostgreSQL
   - Run database migrations

4. **Deploy**
```bash
npm run build
npx vercel --prod
```

---

## **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk authentication | Yes |
| `CLERK_SECRET_KEY` | Clerk authentication | Yes |
| `INSTAGRAM_CLIENT_ID` | Instagram OAuth | Yes |
| `INSTAGRAM_CLIENT_SECRET` | Instagram OAuth | Yes |
| `OPENAI_API_KEY` | AI responses | Optional |
| `STRIPE_SECRET_KEY` | Payment processing | Yes |

---

## **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## **Support**

- **Email**: chinmaydaroliya@gmail.com
- **Issues**: [GitHub Issues](https://github.com/ChinmayDaroliya/glide/issues)
- **Live Demo**: [glide-sandy.vercel.app](http://glide-sandy.vercel.app/)

---

## **Roadmap**

- [ ] **Multi-Platform Support**: Facebook, Twitter, LinkedIn
- [ ] **Advanced Analytics**: Deeper insights and reporting
- [ ] **Team Collaboration**: Multiple user accounts
- [ ] **Custom Templates**: Pre-built automation templates
- [ ] **Mobile App**: iOS and Android applications

---

**Built with Next.js, TypeScript, and Tailwind CSS**  
**© 2026 Glide. All rights reserved.**
