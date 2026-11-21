# FixMate Client - Smart Device & Home Appliance Repair Platform

FixMate is a full-stack, role-based repair service marketplace built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Stripe**. Customers book verified doorstep and drop-off repairs, monitor real-time job progress, and pay online only after quality completion.

---

## 📌 Submission Information & Live Links

- **Project Name:** FixMate
- **Platform Purpose:** Connect customers in Bangladesh and worldwide with verified repair technicians across smartphones, laptops, ACs, refrigerators, TVs, washing machines, and electrical works with a strictly enforced pay-after-service model.
- **Client GitHub Repository:** [https://github.com/zahidulislam420/fixmate-client.git](https://github.com/zahidulislam420/fixmate-client.git)
- **Server GitHub Repository:** [https://github.com/zahidulislam420/fixmate-backend.git](https://github.com/zahidulislam420/fixmate-backend.git)
- **Live Server API (Render):** [https://fixmate-backend-msfi.onrender.com](https://fixmate-backend-msfi.onrender.com)
- **Live Client Site:** [https://fixmate-client.vercel.app](https://fixmate-client.vercel.app) *(or local development http://localhost:3000)*

---

## 🔑 Test Credentials (Examiner Quick Testing)

| Role | Email | Password | Permissions & Pre-seeded State |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Admin123!` | Moderate services, promote/demote user roles, monitor all platform bookings and Stripe revenue |
| **Technician 1** | `tech.hasan@fixmate.com` | `Tech123!` | Master Appliance & HVAC Specialist. Has approved services, accepted jobs & completed requests |
| **Technician 2** | `tech.tanvir@fixmate.com` | `Tech123!` | Electronics & PC Hardware Engineer. Has approved & pending services |
| **Customer 1** | `customer.sarah@fixmate.com` | `Cust123!` | Has active requested bookings & completed booking ready for Stripe "Pay Now" |
| **Customer 2** | `customer.karim@fixmate.com` | `Cust123!` | Has paid booking with verified Stripe transaction, 5-star rating & review |

> **Examiner Tip:** Use the 1-click **Quick Demo Login** buttons on the `/sign-in` page to autofill any test role instantly!

---

## 🌟 Key Features & Implementation Highlights

### 1. Main Platform Requirements
- **Responsive Navigation:** Sticky navbar, tool/wrench icon logo, role badges, active route indicator, mobile hamburger drawer, and avatar dropdown (Name, Role badge, Dashboard, Update Profile, Sign Out).
- **Home Page (`/`):**
  - Modern hero banner with headline, subtitle, quick search box, and turnaround metrics.
  - 6 latest approved & available services (`.sort({ createdAt: -1 }).limit(6)`).
  - "How FixMate Works" 4-step visual flow: Find ➔ Request ➔ Fix ➔ Pay After Completion.
  - Popular Categories grid & Why Choose Us trust pillars with verified platform stats and customer testimonials.
- **Browse Services (`/services`) — Challenge 1:**
  - Server-side search by device/title/area.
  - Server-side category and service mode filters.
  - Server-side sorting (Price: Low to High, Price: High to Low, Newest).
  - Persistent URL search parameters across page reloads.
  - Friendly empty state when no services match.
  - Server-side pagination (`.skip()` and `.limit()`).
- **Service Details (`/services/[id]`):**
  - Comprehensive details, turnaround time, coverage area, and verified technician summary card (name, photo, area, bio).
  - Role-restricted booking button (Customers can book; Logged-out users redirected to sign-in; Technicians/Admins restricted).
  - Booking request modal preventing duplicate active requests for the same service.
- **Customer Dashboard (`/dashboard/customer`):**
  - Reusable Stats Cards: Total Requests, Active Jobs, Completed Jobs.
  - My Bookings table with status badges and payment badges.
  - Cancel button with confirmation modal (active only for `requested` status).
  - Pay Now button (active only for `completed` + `unpaid` status) redirecting to Stripe Checkout.
  - Visual Step Tracker modal (Requested ➔ Accepted ➔ In Progress ➔ Completed ➔ Paid).
  - Rating & Review modal (1-5 stars) for completed & paid jobs.
  - Payment History ledger with downloadable PDF invoice receipts (`jspdf`).
- **Technician Dashboard (`/dashboard/technician`):**
  - Stats Cards: Total Services, Approved Services, Pending Requests.
  - Add Service form with ImgBB file upload (not URL field) and auto-pending approval.
  - My Services CRUD: Edit service (resets approval to pending), Delete with confirmation modal, and Toggle availability switch.
  - Manage Requests pipeline (Challenge 3):
    - `requested` ➔ Accept / Reject
    - `accepted` ➔ Start Work (becomes `in-progress`)
    - `in-progress` ➔ Mark Completed with `finalAmount` input modal
    - `completed` ➔ Payment badge display (Unpaid / Paid)
- **Admin Dashboard (`/dashboard/admin`):**
  - Stats Cards: Total Users, Total Technicians, Pending Services, Total Revenue.
  - User management table with role updating (Customer / Technician / Admin) and self-demotion prevention guard.
  - Service moderation approval queue (Approve / Reject).
  - Read-only table of all platform bookings with status filter.
  - Transactions ledger displaying total revenue and Stripe payment records.
- **Shared Profile (`/dashboard/profile`):**
  - Update Name, Phone, Area, Bio, and Profile Photo (ImgBB upload).
  - Read-only Email and Role.
  - Instant topbar and navbar sync without re-logging in.
- **Stripe Pay-After-Service — Challenge 4:**
  - Stripe Checkout session with server-side price lookup.
  - Verification on `/payment/success` with celebration confetti.
  - Friendly `/payment/cancel` page with retry action.
  - Idempotent recording preventing duplicate payments in database.
- **System Pages:**
  - Custom repair-themed 404 Not Found (`not-found.tsx`).
  - Error Boundary (`error.tsx`) with reset retry.
  - Loading skeleton state (`loading.tsx`).
  - Dark / Light mode toggle.

---

## 📦 npm Packages Used

| Package | Purpose |
| :--- | :--- |
| `next` (v16.4) | Next.js React Framework with Turbopack & App Router |
| `react` & `react-dom` (v19) | Modern React 19 library |
| `tailwindcss` (v4) | Utility-first responsive CSS styling |
| `lucide-react` | Crisp, modern UI icons including wrench, theme toggles, status symbols |
| `sonner` | Rich interactive toast notifications |
| `canvas-confetti` | Visual celebration confetti effect on payment success |
| `jspdf` | Client-side dynamic PDF invoice generation and download |

---

## 💻 Environment Variables Configuration

### Production Environment (`.env.local` / Vercel Environment Variables)
```env
NEXT_PUBLIC_API_URL=https://fixmate-backend-msfi.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=f5686d899286015406d5b18b757fcb50
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build & Typecheck
```bash
pnpm typecheck
pnpm build
pnpm start
```
