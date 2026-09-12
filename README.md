# SaaS Subscription Platform

A modern, frontend-focused SaaS subscription management and billing simulation platform built for internship demonstration. The platform simulates complete customer subscription lifecycles, real-time quota tracking, simulated payment checkouts, and comprehensive administrative billing telemetry—all running locally in the browser with `localStorage` persistence and zero external API dependencies.

---

## 🚀 Key Features

### 👤 Customer (User) Features
- **Plan Discovery & Selection**: Explore **Free**, **Pro ($9/mo)**, and **Business ($29/mo)** tiers with clear feature matrices and quota comparisons.
- **Mock Payment Simulation**: Full sandbox checkout modal with simulated card inputs, processing spinner, success animations, invoice generation, and real-time dashboard updates.
- **Subscription Lifecycle Management**: One-click plan upgrade, downgrade, cancellation with period-end grace, and instant reactivation.
- **Resource Quota Tracking**: Visual progress indicators for active projects, cloud storage, and team member seats with automatic 80%+ threshold warning badges.
- **Interactive Usage Simulator**: An evaluator tool allowing instant adjustment of projects, storage (GB), and team members to test limit alerts and progress bar reactivity.
- **Billing History & Receipts**: Chronological invoice ledger with printable/downloadable simulated PDF receipts.
- **Account Settings**: Profile customization, company workspace updates, and usage metric resets.

### 🛡️ Administrative (Admin) Features
- **Revenue Telemetry Dashboard**: Real-time Monthly Recurring Revenue (MRR), total collected revenue, total users, and active subscriptions.
- **Visual Analytics**: Interactive Recharts donut chart for subscriber distribution across tiers and revenue trajectory bar graphs.
- **Multi-Tenant User Management**: Provision new accounts, switch roles (`user` vs `admin`), edit tenant details, and delete accounts.
- **Dynamic Plan Builder**: Create, edit, and adjust plan pricing, quota limits, and feature lists. Changes immediately reflect across the customer experience.
- **Subscription Override Engine**: Inspect all active subscriptions, manually cancel delinquent accounts, or change subscriber plans as an administrator.

---

## 👥 Demo Test Accounts

The platform includes pre-configured personas for testing both roles:

| Role | Name | Email | Password | Pre-Assigned Plan |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Alex Turner | `alex.turner@example.com` | `password123` | **Pro ($9/mo)** |
| **Administrator** | Sarah Jenkins | `admin@saasplatform.com` | `admin123` | **Admin Access** |

> **Quick Switch:** You can also use the **Quick Test Switch** bar at the very top of the application to toggle between Alex and Sarah in a single click.

---

## 📁 Architecture & Project Structure

```text
/src
├── components/
│   ├── checkout/
│   │   └── CheckoutModal.tsx       # Simulated payment sandbox modal with card details
│   ├── common/
│   │   ├── Navbar.tsx              # Responsive top navigation with quick persona switch
│   │   ├── Footer.tsx              # Application footer with reset demo data trigger
│   │   ├── Modal.tsx               # Accessible dialog modal (ESC key & backdrop support)
│   │   ├── ProgressBar.tsx         # Responsive progress bar with threshold color warning
│   │   ├── StatCard.tsx            # KPI card with trends and status badges
│   │   └── StatusBadge.tsx         # Color-coded indicators (Active, Canceled, Paid, etc.)
│   ├── layout/
│   │   ├── UserLayout.tsx          # Sidebar layout for Customer dashboard & billing
│   │   └── AdminLayout.tsx         # Dark-themed command layout for Administrative console
│   └── usage/
│       └── UsageSimulatorModal.tsx # Interactive tool to adjust metrics and test quotas
├── context/
│   ├── AuthContext.tsx             # User session, registration, login, and user management
│   └── SubscriptionContext.tsx     # Plan state, checkout flow, invoices, and localStorage sync
├── data/
│   └── mockData.ts                 # Realistic SaaS seed data (users, plans, invoices, usages)
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx         # Modern SaaS homepage with plan previews & feature bento
│   │   ├── PricingPage.tsx         # Full pricing comparison matrix and checkout triggers
│   │   ├── LoginPage.tsx           # Authentication page with 1-click test credentials
│   │   └── RegisterPage.tsx        # Self-serve signup initializing the Free plan tier
│   ├── user/
│   │   ├── UserDashboard.tsx       # Core customer overview (KPIs, quota bars, Recharts chart)
│   │   ├── SubscriptionManagement.tsx # Upgrade, downgrade, cancel, and reactivate plans
│   │   ├── BillingHistory.tsx      # Invoice table with printable simulated tax receipts
│   │   └── AccountProfile.tsx      # Personal information and usage metric reset
│   └── admin/
│       ├── AdminDashboard.tsx      # Executive telemetry, MRR KPIs, and distribution charts
│       ├── UserManagement.tsx      # Customer directory with CRUD capabilities
│       ├── PlanManagement.tsx      # Tier builder to add or edit pricing & resource limits
│       └── SubscriptionManagement.tsx # Administrative override for customer subscriptions
├── types/
│   └── index.ts                    # TypeScript data models (User, Plan, Subscription, Transaction)
├── App.tsx                         # React Router configuration & Provider composition
├── main.tsx                        # Application entry point
└── index.css                       # Tailwind CSS stylesheet
```

---

## 💳 Mock Payment & Subscription Flow

1. **Selection**: User clicks **"Select Plan"** on the Pricing page or Subscription Management.
2. **Checkout Modal**: A modal displays the plan tier, price, billing cycle, and pre-filled sandbox payment details.
3. **Confirmation**: Clicking **"Confirm Payment"** triggers a realistic simulated latency (1.2 seconds) with a processing spinner.
4. **State Transition**:
   - A unique invoice is created (e.g., `INV-2026-XXXX`).
   - Subscription is updated to `active` with a next billing date 30 days ahead.
   - Transaction is prepended to the customer's billing history.
   - Resource quotas adapt to the new plan's limits.
   - The updated state is persisted in the browser's `localStorage`.

---

## 🛠️ Tech Stack

- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **React Router** (`react-router-dom`)
- **Recharts** (Interactive telemetry and subscription distribution charts)
- **Lucide React** (Clean vector icon system)
- **LocalStorage API** (Persistent client-side mock database)

---

## 🧪 Resetting Demo Data

To return the application to its clean initial demonstration state at any time, click **"Reset Mock Data"** in the website footer.

---

## 🗒️ Author

Manish Kapil 

Full Stack Web Developer 

Intern ID - CITS2551