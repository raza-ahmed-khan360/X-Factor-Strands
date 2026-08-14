<p align="center">
  <img src="public/logo.png" alt="X-Factor Peptides Logo" width="240" />
</p>

<h1 align="center">X-Factor Peptides</h1>

<p align="center">
  <b>High-Purity Laboratory Research Peptides E-Commerce Platform & Order Management System</b>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database_%26_Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
</p>

---

## ⚡ Overview

**X-Factor Peptides** is an enterprise-grade e-commerce web platform engineered for ordering, analyzing, and managing high-purity research compounds. Built with **Next.js 16 App Router**, **React 19**, **TailwindCSS**, and **Supabase**, it features **Direct P2P Advance Payments** (Cash App, Venmo, Zelle), **Payment Screenshot Proof Verification**, an interactive **Admin Management Portal**, **Hostinger Transactional Email Dispatch**, and a dedicated **Security Sanitization Engine**.

---

## ✨ Key Features & Capabilities

| Feature | Description |
| :--- | :--- |
| **📱 Direct P2P Payments** | Advance online checkout via **Cash App** (`$BrianTrimmer1`), **Venmo** (`@Brian-Trimmer-3`), and **Zelle** (`484-903-2964`) with 1-click deep payment links. |
| **📷 Payment Proof Upload** | Dedicated confirmation workflow where customers upload receipt screenshots with **mandatory Transaction / Reference ID** validation. |
| **🔒 Admin Verification Portal** | Full control dashboard (`/x-factor-admin/orders`) with full-screen receipt screenshot inspection, order status updates, and automated customer email alerts. |
| **🛡️ SQL Injection & XSS Defense** | Built-in security engine (`src/lib/security.ts`) sanitizing all forms, inputs, and SMTP headers to protect against SQLi, XSS, and injection attacks. |
| **🔔 MUI-Style Cart Alerts** | Floating top-right notification on Add to Cart with Space Grotesk typography, cyan glow accents, and direct checkout shortcuts. |
| **🧱 Animated Wave Skeletons** | Smooth wave shimmer skeleton cards on the shop catalog during product data fetching. |
| **🔬 Research Compliance Gate** | Mandatory laboratory certification disclaimer and compliant scientific categorization across the platform. |
| **📧 Hostinger SMTP Email Engine** | Automated order receipts, status update notifications, admin order alerts, contact submissions, and newsletter welcome emails. |
| **📜 Verified COA Vault** | Downloadable Certificate of Analysis (COA) PDF documents verified for HPLC ≥99% purity. |

---

## 📁 Repository Structure

```text
x-factor/
├── public/                          # Static Assets & Media
│   ├── logo.png                     # Official Brand Logo
│   ├── docs/                        # Laboratory COA PDF Certificates
│   └── new-products/                # Product Images & Assets
├── src/
│   ├── app/                         # Next.js 16 App Router
│   │   ├── page.tsx                 # Brand Homepage & Featured Compounds
│   │   ├── layout.tsx               # Root Layout with Research Gate & Toaster
│   │   ├── globals.css              # Theme Variables & Shimmer Keyframes
│   │   ├── shop/                    # Products Catalog with Skeleton Loader
│   │   ├── products/[id]/           # Dynamic Product Detail & Specs View
│   │   ├── checkout/                # P2P Payment Checkout (Cash App, Venmo, Zelle)
│   │   ├── order-confirmation/      # Thank You & Screenshot Proof Upload
│   │   ├── COAS/                    # Laboratory Lab Certificates Hub
│   │   ├── about/                   # About X-Factor Peptides
│   │   ├── contact/                 # Contact Support Form
│   │   ├── api/                     # REST API Endpoints
│   │   │   ├── admin/               # Login, Check-Auth, and Logout Handlers
│   │   │   ├── newsletter/          # Newsletter Subscription Endpoint
│   │   │   └── orders/upload-proof/ # Payment Screenshot Upload API
│   │   └── x-factor-admin/          # Secure Admin Control Panel
│   │       ├── login/               # Master Password Portal
│   │       ├── orders/              # Orders Management & Screenshot Verification
│   │       └── products/            # Product Catalog Management
│   ├── components/                  # Reusable Components
│   │   ├── products/                # Product Cards & Skeleton Loaders
│   │   ├── shared/                  # Header, Footer, Research Gate & Search
│   │   └── ui/                      # Cart Alert, Buttons, Dialogs, Inputs
│   ├── lib/                         # Core Utilities
│   │   ├── paymentConfig.ts         # Payment Handles & Direct Link Generators
│   │   ├── security.ts              # SQL Injection, XSS & Email Sanitizer
│   │   ├── email.ts                 # Hostinger SMTP Transactional Emailer
│   │   ├── api.ts                   # Supabase Data Layer
│   │   └── supabase.ts              # Supabase Client
│   ├── store/                       # Zustand Persistent Cart Store
│   └── proxy.ts                     # Next.js Edge Middleware Route Protection
├── .env.local                       # Environment Variables & Secrets
├── package.json                     # Dependencies & Scripts
└── tsconfig.json                    # TypeScript Configuration
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory and configure the following credentials:

```env
# Supabase Database & Storage Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin Dashboard Master Password
ADMIN_PASSWORD=YourMasterPasswordHere

# Hostinger SMTP Credentials (For Transactional & Alert Emails)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@xfactorpeps.com
SMTP_PASSWORD=your-hostinger-smtp-app-password
```

---

## 🚀 Local Quickstart

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/raza-ahmed-khan360/X-Factor-Strands.git
cd X-Factor-Strands
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Validate for Production
```bash
npm run build
npm run start
```

---

## 🔑 Admin Portal Access

- **URL**: `/x-factor-admin/login` (or `/x-factor-admin/orders`)
- **Master Password**: Set via `ADMIN_PASSWORD` in `.env.local`

---

## 🔒 Compliance & Legal Notice

**All compounds and peptides distributed by X-Factor Peptides are strictly for laboratory research, scientific evaluation, and in-vitro analytical testing. They are NOT for human consumption, animal administration, or therapeutic use.**

Copyright © 2026 X-Factor Peptides. All Rights Reserved.
