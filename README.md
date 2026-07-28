<div align="center">

# 🍽️ Plateful

### Multi-Tenant SaaS Restaurant Operations & Visual Ordering Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)](#)

**Plateful** is a full-stack, multi-tenant SaaS platform powering end-to-end restaurant operations — from customer QR-scan ordering and table-side dining to manager dashboards, captain workflows, and platform-wide superadmin controls.

</div>

---

## ✨ Key Highlights

- 🔐 **4-Role Access Control** — Superadmin, Manager, Captain, Customer — each with dedicated dashboards
- 💳 **SaaS Subscription Gating** — Tiered plans (Basic / Premium / Enterprise) with feature locks
- 📱 **Fully Responsive** — Desktop sidebar + mobile bottom nav + drawer navigation
- 🎨 **Premium Design System** — Warm terracotta theme, glassmorphism, Framer Motion animations
- ♿ **Accessible** — Global focus-visible keyboard navigation rings
- 🧩 **Centralized Navigation** — Single-source navigation.ts config drives all nav surfaces
- 📊 **Analytics & Charts** — Built-in Recharts dashboards for revenue, orders, and operations

---

## 🏗️ Architecture Overview

```
plateful/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication flow
│   │   └── login/              # Login page
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── superadmin/         # Platform-wide admin console
│   │   ├── manager/            # Restaurant manager dashboard
│   │   ├── captain/            # Floor captain workspace
│   │   └── customer/           # Customer-facing experience
│   ├── (public)/               # Public-facing pages
│   │   ├── explore/            # Restaurant discovery
│   │   └── menu/               # Public menu viewer
│   ├── globals.css             # Global styles & design tokens
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/                 # Shell, sidebar, top bar, bottom nav
│   ├── shared/                 # RoleGuard, SaaS upgrade gate
│   └── ui/                     # Badge, Button, Card, Modal, Toast, etc.
├── features/
│   ├── auth/                   # Login/logout components
│   ├── feed/                   # Social feed, stories, posts
│   └── review/                 # Rating & review components
├── lib/
│   ├── AppContext.tsx           # Global state provider (Context API)
│   ├── navigation.ts           # Centralized nav config for all roles
│   ├── types/                  # TypeScript interfaces & types
│   ├── hooks/                  # Custom React hooks
│   ├── indexedDb.ts            # Client-side persistence layer
│   ├── animations.ts           # Framer Motion animation presets
│   ├── sanitize.ts             # Input sanitization utilities
│   └── tableStateMachine.ts    # Table status FSM
└── data/                       # Mock data & seed fixtures
```

---

## 👥 Role-Based Dashboards

### 🛡️ SaaS Superadmin

Full platform oversight for managing all tenants and users.

| Page | Route | Description |
|:-----|:------|:------------|
| **Dashboard** | `/superadmin` | Platform analytics — active tenants, revenue, user metrics |
| **Tenant Registry** | `/superadmin/tenants` | Manage restaurant subscriptions, plans, and billing status |
| **Owner Provisioning** | `/superadmin/owners` | Create/reset merchant owner credentials |
| **Customer Directory** | `/superadmin/customers` | Platform-wide user management with spam flagging |
| **Platform Config** | `/superadmin/config` | Global platform settings and feature toggles |
| **Account** | `/superadmin/account` | Admin profile management |

---

### 🏢 Restaurant Manager / Owner

Complete restaurant operations hub with subscription-gated features.

| Page | Route | Description |
|:-----|:------|:------------|
| **Dashboard** | `/manager` | Revenue charts, order trends, daily summary KPIs |
| **Menu Editor** | `/manager/menu` | CRUD menu items with photos, categories & pricing |
| **Table Grid** | `/manager/tables` | Visual table layout & real-time status tracking |
| **Orders** | `/manager/orders` | Active order pipeline with status management |
| **Billing** | `/manager/billing` | Invoice generation & payment history |
| **Expenses** | `/manager/expenses` | Operational cost tracking & raw material forecasting |
| **Social Campaigns** | `/manager/social` | Customer stories & promotional content *(Premium+)* |
| **Staff Roster** | `/manager/staff` | Employee management, roles & shift scheduling |
| **Customer Directory** | `/manager/customers` | VIP tagging, dining frequency & loyalty tracking |
| **Reviews Portal** | `/manager/reviews` | Detailed ratings breakdown & official reply templates |
| **User Accounts** | `/manager/users` | Staff user credential management |
| **Account** | `/manager/account` | Manager profile & restaurant settings |

---

### 🧑‍✈️ Captain / Floor Staff

Streamlined floor operations for table service and order processing.

| Page | Route | Description |
|:-----|:------|:------------|
| **Dashboard** | `/captain` | Active tables overview, pending actions |
| **Order Console** | `/captain/order` | Take & manage table orders in real-time |
| **Bookings Queue** | `/captain/bookings` | Incoming reservations & table allocation |
| **Settlements** | `/captain/settlement` | Bill splitting & payment processing |
| **Account** | `/captain/account` | Captain profile management |

---

### 🍽️ Customer

Full dining experience from discovery to ordering and social engagement.

| Page | Route | Description |
|:-----|:------|:------------|
| **Feed** | `/customer` | Social feed with restaurant stories & posts |
| **QR Scan** | `/customer/scan` | Scan table QR to begin ordering session |
| **Search** | `/customer/search` | Discover restaurants, cuisines & dishes |
| **Reels** | `/customer/reels` | Short-form video content from restaurants |
| **Restaurant Profile** | `/customer/restaurant/[id]` | Menu, stories, community feed & DMs |
| **Bookings** | `/customer/bookings` | Reserve tables & manage reservations |
| **Messages** | `/customer/messages` | Direct messaging with restaurant managers |
| **Notifications** | `/customer/notifications` | Order updates, reservation status & announcements |
| **Settings** | `/customer/settings` | Dietary filters, city, language preferences |
| **Account** | `/customer/account` | Profile, posts, reviews & visit history |

---

## 💳 SaaS Subscription Plans

Feature gating is enforced client-side via the SaaSUpgradeGate component. Locked pages display a premium upgrade overlay.

| Feature | Basic ₹1,999/mo | Premium ₹4,999/mo | Enterprise ₹9,999/mo |
|:--------|:---:|:---:|:---:|
| Table Grid & Status | ✅ | ✅ | ✅ |
| CRUD Menu Editor | ✅ | ✅ | ✅ |
| Order Alerts & Pipeline | ✅ | ✅ | ✅ |
| Payment Settlements | ✅ | ✅ | ✅ |
| Customer Stories | 🔒 | ✅ | ✅ |
| Discount Campaigns | 🔒 | ✅ | ✅ |
| Today's Special Module | 🔒 | ✅ | ✅ |
| Interactive Table Layout | 🔒 | ✅ | ✅ |
| Raw Material Forecasting | 🔒 | 🔒 | ✅ |
| Drawer Cash Audits | 🔒 | 🔒 | ✅ |

---

## 🧩 Component Library

### Layout Components

| Component | File | Purpose |
|:----------|:-----|:--------|
| DashboardShell | components/layout/DashboardShell.tsx | Main layout wrapper with sidebar + mobile drawer |
| Sidebar | components/layout/Sidebar.tsx | Desktop navigation sidebar |
| TopBar | components/layout/TopBar.tsx | Header with dynamic page titles & actions |
| BottomNav | components/layout/BottomNav.tsx | Mobile-only bottom navigation bar |

### UI Primitives

| Component | File | Purpose |
|:----------|:-----|:--------|
| Button | components/ui/Button.tsx | Primary, secondary, ghost button variants |
| Badge | components/ui/Badge.tsx | Status indicators with color coding |
| Card | components/ui/Card.tsx | Content container with elevation |
| Modal | components/ui/Modal.tsx | Overlay dialog with backdrop |
| Input | components/ui/Input.tsx | Styled form input |
| Toast | components/ui/Toast.tsx | Notification toasts with auto-dismiss |
| FileUpload | components/ui/FileUpload.tsx | Drag & drop file upload zone |
| StarRating | components/ui/StarRating.tsx | Interactive star rating input/display |

### Shared Guards

| Component | File | Purpose |
|:----------|:-----|:--------|
| RoleGuard | components/shared/RoleGuard.tsx | Route protection by user role |
| SaaSUpgradeGate | components/shared/SaaSUpgradeGate.tsx | Feature gating with upgrade prompt overlay |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| **Framework** | Next.js (App Router, Turbopack) | 16.2.10 |
| **UI Library** | React | 19.2.4 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Icons** | Lucide React | 1.24.x |
| **Charts** | Recharts | 3.9.x |
| **State** | React Context API + IndexedDB | — |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/kuldeepmaurya4296/plateful-store.git
cd plateful-store

# Install dependencies
npm install
```

### Database Setup & Seeding

```bash
# Copy env configuration
cp .env.example .env

# Seed MongoDB Atlas Database with initial data
npm run seed
```

### Development

```bash
# Start the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Verify TypeScript types without emitting
npx tsc --noEmit
```

---

## 🔑 Demo Credentials

| Role | Username | Password | Restaurant | Access Level |
|:-----|:---------|:---------|:-----------|:-------------|
| **Superadmin** | `admin.saas` | `Kuldeep@123` | Platform Master | Full platform control |
| **Owner** | `vikram.owner` | `Kuldeep@123` | Spice Route (Enterprise) | All features unlocked |
| **Manager** | `priya.manager` | `Kuldeep@123` | Spice Route (Enterprise) | Operations + analytics |
| **Captain** | `aman.captain` | `Kuldeep@123` | Spice Route (Enterprise) | Table & order console |
| **Customer** | `riya.eats` | `Kuldeep@123` | Diner Discovery | Feed, search, QR scanner & orders |

---

## 📁 Key Library Modules

| Module | Path | Description |
|:-------|:-----|:------------|
| AppContext | lib/AppContext.tsx | Global state provider — auth, restaurants, bills, bookings |
| navigation | lib/navigation.ts | Centralized role-based nav config consumed by all nav components |
| types | lib/types/index.ts | Shared TypeScript interfaces — Post, Story, Bill, Booking, Restaurant |
| hooks | lib/hooks/ | Custom hooks — useObjectUrl, usePersistedState |
| indexedDb | lib/indexedDb.ts | Client-side IndexedDB persistence layer |
| animations | lib/animations.ts | Shared Framer Motion animation presets |
| tableStateMachine | lib/tableStateMachine.ts | FSM for table status transitions (Free → Occupied → Billing) |
| sanitize | lib/sanitize.ts | Input sanitization against XSS |

---

## ♿ Accessibility

- **Keyboard Navigation** — All interactive elements have visible focus-visible outlines using the primary color
- **Semantic HTML** — Proper heading hierarchy, landmark regions, and ARIA labels
- **Responsive Design** — Fluid layouts with mobile-first breakpoints
- **Color Contrast** — Warm terracotta palette meets WCAG contrast ratios

---

## 📄 License

This project is private and proprietary.

---

<div align="center">
  <sub>Built with ❤️ using Next.js, React, and TypeScript</sub>
</div>

## Master Prompt for opus modal

Perform a complete, production-grade audit of the Plateful monolithic Next.js application at E:\sparsh\plateful, cross-referencing it against every requirements document located at E:\sparsh\ — including 

Plateful_Product_Features_Requirements by Kuldeep.docx
, 

Project_Explanation.docx
, 

Software Requirements Specification.docx
, 

plateful-prd.html
 (Product Requirements Document), 

plateful-full-srs.html
 (Full SRS), and 

restaurant_manager_console_mockup_v3.html
 (Manager Console Mockup) — and produce an exhaustive, role-categorized feature inventory with a gap analysis of everything required to elevate this application to a commercially shippable, production-ready monolithic SaaS product.

Step 1 — Read every reference document in E:\sparsh\: Parse all 6 specification files to extract the complete list of intended features, user flows, personas, database schemas, API endpoints, non-functional requirements, roadmap phases, monetization strategy, and risk items defined by the product owner.

Step 2 — Audit the current codebase at E:\sparsh\plateful\: Scan every Next.js App Router page, API route handler, React component, feature module, context provider, MongoDB model, seed script, middleware, and configuration file. Map each implemented feature to its specification in the reference documents.

Step 3 — Categorize all features by user role (Superadmin, Owner, Manager, Captain, Customer, Public Guest) with implementation status: ✅ Fully Working, ⚠️ Partial/Mock/Frontend-Only, or ❌ Missing/Not Started.

Step 4 — Produce a complete gap analysis listing every missing feature, page, API route, database operation, and UI flow from the PRD/SRS that is not yet implemented. Additionally, identify production-grade requirements not covered by the existing documents, including:

Full CRUD with server-side validation across all entities
NextAuth session lifecycle with token rotation, refresh, and middleware guards
Real-time order pipeline (placement → kitchen display → preparation → served → billed → reviewed)
Time-boxed verified review system (10-minute window post-payment)
QR code server-side generation and camera-based scanning
Payment integration (Razorpay/Stripe) with invoice generation
Cloud media storage (Cloudinary/S3) for menu photos, posts, and stories
Push notifications and in-app notification center
Search with MongoDB text indexing, filtering, sorting, and pagination
Analytics dashboards with real MongoDB aggregation pipelines
Multi-tenant SaaS subscription enforcement with server-side plan gating
Direct messaging between customers and restaurants
Customer loyalty, referral tracking, and visit history
SEO (meta tags, OG, sitemap, robots.txt), PWA manifest, and offline support
Error boundaries, loading states, and global error handling
Rate limiting, CORS, CSP headers, and security hardening
Accessibility (WCAG AA), internationalization (i18n)
Testing strategy (unit, integration, E2E) and CI/CD pipeline
Environment-based config for dev, staging, and production deployments
Step 5 — Output as a prioritized implementation roadmap organized by feature domain, with priority tiers:

P0 (Critical): Blocking issues, broken flows, security vulnerabilities
P1 (High): Core business features required before launch
P2 (Medium): Enhancement features for competitive parity
P3 (Nice-to-have): Polish, optimization, and delight features
Do NOT limit the scope — treat this as a full product audit against every requirement document and industry best practice. List every page, API endpoint, database collection, background job, third-party integration, and UI component that a production-grade monolithic SaaS restaurant platform requires.

This prompt references all 6 of your specification documents in E:\sparsh\ and will force a complete cross-reference between what's specified and what's actually built. Want me to execute this analysis now?

