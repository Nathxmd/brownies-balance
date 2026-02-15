# 🍫 Brownies Balance - Complete Development Guide
## Full-Stack Website: Landing Page + Admin Dashboard + Pre-Order System

**Project:** Brownies gluten-free & low sugar untuk Gen Z  
**Tech Stack:** Next.js + React + TypeScript + Prisma + PostgreSQL

---

## 📋 Ringkasan Proyek

### Apa yang akan dibangun:

**🌐 PUBLIC WEBSITE (Customer)**
- Landing page dengan 9 section (Hero, Features, Benefits, dll)
- Product catalog dengan filter & search
- Pre-order form dengan validation
- Testimonial & FAQ
- Contact form

**🔐 ADMIN DASHBOARD (Internal)**
- Dashboard analytics & insights
- **Product Management** - CRUD, upload gambar, stock tracking
- **Order Management** - Track orders, update status, konfirmasi payment
- **Cashflow Tracking** - Income/expense, profit calculation, reports
- **Customer Management** - Lihat data customer & order history
- **Reports** - Export Excel/PDF, financial statements

---

## 🎯 Tech Stack: Next.js (RECOMMENDED)

### Kenapa Next.js, bukan Laravel + Inertia?

| Feature | Next.js | Laravel+Inertia |
|---------|---------|-----------------|
| **Backend** | ✅ Built-in API Routes | ✅ Laravel API |
| **Admin Dashboard** | ✅ Easy dengan routes | ✅ Bagus dengan Inertia |
| **SEO** | ⭐⭐⭐⭐⭐ (SSR built-in) | ⭐⭐⭐ (need config) |
| **Deployment** | ✅ FREE (Vercel) | ❌ Need VPS (~Rp 100k+/bln) |
| **Maintenance** | ✅ Simple | ⚠️ Need server management |
| **Cost** | 💰 Rp 112k/bulan | 💰 Rp 500k+/bulan |
| **Learning Curve** | ⭐⭐⭐⭐ Single stack | ⭐⭐⭐ PHP + JS |

### Complete Stack:

```yaml
Frontend:
  - Next.js 14 (App Router)
  - React 18 + TypeScript
  - Tailwind CSS
  - Shadcn/ui (Components)
  - Framer Motion (Animations)

Backend:
  - Next.js API Routes
  - Prisma ORM
  - NextAuth.js (Auth)
  - Zod (Validation)

Database:
  - PostgreSQL (Supabase/Railway)

Storage:
  - Uploadthing (Images)

Payment:
  - Midtrans / Xendit

Email & Notif:
  - Resend (Email)
  - Fonnte (WhatsApp)

Charts:
  - Recharts
```

---

## 🗄️ Database Schema (Lengkap)

```prisma
// USER & AUTH
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  password String   // hashed
  name     String
  role     UserRole @default(CUSTOMER) // ADMIN, STAFF, CUSTOMER
  orders   Order[]
}

// PRODUCTS
model Product {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  description     String    @db.Text
  price           Int       // Dalam rupiah kecil
  compareAtPrice  Int?      // Harga coret
  costPrice       Int?      // Untuk hitung profit
  sku             String?   @unique
  stock           Int       @default(0)
  lowStockAlert   Int       @default(5)
  isAvailable     Boolean   @default(true)
  isPreOrder      Boolean   @default(true)
  preOrderDays    Int       @default(2)
  
  categoryId      String
  category        Category  @relation(fields: [categoryId], references: [id])
  
  thumbnail       String
  images          ProductImage[]
  
  nutritionInfo   Json?     // {calories, protein, carbs, fat, fiber, sugar}
  allergens       String[]  // ["milk", "eggs"]
  tags            String[]  // ["gluten-free", "bestseller"]
  
  orderItems      OrderItem[]
  reviews         Review[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// ORDERS
model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique  // BRW-20240215-001
  
  customerId      String?
  customer        User?         @relation(fields: [customerId], references: [id])
  customerName    String
  email           String
  phone           String
  
  deliveryAddress String
  city            String
  deliveryDate    DateTime
  deliveryTime    DeliveryTime  // MORNING, AFTERNOON, EVENING
  
  items           OrderItem[]
  subtotal        Int
  discount        Int           @default(0)
  deliveryFee     Int           @default(0)
  totalAmount     Int
  
  status          OrderStatus   @default(PENDING)
  paymentMethod   PaymentMethod @default(BANK_TRANSFER)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentProof    String?
  
  notes           String?
  internalNotes   String?       // Admin only
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  productName String  // Snapshot
  quantity    Int
  price       Int     // Price saat order
  subtotal    Int
}

enum OrderStatus {
  PENDING      // Baru masuk
  CONFIRMED    // Admin confirm
  PAID         // Sudah bayar
  PROCESSING   // Sedang dibuat
  READY        // Siap kirim
  DELIVERED    // Sudah sampai
  COMPLETED    // Selesai
  CANCELLED
}

// CASHFLOW & FINANCIAL
model Cashflow {
  id              String          @id @default(cuid())
  type            TransactionType // INCOME, EXPENSE
  category        String          // "Sales", "Ingredients", "Marketing"
  description     String
  amount          Int             // Positive = income, Negative = expense
  
  paymentMethod   PaymentMethod?
  receipt         String?         // URL bukti
  
  transactionDate DateTime        @default(now())
  createdAt       DateTime        @default(now())
  notes           String?
}

model Expense {
  id              String         @id @default(cuid())
  category        ExpenseCategory
  description     String
  amount          Int
  vendor          String?
  invoiceNumber   String?
  paymentMethod   PaymentMethod
  receipt         String?
  
  isRecurring     Boolean        @default(false)
  
  paidAt          DateTime       @default(now())
  notes           String?
}

enum ExpenseCategory {
  INGREDIENTS   // Bahan baku
  PACKAGING
  UTILITIES     // Listrik, air
  MARKETING
  SALARY
  RENT
  DELIVERY
  OTHER
}

// REVIEWS
model Review {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  customerName String
  rating      Int      // 1-5
  comment     String   @db.Text
  
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

---

## 📁 Project Structure

```
brownies-balance/
├── src/
│   ├── app/
│   │   ├── (public)/           # Public pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── products/
│   │   │   ├── order/
│   │   │   └── about/
│   │   │
│   │   ├── (admin)/            # Admin dashboard
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/   # CRUD products
│   │   │   │   ├── orders/     # Order management
│   │   │   │   ├── cashflow/   # Financial tracking
│   │   │   │   └── customers/
│   │   │
│   │   └── api/                # API Routes
│   │       ├── products/
│   │       ├── orders/
│   │       └── cashflow/
│   │
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   ├── public/             # Public site components
│   │   └── ui/                 # Shadcn components
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── validations/
│   │
│   └── types/
│
├── prisma/
│   └── schema.prisma
│
└── public/
    └── images/
```

---

## 🌐 Landing Page (9 Sections)

### 1. **Hero Section**
```
[Large Product Image]
"Brownies Sehat Tanpa Kompromi Rasa"
Gluten-Free • Low Sugar • Oat-Based
[Pesan Sekarang Button]
```

### 2. **Problem & Solution**
```
Masalah:                  Solusi:
❌ Suka dessert tapi      ✅ Brownies Balance
   takut diabetes            100% Oat-based
❌ Gluten intolerant      ✅ Low sugar
❌ Diet gak enak          ✅ Tetap fudgy & lezat
```

### 3. **Product Features** (Icon Grid 3x)
```
🌾 100% Oat-Based        🍯 Low Sugar         😋 Rasa Premium
Gluten-free              Pemanis alami        Tidak kompromi
Baik pencernaan          Aman diabetes        Texture fudgy
```

### 4. **Benefits**
- ✅ Aman untuk diabetes
- ✅ Weight management
- ✅ Tinggi serat
- ✅ Post-workout snack

### 5. **Product Showcase**
- Gallery foto brownies high-quality
- Variants (Original, Choco Chips, Nuts)
- Nutrition facts
- Pricing (1 box 6pcs: Rp 45k)

### 6. **How to Order** (4 Steps)
```
1. Pilih Produk → 2. Isi Form → 3. Bayar → 4. Terima Brownies
```

### 7. **Testimonials**
```
⭐⭐⭐⭐⭐
"Enak banget! Low sugar tapi tetap manis sempurna!"
- Sarah, Jakarta
```

### 8. **FAQ** (Accordion)
- Berapa lama tahan?
- Minimal order?
- Area delivery?
- Cara bayar?

### 9. **CTA Final**
```
"Mulai Hidup Sehat dengan Brownies Balance"
[Pesan Sekarang - Large Button]
```

---

## 🔐 Admin Dashboard

### Dashboard Overview
```
┌────────────────────────────────────────────┐
│ Stats Cards                                │
│ [Revenue] [Orders] [Pending] [Low Stock]  │
├────────────────────────────────────────────┤
│ Revenue Chart (30 days)                    │
│ ▁▂▄▅▇█▇▅▄▂▁                               │
├─────────────────┬──────────────────────────┤
│ Recent Orders   │ Top Products             │
│ (10 latest)     │ (This month)             │
└─────────────────┴──────────────────────────┘
```

### Product Management
**Features:**
- ✅ Add/Edit/Delete products
- ✅ Upload multiple images
- ✅ Stock tracking & alerts
- ✅ Category management
- ✅ Nutrition info
- ✅ SEO fields

**Product Form:**
```typescript
{
  name: string
  description: string
  price: number
  costPrice: number      // For profit calc
  stock: number
  categoryId: string
  images: File[]
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  allergens: string[]
}
```

### Order Management
**Features:**
- ✅ Order list dengan filter
- ✅ Order detail view
- ✅ Update status
- ✅ Konfirmasi payment
- ✅ Print invoice
- ✅ WhatsApp customer

**Order Status Flow:**
```
PENDING → CONFIRMED → PAID → PROCESSING → READY → DELIVERED → COMPLETED
```

**Order Detail:**
```
┌─────────────────────────────────────┐
│ Order #BRW-001      [Print Invoice] │
├─────────────────────────────────────┤
│ Customer: Sarah Tanaka              │
│ Phone: 0812-3456-7890              │
│ Delivery: 17 Feb, Afternoon        │
│                                     │
│ Items:                              │
│ - Original Brownies x2  = 90,000   │
│ - Choco Chips x1       = 50,000   │
│                                     │
│ Subtotal:              140,000     │
│ Delivery:               15,000     │
│ Total:                 155,000     │
│                                     │
│ Status: 🟢 PAID                    │
│ [Update Status] [Send WhatsApp]    │
└─────────────────────────────────────┘
```

### Cashflow Management
**Features:**
- ✅ Income tracking (auto dari orders)
- ✅ Expense recording
- ✅ Profit calculation
- ✅ Charts & reports
- ✅ Export Excel/PDF

**Cashflow Dashboard:**
```
┌──────────────┬──────────────┬─────────────┐
│ Total Income │ Total Expens │ Net Profit  │
│ 15,450,000   │ 8,230,000   │ 7,220,000  │
│ +12.5% ↑     │ +8.3% ↑     │ +18.2% ↑   │
└──────────────┴──────────────┴─────────────┘

Revenue vs Expenses Chart
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Line chart showing trends]

Expense Breakdown (Pie Chart)
• Ingredients: 40%
• Packaging: 25%
• Marketing: 15%
• Delivery: 10%
• Other: 10%

Recent Transactions
┌──────┬─────────────┬──────────┬──────────┐
│ Date │ Description │ Category │ Amount   │
├──────┼─────────────┼──────────┼──────────┤
│ 2/15 │ Order #001  │ Sales    │ +135,000 │
│ 2/15 │ Flour       │ Ingredi. │ -450,000 │
│ 2/14 │ Packaging   │ Packa.   │ -280,000 │
└──────┴─────────────┴──────────┴──────────┘
```

**Expense Form:**
```typescript
{
  category: "INGREDIENTS" | "PACKAGING" | "MARKETING" | ...
  description: string
  amount: number
  vendor?: string
  receipt?: File        // Upload bukti
  paidAt: Date
}
```

**Financial Reports:**
- Profit & Loss Statement
- Cash Flow Report
- Expense Breakdown
- Monthly Comparison

---

## 🔌 Key API Endpoints

```typescript
// PRODUCTS
GET    /api/products              // List products
POST   /api/products              // Create (admin)
GET    /api/products/[id]         // Detail
PUT    /api/products/[id]         // Update (admin)
DELETE /api/products/[id]         // Delete (admin)

// ORDERS
GET    /api/orders                // List orders
POST   /api/orders                // Create order
GET    /api/orders/[id]           // Detail
PATCH  /api/orders/[id]/status    // Update status (admin)

// CASHFLOW
GET    /api/cashflow              // List transactions
POST   /api/cashflow              // Record transaction (admin)
GET    /api/cashflow/summary      // Financial summary
GET    /api/cashflow/export       // Export Excel

// ANALYTICS
GET    /api/analytics/dashboard   // Dashboard stats
GET    /api/analytics/sales       // Sales data
```

---

## 🔐 Authentication

```typescript
// NextAuth.js config
providers: [
  CredentialsProvider({
    async authorize(credentials) {
      // Check email & password
      // Return user dengan role (ADMIN/CUSTOMER)
    }
  })
]

// Middleware
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      // Protect /admin routes
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'ADMIN'
      }
      return true
    }
  }
})
```

---

## 📅 Implementation Timeline (7 Weeks)

```
Week 1: Setup & Auth
✅ Project init, Prisma, database
✅ NextAuth, admin layout

Week 2: Product Management
✅ Product CRUD
✅ Image upload
✅ Stock tracking

Week 3: Order System
✅ Order form
✅ Order submission
✅ Admin order management

Week 4: Cashflow
✅ Cashflow tracking
✅ Expense recording
✅ Financial reports

Week 5: Landing Page
✅ All 9 sections
✅ Animations
✅ SEO optimization

Week 6: Advanced Features
✅ Customer management
✅ Reviews
✅ Notifications (Email, WhatsApp)

Week 7: Testing & Deploy
✅ Testing
✅ Deploy to Vercel
✅ Production setup
```

---

## 💰 Monthly Costs

### Startup (Gratis!)
```
Domain        : Rp  12,500/bln (domain .com)
Vercel        : FREE
Supabase      : FREE (500MB)
Uploadthing   : FREE (2GB)
Resend        : FREE (100 emails/day)
WhatsApp      : Rp 100,000/bln
────────────────────────────
TOTAL         : Rp 112,500/bln
```

### Growing Business
```
Domain        : Rp  12,500
Vercel Pro    : Rp 315,000
Railway       : Rp  79,000
Uploadthing   : Rp 158,000
Resend Pro    : Rp 315,000
WhatsApp      : Rp 100,000
────────────────────────────
TOTAL         : Rp 980,000/bln
```

---

## 🚀 Quick Start

### 1. Install
```bash
npx create-next-app@latest brownies-balance --typescript --tailwind
cd brownies-balance

# Dependencies
npm install prisma @prisma/client next-auth bcryptjs
npm install react-hook-form zod @hookform/resolvers
npm install recharts uploadthing resend

# Shadcn UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input table dialog
```

### 2. Setup Database
```bash
npx prisma init
# Copy schema dari guide
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Environment Variables
```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_SECRET="..."
```

### 4. Run
```bash
npm run dev
# http://localhost:3000
# Admin: http://localhost:3000/login
```

---

## ✅ Feature Checklist

### Public Website
- [x] Landing page (9 sections)
- [x] Product catalog
- [x] Pre-order form
- [x] Order confirmation
- [x] SEO optimization

### Admin Dashboard
- [x] Dashboard analytics
- [x] Product CRUD
- [x] Order management
- [x] Cashflow tracking
- [x] Customer list
- [x] Financial reports
- [x] Export Excel/PDF

### Features
- [x] Authentication (NextAuth)
- [x] Image upload
- [x] Email notifications
- [x] WhatsApp integration
- [x] Payment proof upload
- [x] Invoice generation

---

## 🎯 Summary

**Total Development Time:** 7 weeks  
**Total Monthly Cost:** Rp 112,500 (startup) - Rp 980,000 (growing)  
**Tech Stack:** Next.js (full-stack, modern, maintainable)

**Why Next.js wins:**
✅ Full-stack dalam 1 framework  
✅ FREE hosting (Vercel)  
✅ Excellent SEO (built-in SSR)  
✅ Easy maintenance  
✅ Type-safe end-to-end  
✅ Great developer experience  

---

## 🤝 Mau Saya Bantu Apa Selanjutnya?

1. 🎨 **Generate complete starter code** dengan semua setup
2. 📊 **Build admin dashboard components** (ProductTable, OrderDetail, dll)
3. 🛍️ **Create order form** dengan validation lengkap
4. 💰 **Implement cashflow system** dengan charts
5. 🚀 **Help deployment** setup production
6. 📝 **Explain konsep tertentu** lebih detail

**Tinggal pilih! Siap membantu! 💪**
