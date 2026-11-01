# SahiVahan — Admin Command Center (`sahivahan-admin-portal`)

> **"Sahi Gaadi. Sahi Faisla."**  
> Central Operations, SLA Dispatch Radar, QA Audit, and Escrow Financial Settlement Command Center for the SahiVahan ecosystem.

### 🌐 Live Production URL
👉 **[https://sahivahan-adminportal.netlify.app/admin/dashboard](https://sahivahan-adminportal.netlify.app/admin/dashboard)**

> **Demo Access**: The login screen (`/admin/login`) provides 1-click role presets for Super Admin, Operations, Quality Reviewer, and Finance Controller to explore all features instantly without credentials.

---

## 🌐 Live Deployments & Ecosystem Links

| Application | Live Deployed URL | Target Users |
| :--- | :--- | :--- |
| **Admin Command Center** (Current) | **[sahivahan-adminportal.netlify.app/admin/dashboard](https://sahivahan-adminportal.netlify.app/admin/dashboard)** | Dispatchers, QA Auditors, Fleet Managers, Finance Controllers |
| **Customer Portal** | **[sahivahan.netlify.app](https://sahivahan.netlify.app/)** | Used Car & Bike Buyers across India |
| **Specialist Field App** | **[sahivahan-spl.netlify.app/specialist/dashboard](https://sahivahan-spl.netlify.app/specialist/dashboard)** | Certified Automotive Mechanics & Field Technicians |

---

## 📌 Overview

The **Admin Command Center** is the operational backbone of SahiVahan. Built for marketplace dispatchers, automotive quality reviewers, fleet managers, and finance controllers, it provides comprehensive real-time visibility and governance across all bookings, specialist allocations, technical inspection reports, customer disputes, pricing models, and financial disbursements.

---

## 👥 Role-Based Access Control (RBAC)

The portal implements strict role-based authorization with 4 distinct administrative profiles:

| Role | Primary Responsibilities | Permitted Modules |
| :--- | :--- | :--- |
| **Super Admin** | Platform-wide control, catalog configuration, pricing matrix, admin user provisioning | All Modules (Full Access) |
| **Operations** | Live dispatch radar, manual & automated specialist job allocation, booking lifecycle management, cancellation refunds | Dashboard, Bookings, Customers, Specialists, Audit |
| **Quality Reviewer** | Technical inspection report auditing, photo evidence inspection, automated QA flags, dispute adjudication, version bumps | Dashboard, Bookings, Reports, Quality Flags, Feedback, Audit |
| **Finance Controller**| 48-hour escrow deck, manual early payout overrides, GST accounting, transaction ledger, refund execution | Dashboard, Finance, Bookings, Pricing, Audit |

> **Interactive Role Switcher**: For development and demonstration, the login screen (`/admin/login`) provides 1-click role presets to test the system from any operational perspective.

---

## 🚀 Key Modules & Capabilities

### 1. Operations Command Dashboard (`/admin/dashboard`)
- **6 Core Operational KPIs**:
  1. *Total Platform Revenue* (Customer collections minus refunds).
  2. *Active Inspections* (Live jobs currently in progress across India).
  3. *Unassigned Bookings Radar* (Paid bookings requiring immediate specialist dispatch).
  4. *Active Field Specialists* (Technicians currently online and accepting jobs).
  5. *Escrow Holdings Deck* (Specialist funds held under 48-hour dispute timers).
  6. *Fleet Health Score Average* (Algorithmic average score of all inspected vehicles).
- **High-Priority Alert Queue**: Visual triage deck flagging unassigned bookings exceeding SLA response targets, active customer disputes, and urgent QA exceptions.
- **Real-Time Telemetry Feed**: Live event stream capturing customer bookings, specialist arrival geotag proofs, and report publications.

---

### 2. Booking Lifecycle & SLA Dispatch Management (`/admin/bookings`)
- **Multi-State Lifecycle Filtering**:
  - `Paid` ➔ `Assigned` ➔ `Accepted` ➔ `En Route` ➔ `Arrived` ➔ `Inspecting` ➔ `Submitted` ➔ `Completed` / `Cancelled`.
- **Intelligent Specialist Dispatch Radar**:
  - Identifies available specialists within the appointment pincode zone.
  - Matches technical vehicle complexity certifications (e.g., Luxury/EV certified specialists for BMW/Mercedes/Audi).
  - 1-click automated or manual assignment with technician workload tracking.
- **5-Tier Automated Cancellation & Refund Engine**:
  - Implements the exact SahiVahan customer protection and specialist dispatch SLA:
    - **> 4 hours before slot**: `100% Full Refund` (₹0 deduction).
    - **2 to 4 hours before slot**: `80% Refund` (20% retained for specialist reservation).
    - **< 2 hours before slot**: `50% Refund` (50% retained for specialist dispatch compensation).
    - **Specialist Arrived on Site**: `Travel fee only refunded` (Base inspection fee retained for specialist physical call-out proof).
    - **Inspection Started / Completed**: `0% Refund` (Non-refundable once diagnostics begin).

---

### 3. Customer CRM Directory (`/admin/customers`)
- **Complete Customer Profile View**: Phone number, email, city, address, registration date, and customer status (`VIP`, `Active`, `Inactive`).
- **Booking & Spend Analytics**: Lifetime spend, total historical bookings count, and quick links to inspect each associated booking dossier.
- **Customer Relationship Notes**: Internal operational notes and support ticket history.

---

### 4. Technical Inspection Report Auditor (`/admin/reports/:bookingRef`)
- **Granular 200+ Point Audit View**:
  - System-by-system inspection breakdown matching the field checklist:
    - *Interior Condition & Comfort*
    - *Gauges, Infotainment & Audio*
    - *Carpet & Trunk (Flood watermark indicators)*
    - *Electrical System & Battery Health*
    - *Under the Hood (Engine blow-by, fluid levels, leaks, belts)*
    - *Under the Car (Chassis apron, subframe rust, steering linkage)*
    - *Brakes Check (Noise, pedal vibration, stopping effort)*
    - *Suspension Check (Damping recovery, strut leaks, rough ride)*
    - *Road Test & Dynamic OBD-II Scanning*
- **Defect Photographic Evidence Review**: Full-resolution inspection photographs with pinch-to-zoom and specialist notes.
- **QA Verification & Version Bumping**:
  - One-click QA approval.
  - Mandatory audit notes for corrections, creating an immutable version chain (`v1.0` ➔ `v2.0`).

---

### 5. Specialist Roster & KYC Vetting Dossier (`/admin/specialists`)
- **Fleet Management Table**: View active, pending, suspended, and offline specialists across zones.
- **Comprehensive KYC Verification Deck**:
  - **Aadhaar UIDAI**: Identity validation with reference ID.
  - **Police Clearance Certificate**: Background check verification with expiry tracking.
  - **Commercial Driving License**: Verified license number and vehicle category endorsements.
  - **Automotive Certifications**: ASDC (Automotive Skills Development Council), Bosch, or OEM factory training credentials.
  - **Calibrated Tool Registry**: Serial number audits and calibration validity tracking for paint depth gauges, OBD-II scanners, and battery testers.
  - **Bank Account Penny-Drop Verification**: Verified beneficiary name, IFSC code, and bank account for instant IMPS payouts.

---

### 6. QA Flag Queue & Dispute Triage (`/admin/quality`)
- **Automated Rule Engine Flags**:
  - Odometer mismatch between seller listing and physical cluster photo.
  - High score discrepancy (e.g., 90+ score with critical transmission fault recorded).
  - Missing mandatory defect photos for components marked *Poor* or *Critical*.
- **Customer Dispute Escalation**:
  - Customer disputes immediately freeze the specialist's 48-hour escrow payout.
  - Workflow states: `Pending Review` ➔ `Clarification Requested` ➔ `Correction Issued` ➔ `Resolved Valid` / `Dismissed`.

---

### 7. Pricing Matrix & Catalog Administration (`/admin/pricing`)
- **Live Platform Pricing Configuration**:
  - Base Inspection Fees: Cars (₹1,999) & Bikes (₹999).
  - Complexity Surcharges: Standard (₹0), Complex (₹499), Luxury/EV (₹999).
  - Travel Allowance: Free within 15 km radius, ₹25/km excess travel rate.
  - GST Provisions: 18% statutory tax calculation.
  - Specialist Base Compensation & Tier-1 Performance Bonus (+10%).
- **Vehicle Master Catalog**:
  - Dynamic vehicle master database covering all active automotive brands, models, fuel types, transmission types, and assigned complexity tiers.

---

### 8. Finance, Escrow & Settlement Deck (`/admin/finance`)
- **48-Hour Escrow Holding Deck**:
  - Live countdown timers monitoring the mandatory 48-hour holding period post-report submission.
  - Authorized manual early payout release buttons for high-trust Tier-1 specialists.
- **Statutory GST Accounting**:
  - Breakdown of collected tax, input tax credits, and statutory provisions.
- **Double-Entry Financial Ledger**:
  - Tamper-proof transaction log tracking customer collections, specialist payout disbursements, platform service fees, and approved refunds.

---

### 9. Feedback & Reputation Management (`/admin/feedback`)
- Customer ratings (1-5 stars) and qualitative reviews.
- Specialist feedback on seller interactions, gate pass issues, or difficult inspection conditions.
- Platform bug reporting and resolution workflows.

---

### 10. Immutable Administrative Audit Trail (`/admin/audit`)
- **Zero-Trust Audit Log**: Every administrative action (status override, specialist assignment, refund approval, pricing change, report version bump) is permanently recorded with:
  - Exact UTC & IST timestamp.
  - Admin user name and role.
  - Target resource category and ID.
  - Detailed before/after state diff.

---

## 🛠 Tech Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) | Enterprise dashboard UI architecture |
| **Bundler / Tooling** | [Vite 5](https://vitejs.dev/) | Fast build times and hot reload |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type contracts across admin models and APIs |
| **Styling** | [TailwindCSS 3](https://tailwindcss.com/) | Custom "Command Center" high-density dark theme |
| **Routing** | [React Router v6](https://reactrouter.com/) | Protected routes with `AdminAuthGuard` |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent operational iconography |
| **State Engine** | React Context API | `AdminContext.tsx` — Enterprise state machine governing all 10 modules |

---

## 🎨 Design System: "Command Center" Theme

The admin portal is styled with a **Command Center** dark theme engineered for prolonged operational monitoring:
- **Backgrounds**: Slate Black (`#0A0E12`), Panel (`#12181E`), and Card (`#182028`).
- **Borders & Dividers**: Subtle borders (`#1E262E`) maximizing data density without visual clutter.
- **Status Accents**:
  - Emerald (`#10B981`): Completed bookings, verified KYC, active specialists.
  - Amber (`#F59E0B`): Pending escrow holds, approaching SLAs, pending reviews.
  - Crimson (`#EF4444`): Critical QA flags, customer disputes, cancellations.
  - Cyan (`#06B6D4`): In-transit telemetry and dispatch markers.
- **Typography**: `Plus Jakarta Sans` for labels paired with `JetBrains Mono` for booking IDs, currency values, and timestamps.

---

## 📁 Project Directory Structure

```text
apps/admin-portal/
├── index.html                  # HTML entry point
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Command Center theme tokens
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration (Port 3002)
└── src/
    ├── App.tsx                 # Root application component
    ├── main.tsx                # Entry point
    ├── index.css               # Global styles & custom scrollbars
    ├── components/
    │   └── layout/             # AdminLayout, AdminHeader, AdminSidebar
    ├── pages/
    │   ├── DashboardPage.tsx       # 6 KPIs, urgent alerts, live booking feed
    │   ├── BookingsPage.tsx        # Booking lifecycle, dispatch radar, refund processing
    │   ├── CustomersPage.tsx       # Customer CRM directory & spend history
    │   ├── ReportDetailPage.tsx    # Technical inspection report deep-dive auditor
    │   ├── SpecialistsPage.tsx     # Fleet roster, KYC vetting dossier, tool calibration
    │   ├── QualityFlagsPage.tsx    # Automated QA rules, customer dispute triage queue
    │   ├── FeedbackPage.tsx        # Customer reviews, specialist feedback, bug reports
    │   ├── AdminUsersPage.tsx      # Admin user management & RBAC configuration
    │   ├── PricingCatalogPage.tsx  # Dynamic base fees, complexity surcharges, vehicle catalog
    │   ├── FinancePage.tsx         # 48-hour escrow deck, GST accounting, transaction ledger
    │   ├── AuditPage.tsx           # Immutable administrative activity log
    │   └── AdminLoginPage.tsx      # Login screen with 1-click RBAC role presets
    ├── router/
    │   └── index.tsx           # Protected router configuration with AdminAuthGuard
    ├── store/
    │   ├── AdminContext.tsx    # Enterprise state machine & mock data engine (65KB)
    │   └── ThemeContext.tsx    # Dark/Light theme state
    └── types/
        └── admin.ts            # TypeScript interfaces for all admin entities
```

---

## 🛣 Route Inventory

| Route | Page Component | Access Guard | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `/admin/login` | `AdminLoginPage` | Public | Authentication with 1-click demo role presets |
| `/admin/dashboard` | `DashboardPage` | Protected | Executive dashboard with 6 KPIs and alert radar |
| `/admin/bookings` | `BookingsPage` | Protected | Booking lifecycle, specialist assignment, cancellation refunds |
| `/admin/customers` | `CustomersPage` | Protected | Customer CRM directory, lifetime value, and booking history |
| `/admin/reports/:bookingRef` | `ReportDetailPage` | Protected | Technical inspection report auditor, defect evidence, QA sign-off |
| `/admin/specialists` | `SpecialistsPage` | Protected | Specialist fleet roster, KYC vetting deck, tool calibration audit |
| `/admin/quality` | `QualityFlagsPage` | Protected | Automated QA rule anomaly triage and customer dispute escrow freeze |
| `/admin/feedback` | `FeedbackPage` | Protected | Customer satisfaction, reviews, and app bug ticket triage |
| `/admin/users` | `AdminUsersPage` | Protected | Internal administrative user management and permission assignment |
| `/admin/pricing` | `PricingCatalogPage` | Protected | Live pricing matrix, complexity surcharges, and vehicle master catalog |
| `/admin/finance` | `FinancePage` | Protected | 48-hour escrow countdown deck, early payout overrides, GST ledger |
| `/admin/audit` | `AuditPage` | Protected | Immutable administrative activity logs |

---

## 💻 Development & Running Locally

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation
From the root of the monorepo or from this directory:
```bash
cd apps/admin-portal
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will be accessible at:
👉 **`http://127.0.0.1:3002/`**

### Build for Production
```bash
npm run build
```
Generates an optimized, production-ready bundle in `dist/`.

### Preview Production Build
```bash
npm run preview
```

### Netlify Deployment Configuration (SPA Reload Fix)
This Single Page Application uses client-side routing via React Router v6. To prevent `404 Not Found` errors when users refresh or reload nested routes like `/admin/dashboard` or `/admin/bookings`, the project includes:
1. `public/_redirects`: Contains `/*  /index.html  200` which Vite copies into `dist/_redirects` during build.
2. `netlify.toml`: Contains the Netlify build settings and catch-all redirect rule to `/index.html`.

---

## 🔗 Related Applications in SahiVahan
- [Customer Portal](https://sahivahan.netlify.app/) — Consumer booking funnel, 7-stage live tracking, and interactive vehicle health reports.
- [Specialist Field App](https://sahivahan-spl.netlify.app/specialist/dashboard) — Technician mobile-first web app for field check-in, 200+ point checklist execution, and escrow wallet.
