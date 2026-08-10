<p align="center">
  <img src="public/logo.png" alt="X-Factor Peptides Logo" width="240" />
</p>

<h1 align="center">X-Factor Peptides</h1>

<p align="center">
  <b>Modern E-Commerce Research Platform & Product Management System</b>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Proprietary_%26_Confidential-red?style=for-the-badge" alt="Proprietary License" /></a>
</p>

---

## ⚡ Overview

**X-Factor Peptides** is a state-of-the-art e-commerce web platform engineered for browsing, analyzing, and ordering high-purity research compounds. Built from the ground up with **Next.js 16 App Router**, **React 19**, and **Supabase**, it delivers high-performance client rendering, dynamic SEO metadata, and a secure server-side admin management system.

---

## ✨ Highlights & Features

| Feature | Description |
| :--- | :--- |
| **🎨 Dark Glassmorphism UI** | Modern aesthetics with custom gradient glow accents, fluid animations, and mobile-responsive layout. |
| **📦 Dynamic Products Shop** | Real-time catalog with multi-category filters, search query indexing, and price sliders. |
| **📜 Lab Certificates (COAs)** | Interactive preview and download vault for 25+ verified laboratory Certificate of Analysis PDF documents. |
| **🛒 Persistent Shopping Cart** | Rapid client-side state management powered by Zustand with persistent local storage. |
| **🔒 Admin Control Portal** | Full administrative panel (`/x-factor-admin`) featuring protected Server Actions (`'use server'`) to add, update, and manage products and variants. |
| **🛡️ Supabase RLS Integration** | Server-side database actions utilizing Supabase Service Role Keys to bypass RLS safely for authenticated admin mutations. |
| **🚀 Vercel Production Ready** | Native serverless architecture configured for automatic builds and edge distribution on Vercel. |

---

## 📁 Repository Architecture

```text
x-factor/
├── public/                          # Static Assets
│   ├── logo.png                     # Official Brand Logo
│   ├── docs/                        # Laboratory COA PDF Certificates (25 files)
│   └── new-products/                # Product Images & Assets
├── src/
│   ├── app/                         # Next.js 16 App Router Directory
│   │   ├── page.tsx                 # Brand Homepage
│   │   ├── layout.tsx               # Root App Layout & Typography
│   │   ├── not-found.tsx            # Custom Branded 404 Page
│   │   ├── shop/                    # Products Catalog Page
│   │   ├── products/[id]/           # Dynamic Product Detail & SEO Metadata Generator
│   │   ├── COAS/                    # Laboratory Lab Certificates Page
│   │   ├── about/                   # About Us Page
│   │   ├── contact/                 # Contact Page
│   │   ├── faq/                     # Frequently Asked Questions Page
│   │   ├── checkout/                # Shopping Cart & Checkout Page
│   │   └── x-factor-admin/          # Secure Admin Management Portal
│   │       ├── login/               # Admin Login Interface
│   │       ├── actions.ts           # Admin Authentication Server Action
│   │       └── products/            # Admin Products & Variants CRUD Dashboard
│   ├── components/                  # UI Components & Modules
│   │   ├── products/                # Product Cards & Data Structures
│   │   ├── shared/                  # Navigation Header, Footer & Search Modal
│   │   └── ui/                      # Base UI Elements
│   ├── lib/                         # Core Utility Functions & Data API
│   │   ├── api.ts                   # Supabase Query Layer with Fallbacks
│   │   └── supabase.ts              # Supabase Client Initialization
│   └── store/                       # Client Store (Zustand Cart Manager)
├── next.config.js                   # Next.js Config (Vercel Optimized)
├── .env.local                       # Local Secrets & API Keys
└── tsconfig.json                    # TypeScript Compiler Rules
```

---

## 🔐 Environment Variables

Before running the application, configure your `.env.local` file in the project root:

```env
# Supabase Backend Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin Authentication Secret
ADMIN_PASSWORD=YourSecureAdminPassword
```

> 💡 **Vercel Deployment**: When deploying on Vercel, copy these environment variables into **Vercel Dashboard ➔ Project Settings ➔ Environment Variables**.

---

## 🚀 Local Quickstart

### 1. Clone & Install
```bash
git clone <your-repository-url>
cd x-factor
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Test
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

1. Push your code to your **GitHub / GitLab** repository.
2. Connect your repository to **Vercel**.
3. Set Framework Preset to **Next.js**.
4. Add your `.env.local` keys under **Environment Variables**.
5. Click **Deploy**!

---

## 🔒 License & Confidentiality Terms

**Copyright (c) 2026 X-Factor Peptides. All Rights Reserved.**

This repository and codebase contain proprietary and confidential software. Unauthorized copying, cloning, distribution, modification, reproduction, practice, educational usage, or personal testing of this codebase (in whole or in part) via any medium is **strictly prohibited**. 

For full legal terms, refer to the [LICENSE](LICENSE) file.

---

<p align="center">
  <sub><b>Compliance Notice:</b> All compounds listed are intended strictly for laboratory and scientific in-vitro research use only.</sub>
</p>
