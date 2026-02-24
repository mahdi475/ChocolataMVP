# 🍫 Chocolata MVP - Complete Codebase & Features Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Core Features](#core-features)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Authentication & Authorization](#authentication--authorization)
9. [User Roles & Features](#user-roles--features)
10. [API Integration](#api-integration)
11. [Styling & Theming](#styling--theming)
12. [Internationalization (i18n)](#internationalization-i18n)
13. [Testing](#testing)
14. [Deployment](#deployment)

---

## Project Overview

**Chocolata** is a global e-commerce platform for chocolate and gourmet food products. It enables small to large businesses to register, create storefronts, and sell products across Europe and globally.

### Key Objectives
- ✅ Enable sellers to register and be verified
- ✅ Allow buyers to browse, search, and purchase products
- ✅ Provide admins with management tools
- ✅ Ensure secure transactions and data protection
- ✅ Support multiple languages and regions
- ✅ Scalable and maintainable architecture

### Current Status
- **Foundation:** ✅ Complete
- **Core MVP Features:** 🟡 In Progress
- **Production Ready:** ⏳ In Development

---

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Redux Toolkit** - Global state management
- **CSS Modules** - Scoped styling
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **i18next** - Internationalization

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication (Auth)
  - Storage (S3-compatible)
  - Row-Level Security (RLS)
  - Real-time subscriptions
  - Edge Functions (planned)

### Testing
- **Playwright** - End-to-end (E2E) testing
- **Vitest** - Unit testing (configured)

### DevOps & Deployment
- **Vercel** - Hosting & CI/CD
- **GitHub** - Version control

---

## Project Structure

```
chocolata-mvp/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── animations/          # Animation components
│   │   │   ├── FadeIn.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── SplashScreen.module.css
│   │   ├── auth/                # Authentication components
│   │   │   └── RoleRedirect.tsx
│   │   ├── cards/               # Card components
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductCard.module.css
│   │   ├── checkout/            # Checkout flow components
│   │   │   ├── AddressSelector.tsx
│   │   │   ├── CartSidebar.tsx
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   └── (+ CSS modules)
│   │   ├── forms/               # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── (+ CSS modules)
│   │   ├── layout/              # Layout wrappers
│   │   │   ├── AdminShell.tsx
│   │   │   ├── BuyerLayout.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── SellerDashboardShell.tsx
│   │   │   ├── SearchOverlay.tsx
│   │   │   └── (+ CSS modules)
│   │   └── ui/                  # Base UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ImageUpload.tsx
│   │       ├── Notification.tsx
│   │       └── (+ CSS modules)
│   │
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Authentication state & logic
│   │   └── CartContext.tsx      # Shopping cart state
│   │
│   ├── pages/                   # Page components (route views)
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── LoginPage.tsx        # Login
│   │   ├── RegisterPage.tsx     # Registration
│   │   ├── About.tsx            # About page
│   │   ├── buyer/               # Buyer-specific pages
│   │   │   ├── CatalogPage.tsx         # Product browsing
│   │   │   ├── ProductDetailPage.tsx   # Product details
│   │   │   ├── SellerProfilePage.tsx   # Seller storefront
│   │   │   ├── CartPage.tsx            # Shopping cart
│   │   │   ├── CheckoutPage.tsx        # Checkout process
│   │   │   ├── CheckoutConfirmationPage.tsx
│   │   │   ├── BuyerOrdersPage.tsx     # Order history
│   │   │   ├── OrderDetailPage.tsx     # Order tracking
│   │   │   ├── CustomerProfilePage.tsx # User profile
│   │   │   └── (+ CSS modules)
│   │   ├── seller/              # Seller-specific pages
│   │   │   ├── SellerDashboardPage.tsx      # Dashboard
│   │   │   ├── SellerProductsPage.tsx       # Product management
│   │   │   ├── SellerProductEditPage.tsx    # Create/edit product
│   │   │   ├── SellerOrdersPage.tsx         # Order management
│   │   │   ├── SellerVerificationPage.tsx   # Seller registration
│   │   │   └── (+ CSS modules)
│   │   ├── admin/               # Admin-specific pages
│   │   │   ├── AdminDashboardPage.tsx  # Admin overview
│   │   │   ├── AdminSellersPage.tsx    # Seller management
│   │   │   ├── AdminCategoriesPage.tsx # Category management
│   │   │   ├── AdminOrdersPage.tsx     # Order monitoring
│   │   │   ├── AdminActivityPage.tsx   # Activity logs
│   │   │   ├── AdminProductsPage.tsx   # Product moderation
│   │   │   └── (+ CSS modules)
│   │   └── assets/              # Page-specific assets
│   │
│   ├── routes/                  # Routing configuration
│   │   └── AppRouter.tsx        # Central route definitions
│   │
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   └── slices/              # Redux slices
│   │       ├── authSlice.ts     # Authentication state
│   │       ├── cartSlice.ts     # Cart state
│   │       └── notificationSlice.ts
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── supabaseClient.ts    # Supabase initialization
│   │   ├── email.ts             # Email utilities
│   │   ├── payment.ts           # Payment processing
│   │   ├── i18n.ts              # i18n setup
│   │   └── setupDatabase.ts     # Database initialization
│   │
│   ├── locales/                 # Internationalization files
│   │   ├── en/
│   │   │   ├── common.json
│   │   │   └── (other namespaces)
│   │   └── de/
│   │       ├── common.json
│   │       └── (other namespaces)
│   │
│   ├── styles/                  # Global styles
│   │   └── index.css
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite type definitions
│
├── supabase/
│   └── functions/               # Edge Functions (serverless)
│       ├── send-order-email/    # Email sending
│       ├── send-order-status-email/
│       └── payment-webhook/     # Payment webhooks
│
├── tests/
│   ├── e2e/                     # End-to-end tests
│   │   ├── buyer/               # Buyer flow tests
│   │   ├── seller/              # Seller flow tests
│   │   └── admin/               # Admin flow tests
│   └── utils/                   # Test utilities
│       ├── auth.ts
│       └── supabase.ts
│
├── Configuration Files
│   ├── package.json             # Dependencies & scripts
│   ├── tsconfig.json            # TypeScript configuration
│   ├── vite.config.ts           # Vite configuration
│   ├── vite-env.d.ts            # Type definitions
│   ├── playwright.config.ts     # E2E test config
│   ├── .eslintrc.cjs            # Linting rules
│   ├── vercel.json              # Vercel deployment config
│   └── .vercelignore            # Vercel build ignore
│
├── Database Setup Files
│   ├── supabase-setup.sql
│   ├── minimal-setup.sql
│   ├── categories-setup.sql
│   ├── sample-products-setup.sql
│   ├── seller-verification-policies.sql
│   ├── supabase-storage-setup.sql
│   ├── checkout-enhancements-schema.sql
│   ├── fix-users-policy.sql
│   ├── fix-storage-bucket.sql
│   ├── admin-activity-log.sql
│   ├── add-userid-to-orders.sql
│   └── add-country-to-products.sql
│
└── Documentation
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── CHECKOUT_IMPLEMENTATION_SUMMARY.md
    ├── CUSTOMER_SERVICE_FEATURES.md
    ├── EDGE_FUNCTIONS_SETUP.md
    └── ultimate_roadmap.md
```

---

## Database Schema

### Core Tables

#### `users`
Stores user profile information and role assignment.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY (from auth.users),
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT ('buyer', 'seller', 'admin'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Key Relationships:**
- One user can have one role
- Users link to orders, products (if seller), and verifications

---

#### `products`
Stores all product listings from sellers.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  seller_id UUID FOREIGN KEY (users.id),
  name TEXT,
  description TEXT,
  price NUMERIC,
  category_id UUID FOREIGN KEY (categories.id),
  image_url TEXT,
  stock INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Key Relationships:**
- Many products per seller
- One category per product
- Links to order_items and reviews

---

#### `orders`
Stores all customer orders.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  buyer_id UUID FOREIGN KEY (users.id),
  seller_id UUID FOREIGN KEY (users.id),
  status TEXT ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
  total_amount NUMERIC,
  currency TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Key Relationships:**
- One buyer per order
- One seller per order (though could expand to multi-seller)
- Links to order_items

---

#### `order_items`
Individual items within orders.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID FOREIGN KEY (orders.id),
  product_id UUID FOREIGN KEY (products.id),
  quantity INTEGER,
  price_at_purchase NUMERIC,
  created_at TIMESTAMP
)
```

---

#### `categories`
Product categories for browsing and filtering.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  slug TEXT UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP
)
```

**Example Categories:**
- Dark Chocolate
- Milk Chocolate
- White Chocolate
- Artisan Blends
- Gift Sets
- Organic & Fair Trade

---

#### `seller_verifications`
Tracks seller verification requests and documents.

```sql
CREATE TABLE seller_verifications (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY (users.id),
  document_url TEXT (stored in seller_docs bucket),
  status TEXT ('pending', 'approved', 'rejected'),
  rejection_reason TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

#### `activity_log`
Admin audit trail for system activities.

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  admin_id UUID FOREIGN KEY (users.id),
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP
)
```

---

### Storage Buckets

#### `seller_docs`
Stores seller verification documents (ID copies, business licenses, etc.)

- **Access:** Private - only owner and admins can access
- **Policy:** RLS-protected

---

#### `product-images`
Stores product images for catalog display

- **Access:** Public read, private write
- **Policy:** Only sellers can upload images for their products

---

### Row-Level Security (RLS) Policies

**Buyers:**
- Can view their own orders
- Can view all public products and categories
- Cannot modify products

**Sellers:**
- Can view their own products, orders, and verification status
- Can create and edit their own products
- Cannot view other sellers' data

**Admins:**
- Can view all data
- Can approve/reject seller verifications
- Can manage categories
- Can view all orders and activity logs

---

## Core Features

### 1. Authentication & User Management
**Status:** ✅ Complete

**Features:**
- Email/password registration and login
- Role-based account creation (buyer, seller, admin)
- Session persistence using Supabase Auth
- Automatic user profile creation
- Logout functionality
- Protected routes based on role

**Implementation:**
- `AuthContext.tsx` - Central auth state management
- `useAuth()` hook - Access auth state throughout app
- `ProtectedRoute` component - Enforce role requirements
- Redux store with auth slice - Persist user data

---

### 2. Product Catalog & Browsing
**Status:** ✅ Complete

**Features:**
- Browse all products with pagination (12 items/page)
- Search products by name, description, category
- Filter by category, price range
- Sort by price, date added, name
- Product detail page with full information
- Product images displayed from Supabase Storage
- Category-based navigation

**Key Components:**
- `CatalogPage.tsx` - Main browsing page
- `ProductDetailPage.tsx` - Individual product view
- `ProductCard.tsx` - Product display card
- `SearchOverlay.tsx` - Search UI

**Implementation Details:**
- Client-side search and filtering (optimized)
- URL query parameters preserve filter state
- Responsive grid layout
- Loading states and error handling

---

### 3. Shopping Cart
**Status:** ✅ Complete

**Features:**
- Add/remove products from cart
- Update product quantities
- Cart persistence (localStorage)
- Real-time cart total calculation
- Cart badge showing item count
- Cart sidebar view
- Clear visual feedback for empty cart

**Implementation:**
- `CartContext.tsx` - Cart state management
- `cartSlice.ts` - Redux cart persistence
- `CartSidebar.tsx` - Cart UI component
- `CartPage.tsx` - Dedicated cart view

**Data Structure:**
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  seller_id: string;
}
```

---

### 4. Checkout & Payment
**Status:** 🟡 Partially Complete

**Features:**
- Address selection/input
- Payment method selection (UI ready)
- Order summary with:
  - Itemized costs
  - Shipping fees (country-based)
  - Tax calculation (VAT for Sweden: 25%)
  - Total cost
- Estimated delivery date calculation
- Order confirmation page
- Email confirmation structure (requires Edge Functions)

**Key Components:**
- `CheckoutPage.tsx` - Main checkout flow
- `AddressSelector.tsx` - Address management
- `PaymentMethodSelector.tsx` - Payment options
- `CheckoutConfirmationPage.tsx` - Order confirmation

**Payment Methods Available:**
- Amazon Pay (UI)
- Apple Pay (UI)
- Klarna (UI)
- PayPal (UI)
- Visa (UI)
- Mastercard (UI)

**Pending:**
- Real payment processing integration
- Email sending via Edge Functions
- Webhook handling for payment confirmation

---

### 5. Seller Dashboard
**Status:** 🟡 Partially Complete

**Features:**
- Dashboard overview with statistics
- Product management (create, edit, delete)
- Order management and tracking
- Order status updates
- Seller verification process
- Revenue analytics (structure ready)

**Key Pages:**
- `SellerDashboardPage.tsx` - Analytics & overview
- `SellerProductsPage.tsx` - Product list
- `SellerProductEditPage.tsx` - Create/edit products
- `SellerOrdersPage.tsx` - Order management
- `SellerVerificationPage.tsx` - Seller registration

**Features:**
- Upload verification documents (ID, business license)
- Document storage in Supabase
- Await admin approval
- Once verified, can create and list products

---

### 6. Order Management
**Status:** 🟡 Partially Complete

**Features:**

**For Buyers:**
- View order history with pagination
- Track individual orders
- See order status (pending, confirmed, shipped, delivered)
- View order details and items
- Estimated delivery dates
- Order cancellation (structure ready)

**For Sellers:**
- See all orders for their products
- Update order status
- Print/download order details
- Track fulfillment

**For Admins:**
- Monitor all platform orders
- Filter and search orders
- View order details
- See buyer and seller information
- Audit trail of status changes

**Key Pages:**
- `BuyerOrdersPage.tsx` - Buyer order history
- `OrderDetailPage.tsx` - Order tracking
- `SellerOrdersPage.tsx` - Seller order management
- `AdminOrdersPage.tsx` - Admin order overview

---

### 7. Admin Dashboard
**Status:** 🟡 Partially Complete

**Features:**
- Platform statistics overview
- Seller management and approval
- Product moderation
- Category management
- Order monitoring
- Activity audit log
- User management (structure ready)

**Key Pages:**
- `AdminDashboardPage.tsx` - Stats & overview
- `AdminSellersPage.tsx` - Seller verification
- `AdminProductsPage.tsx` - Product moderation
- `AdminCategoriesPage.tsx` - Category management
- `AdminOrdersPage.tsx` - Order monitoring
- `AdminActivityPage.tsx` - Audit logs

---

### 8. Seller Storefronts
**Status:** ✅ Complete (Basic)

**Features:**
- Public seller profile page
- View all products from a seller
- Seller information and ratings (structure ready)
- Direct product browsing by seller

**Implementation:**
- `SellerProfilePage.tsx`
- Public access for all users

---

### 9. User Profiles
**Status:** 🟡 Partially Complete

**Features:**
- View/edit personal information
- Address management
- Order history quick access
- Saved preferences (structure ready)

**Implementation:**
- `CustomerProfilePage.tsx` for buyers
- Seller profile in dashboard

---

### 10. Search & Filtering
**Status:** ✅ Complete

**Features:**
- Multi-word search across product names/descriptions
- Category filtering
- Price range filtering
- Sorting options (price, date, name)
- URL-based filter persistence
- Real-time result updates

**Implementation:**
- Client-side search (optimized for MVP)
- URL query parameter state management
- `SearchOverlay.tsx` for search UI

---

## Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── MainLayout (wraps public pages)
│   │   ├── Navigation
│   │   ├── Route Content
│   │   └── Footer
│   │
│   ├── SellerDashboardShell (wraps seller pages)
│   │   ├── Seller Navigation
│   │   ├── Sidebar Menu
│   │   └── Route Content
│   │
│   └── AdminShell (wraps admin pages)
│       ├── Admin Navigation
│       ├── Sidebar Menu
│       └── Route Content
```

### Key Components

#### Layout Components

**MainLayout**
- Navigation with search
- Cart sidebar
- Mobile hamburger menu
- Footer with links
- Responsive design

```tsx
<MainLayout>
  <HomePage />
</MainLayout>
```

**SellerDashboardShell**
- Sidebar navigation
- Mobile menu
- Seller-specific context

```tsx
<SellerDashboardShell>
  <SellerDashboardPage />
</SellerDashboardShell>
```

**AdminShell**
- Sidebar navigation with all admin sections
- Mobile menu
- Admin-only context

---

#### Form Components

**LoginForm**
- Email/password inputs
- Form validation (Zod)
- Error messages
- Remember me (optional)

**RegisterForm**
- Full name, email, password inputs
- Role selection (buyer/seller)
- Terms acceptance
- Form validation
- Success/error handling

**ProductForm**
- Product name, description
- Price input
- Category selection
- Image upload
- Stock quantity
- Save/cancel actions

---

#### UI Components

**Button**
```tsx
<Button variant="primary" size="lg">Click me</Button>
<Button variant="secondary" size="sm">Click me</Button>
<Button variant="outline">Click me</Button>
```

**Input**
```tsx
<Input 
  type="email"
  placeholder="Enter email"
  register={register('email')}
  error={errors.email?.message}
/>
```

**Modal**
```tsx
<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

**LoadingSpinner**
```tsx
<LoadingSpinner fullScreen text="Loading..." />
```

**ImageUpload**
```tsx
<ImageUpload 
  onUpload={handleImageUpload}
  bucket="product-images"
  accept="image/*"
/>
```

---

## State Management

### Redux Store

**Structure:**
```
store/
├── authSlice.ts    # Auth state (user, role, loading)
├── cartSlice.ts    # Cart state (items, total)
└── notificationSlice.ts # Notifications
```

### Auth State
```typescript
interface AuthState {
  user: User | null;
  role: 'buyer' | 'seller' | 'admin' | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setUser(user)` - Set authenticated user
- `setRole(role)` - Set user role
- `setLoading(loading)` - Loading state
- `logout()` - Clear user data
- `setError(error)` - Error handling

### Cart State
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  seller_id: string;
}
```

**Actions:**
- `addItem(item)` - Add product to cart
- `removeItem(productId)` - Remove from cart
- `updateQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Empty cart
- `setCartOpen(isOpen)` - Toggle cart sidebar

### Local Storage Persistence
- Cart state is persisted to localStorage
- Survives page refreshes
- Cleared on logout

---

## Authentication & Authorization

### Authentication Flow

**1. Registration**
```
User submits form
    ↓
Validate input with Zod
    ↓
Create Supabase Auth account
    ↓
Create user profile in DB with role
    ↓
Redirect to dashboard/login
```

**2. Login**
```
User submits credentials
    ↓
Supabase Auth verifies
    ↓
AuthContext fetches role from DB
    ↓
Set Redux store with user data
    ↓
Redirect to appropriate dashboard
```

**3. Session Persistence**
```
App loads
    ↓
Check Supabase session
    ↓
If session exists:
  - Fetch user role from DB
  - Set Redux state
  - Persist cart from localStorage
    ↓
Else:
  - Show public pages only
```

### Authorization

**Protected Routes:**
- `/catalog` - Any authenticated user
- `/buyer/*` - Only buyers (redirects others)
- `/seller/*` - Only verified sellers (redirects others)
- `/admin/*` - Only admins (redirects others)

**Data Access:**
- Enforced at database level with RLS policies
- Users can only read/write their own data
- Admins have read access to all data

---

## User Roles & Features

### 👤 Buyer Role

**Permissions:**
- Register as buyer (default)
- Browse all products and categories
- Search and filter products
- View seller storefronts
- Add/remove products from cart
- Complete checkout
- Place orders
- View own orders and status
- Update own profile
- Download order receipts (pending)

**Pages:**
- `/catalog` - Product browsing
- `/products/:id` - Product details
- `/sellers/:id` - Seller profile
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/orders/:id` - Order tracking
- `/profile` - Customer profile

---

### 🧑‍🍳 Seller Role

**Permissions:**
- Register as seller
- Upload verification documents (ID, business license)
- Wait for admin approval
- Once verified: create and list products
- Edit/delete own products
- View own orders
- Update order status
- View analytics/reports
- Manage inventory

**Pages:**
- `/seller/verification` - Registration & upload
- `/seller/dashboard` - Analytics & overview
- `/seller/products` - Product management
- `/seller/products/new` - Create product
- `/seller/products/:id/edit` - Edit product
- `/seller/orders` - Order management

**Verification Process:**
1. Fill registration form with business details
2. Upload verification documents
3. Submit for admin review
4. Wait for approval
5. Once approved, can create products

---

### 🛡️ Admin Role

**Permissions:**
- View all sellers and verification requests
- Approve/reject seller verifications
- Manage product categories
- Monitor all orders
- View activity logs
- Manage products (moderate/remove)
- Manage users
- View platform analytics

**Pages:**
- `/admin/dashboard` - Overview & statistics
- `/admin/sellers` - Seller management & approval
- `/admin/products` - Product moderation
- `/admin/categories` - Category management
- `/admin/orders` - Order monitoring
- `/admin/activity` - Audit logs

---

## API Integration

### Supabase Client

**Initialization:**
```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)
```

### Key Operations

**Authentication:**
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
const { error } = await supabase.auth.signOut()
```

**Database Queries:**
```typescript
// Fetch products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .range(0, 11)

// Insert order
const { data, error } = await supabase
  .from('orders')
  .insert([{ buyer_id, seller_id, total_amount, ... }])

// Update order status
const { error } = await supabase
  .from('orders')
  .update({ status: 'shipped' })
  .eq('id', orderId)
```

**Storage Operations:**
```typescript
// Upload image
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${filename}`, file)

// Upload verification document
const { data, error } = await supabase.storage
  .from('seller_docs')
  .upload(`verifications/${filename}`, file)

// Get public URL
const url = supabase.storage
  .from('product-images')
  .getPublicUrl(path)
```

**Real-time Subscriptions (Ready):**
```typescript
// Subscribe to order updates
const subscription = supabase
  .from('orders')
  .on('*', payload => {
    console.log('Order updated:', payload)
  })
  .subscribe()
```

---

## Styling & Theming

### Design System

**Color Palette:**
- **Primary Brown:** `#8B4513` (Chocolate brown)
- **Cream/Gold:** `#F5DEB3` (Accent)
- **Dark:** `#2C1810` (Text)
- **Light:** `#FAF9F6` (Background)
- **Accent Green:** `#5D7B5E` (Highlights)

### CSS Modules

Each component has a companion `.module.css` file:

```css
/* Button.module.css */
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary {
  background-color: #8B4513;
  color: white;
}

.primary:hover {
  background-color: #6B3410;
}
```

### Responsive Design

**Breakpoints:**
```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

**Mobile Navigation:**
- Hamburger menu on small screens
- Full navigation on desktop
- Overlay backdrop for menu

---

## Internationalization (i18n)

### Supported Languages
- 🇬🇧 English (en)
- 🇩🇪 Deutsch (de)

### Setup

**Configuration:**
```typescript
// lib/i18n.ts
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      de: { translation: deTranslation }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })
```

### Usage

**In Components:**
```tsx
import { useTranslation } from 'react-i18next'

export const HomePage = () => {
  const { t, i18n } = useTranslation()

  return (
    <h1>{t('homepage.welcome')}</h1>
    <button onClick={() => i18n.changeLanguage('de')}>
      Deutsch
    </button>
  )
}
```

**Translation Files:**
```json
// locales/en/common.json
{
  "homepage": {
    "welcome": "Welcome to Chocolata",
    "browseCatalog": "Browse our catalog"
  }
}
```

### Language Detection
- Auto-detects browser language
- Persists user selection
- Falls back to English

---

## Testing

### End-to-End (E2E) Testing with Playwright

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
})
```

### Test Structure

**Buyer Tests** (`tests/e2e/buyer/`)
- Authentication flows
- Product browsing
- Search and filtering
- Cart operations
- Checkout process
- Order confirmation

**Seller Tests** (`tests/e2e/seller/`)
- Seller registration
- Document upload
- Product creation/editing
- Order management
- Dashboard functionality

**Admin Tests** (`tests/e2e/admin/`)
- Seller approval process
- Category management
- Order monitoring
- Activity logs
- Product moderation

**Example Test:**
```typescript
// tests/e2e/buyer/browsing.spec.ts
import { test, expect } from '@playwright/test'

test('browse products', async ({ page }) => {
  await page.goto('/catalog')
  
  const products = await page.locator('[data-testid="product-card"]')
  await expect(products).toHaveCount(12)
  
  const firstProduct = products.first()
  await firstProduct.click()
  
  await expect(page).toHaveURL(/\/products\//)
})
```

---

## Deployment

### Environment Variables

**Required for Development:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Vercel Deployment Setup:**

1. **Add to Vercel:**
   - Go to Vercel dashboard
   - Click "New Project"
   - Connect GitHub repository
   - Select `main` branch

2. **Environment Variables in Vercel:**
   - Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

3. **Build Configuration:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

### Build Process

```bash
# Local build
npm run build
# Creates optimized bundle in dist/

# Preview build locally
npm run preview

# Run dev server
npm run dev
```

### Performance Optimizations
- Code splitting with Vite
- Image optimization (lazy loading)
- CSS minification
- Tree-shaking unused code
- Bundle analysis ready

---

## Development Workflow

### Local Development

**Setup:**
```bash
# 1. Clone repository
git clone https://github.com/mahdi475/ChocolataMVP.git
cd ChocolataMVP

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start dev server
npm run dev
# Opens http://localhost:3000
```

**Available Scripts:**
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm test              # Run E2E tests
npm test:ui           # Run tests with UI
```

---

## Project Phases & Roadmap

### Phase 0: Foundation ✅
- ✅ Project setup
- ✅ Database schema
- ✅ Authentication
- ✅ Storage setup
- ✅ UI components

### Phase 1: Core Buyer Features ✅
- ✅ Product browsing
- ✅ Search & filtering
- ✅ Shopping cart
- ✅ Checkout flow (structure)
- ✅ Order management (basic)

### Phase 2: Seller Features 🟡
- 🟡 Seller registration
- ✅ Product management
- 🟡 Order management
- ⏳ Analytics

### Phase 3: Admin Features 🟡
- ✅ Seller approval
- ✅ Product moderation
- ✅ Category management
- 🟡 Activity logs

### Phase 4: Email & Notifications ⏳
- ⏳ Email sending (Edge Functions)
- ⏳ Order confirmations
- ⏳ Status updates
- ⏳ Notifications

### Phase 5: Payment Integration ⏳
- ⏳ Payment processing
- ⏳ Webhook handling
- ⏳ Payment confirmation

### Phase 6: Enhanced Features ⏳
- ⏳ Reviews & ratings
- ⏳ Seller messaging
- ⏳ Chocolate Passport
- ⏳ Wishlists
- ⏳ Seasonal themes

### Phase 7: Quality Assurance ⏳
- 🟡 E2E testing
- ⏳ Performance optimization
- ⏳ Security audit

### Phase 8: Launch & Production ⏳
- ⏳ Final deployment
- ⏳ Monitoring setup
- ⏳ Support channels

---

## Future Enhancements (Post-MVP)

### Features in Backlog
1. **Reviews & Ratings** - Product reviews with star ratings
2. **Chocolate Passport** - Loyalty program with stamps
3. **Messaging System** - Direct seller-buyer communication
4. **Wishlists** - Save favorite products
5. **Advanced Analytics** - Detailed seller dashboards
6. **Recommendation Engine** - ML-based product suggestions
7. **Seasonal Themes** - Holiday-themed experiences
8. **Mobile App** - iOS/Android native apps
9. **Subscription Boxes** - Recurring shipments
10. **Affiliate Program** - Commission-based sales

### Technology Roadmap
- Supabase Edge Functions for serverless processing
- GraphQL API layer
- Redis caching
- CDN for images
- Advanced search with Elasticsearch
- Machine learning for recommendations

---

## Common Development Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Create CSS module file
3. Add route in `AppRouter.tsx`
4. Wrap with appropriate layout (MainLayout, SellerDashboardShell, etc.)
5. Add navigation link if needed

### Adding a New Component

1. Create component file in appropriate folder
2. Create CSS module file
3. Define TypeScript interfaces
4. Export component
5. Use in pages

### Adding Database Table

1. Create SQL migration in `supabase/`
2. Write RLS policies
3. Generate TypeScript types (if using Supabase CLI)
4. Update queries in components

### Fetching Data from Supabase

```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('column_name', value)
  .limit(10)

if (error) console.error('Error:', error)
else console.log('Data:', data)
```

### Adding a New Translation

1. Add key to `locales/en/common.json`
2. Add key to `locales/de/common.json`
3. Use in component: `const { t } = useTranslation()`
4. Reference as: `t('namespace.key')`

---

## Troubleshooting

### Common Issues

**Issue: User redirected after login**
- Check if role is properly set in `users` table
- Verify RLS policies allow role reading
- Check browser console for auth errors

**Issue: Cart not persisting**
- Ensure localStorage is enabled
- Check Redux store subscription in `store/index.ts`
- Verify cart slice is correctly configured

**Issue: Products not loading**
- Check Supabase connection in browser console
- Verify RLS policies allow product reads
- Check network requests in DevTools
- Ensure products exist in database

**Issue: Images not displaying**
- Verify image URL format (should be Supabase URL)
- Check storage bucket permissions
- Ensure images are uploaded correctly
- Check CORS settings in Supabase

---

## Security Considerations

### Frontend Security
- ✅ Input validation with Zod
- ✅ XSS protection via React
- ✅ CSRF protection via Supabase
- ✅ Secure session management
- ✅ Protected routes by role

### Backend Security
- ✅ Row-Level Security (RLS) policies
- ✅ Email verification for signup
- ✅ Password hashing by Supabase
- ✅ Token-based authentication
- ✅ Storage permissions

### Environment Security
- ✅ Environment variables for secrets
- ✅ Separate .env.example (no actual secrets)
- ✅ No secrets in version control
- ✅ Vercel secrets management

### Best Practices
- Never commit `.env` file
- Rotate Supabase keys regularly
- Monitor activity logs
- Keep dependencies updated
- Test before production deployment

---

## Performance Metrics

### Target Performance Goals
- Page load time: < 2 seconds
- Lighthouse score: > 90
- Database queries: < 100ms
- Bundle size: < 500KB (gzipped)

### Optimization Techniques
- Lazy loading routes
- Code splitting
- Image optimization
- CSS minification
- Database query optimization
- Caching strategies
- CDN for static assets

---

## Support & Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Playwright Docs](https://playwright.dev)
- [i18next Docs](https://www.i18next.com)

### Key Files Reference
- Authentication: `src/contexts/AuthContext.tsx`
- Routing: `src/routes/AppRouter.tsx`
- State: `src/store/index.ts`
- Supabase: `src/lib/supabaseClient.ts`
- i18n: `src/lib/i18n.ts`

---

## Conclusion

Chocolata MVP is a well-structured, scalable e-commerce platform built with modern web technologies. The codebase follows best practices for component organization, state management, and security. With a solid foundation in place, it's ready for feature expansion and production deployment.

**Next Priority Actions:**
1. Implement payment processing
2. Set up Supabase Edge Functions for emails
3. Complete E2E test coverage
4. Performance optimization
5. Production deployment to Vercel

---

*Last Updated: January 19, 2026*
*Built with ❤️ for Chocolate Lovers*
