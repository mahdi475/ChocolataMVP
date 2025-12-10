# Ultimate Roadmap: Chocolata MVP (Oompaloompa)

## Project Overview

**Chocolata** (branded as **Oompaloompa**) is a global e-commerce platform for chocolate products and gourmet foods, enabling small to large businesses to register, create storefronts, and sell products across Europe and globally. The platform includes a verification system to ensure all sellers are legitimate businesses or registered individuals.

**Tech Stack:**
- Frontend: React 18 + Vite + TypeScript + React Router
- Styling: CSS Modules + Framer Motion
- Forms: React Hook Form + Zod
- State: Redux Toolkit
- Backend: Supabase (Auth, Database, Storage)
- i18n: i18next (English, German)
- Testing: Playwright E2E

**Current Status:** Foundation Complete - Core MVP Features In Progress

**Supabase Status:**
- ✅ Database schema complete (all tables: users, products, orders, order_items, seller_verifications, categories, activity_log)
- ✅ Storage buckets configured (seller_docs, product-images)
- ✅ RLS policies and database functions implemented
- ⏳ Edge Functions infrastructure NOT yet set up (required for email/webhooks)

---

## Phase 0: Foundation & Infrastructure ✅

**Status:** ✅ **COMPLETE**

**Priority:** Critical  
**Estimated Time:** Completed

### 0.1 Project Setup ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Vite + React 18 + TypeScript configuration
- ✅ React Router v6 setup
- ✅ Redux Toolkit store configuration
- ✅ Supabase client initialization
- ✅ i18next configuration (English, German)
- ✅ Playwright test configuration
- ✅ ESLint and TypeScript configuration

**Implementation Notes:**
- Project structure established in `src/`
- Test utilities in `tests/utils/`
- Environment variables configured for Supabase

### 0.2 Database Schema ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ `users` table with role-based access (buyer, seller, admin)
- ✅ `products` table with seller relationship
- ✅ `orders` and `order_items` tables
- ✅ `seller_verifications` table
- ✅ `categories` table
- ✅ `activity_log` table for admin tracking
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Database functions (`create_order`, `decrement_product_stock`)
- ✅ Indexes for performance optimization
- ✅ Triggers for `updated_at` timestamps

**Implementation Notes:**
- Schema defined in `supabase-setup.sql`
- **Confirmed:** All core tables exist in Supabase:
  - `users`, `products`, `orders`, `order_items`
  - `seller_verifications`, `categories`, `activity_log`
- RLS policies ensure data security
- Database functions (`create_order`, `decrement_product_stock`) handle order creation atomically
- Activity logging triggers implemented
- **Note:** Supabase Edge Functions infrastructure NOT yet set up (needed for email/webhooks)

### 0.3 Authentication System ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Supabase Auth integration
- ✅ User registration with role assignment
- ✅ Login/logout functionality
- ✅ Protected routes with role-based access
- ✅ AuthContext for global auth state
- ✅ Automatic user profile creation trigger
- ✅ Session persistence

**Implementation Notes:**
- Auth handled via `src/contexts/AuthContext.tsx`
- Protected routes in `src/routes/AppRouter.tsx`
- Role-based redirects implemented
- User profile auto-created on signup

### 0.4 Storage Setup ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ `seller_docs` bucket for verification documents
- ✅ `product-images` bucket for product photos
- ✅ Storage policies configured
- ✅ Image upload component (`ImageUpload.tsx`)

**Implementation Notes:**
- Storage buckets created via SQL scripts (`supabase-storage-setup.sql`)
- RLS policies on storage buckets
- Image upload functionality in `src/components/ui/ImageUpload.tsx`
- Buckets configured and accessible for document/product image uploads

### 0.5 UI Component Library ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Button component with variants
- ✅ Input component with validation
- ✅ Modal component
- ✅ Card component
- ✅ LoadingSpinner component
- ✅ Toast/Notification system
- ✅ ImageUpload component
- ✅ CSS Modules styling

**Implementation Notes:**
- Components in `src/components/ui/`
- Consistent styling with CSS Modules
- Toast notifications via Redux store

---

## Phase 1: Core Buyer Features

**Status:** 🟡 **PARTIALLY COMPLETE**  
**Priority:** Critical  
**Estimated Time Remaining:** 2-3 weeks

### 1.1 User Registration & Login ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Registration form with validation (React Hook Form + Zod)
- ✅ Login form with error handling
- ✅ Role selection during registration (buyer by default)
- ✅ Email/password authentication
- ✅ Form validation and error messages
- ✅ i18n support (English, German)

**Implementation Notes:**
- Forms in `src/components/forms/RegisterForm.tsx` and `LoginForm.tsx`
- Validation schemas using Zod
- Translation keys in `src/locales/*/auth.json`

### 1.2 Product Catalog & Browsing ✅

**Status:** ✅ **COMPLETE**

**Priority:** Critical  
**Estimated Time:** Completed

**Current Implementation:**
- ✅ Catalog page (`CatalogPage.tsx`) with real Supabase data
- ✅ Product cards with images, pricing, stock info
- ✅ Real product data from Supabase database
- ✅ Advanced filtering (category, price range)
- ✅ Enhanced multi-word search functionality
- ✅ Sorting options (price, date, name)
- ✅ Pagination (12 items per page)
- ✅ URL query parameter persistence
- ✅ Category breadcrumbs navigation
- ✅ Product counts per category
- ✅ Image lazy loading and fallbacks
- ✅ Image lightbox for product detail page

**Remaining Tasks:**

**Step 1.2.1: Real Product Data Integration** ✅
- ✅ Replace mock data with Supabase queries
- ✅ Implement pagination for large product lists (12 items per page)
- ✅ Add loading states and error handling
- ✅ Proper error messages and fallback handling
- Note: Client-side caching via React state (consider React Query for advanced caching in future)

**Step 1.2.2: Enhanced Search & Filtering** ✅
- ✅ Enhanced multi-word search on product names/descriptions/categories
- ✅ Price range filtering (min/max)
- ✅ Sorting options (price, date, name) - all implemented
- ✅ Persist filter state in URL query parameters
- ⏳ Country/region filtering (deferred - requires seller location data)
- Note: Client-side search implemented. PostgreSQL full-text search can be added later for better performance at scale.

**Step 1.2.3: Product Images** ✅
- ✅ Display product images from Supabase Storage (via image_url)
- ✅ Image fallbacks for missing images (placeholder with emoji)
- ✅ Image lazy loading (native browser lazy loading)
- ✅ Image gallery/lightbox for product detail page
- ✅ Error handling for failed image loads

**Step 1.2.4: Category Navigation** ✅
- ✅ Display category list/filter (with product counts)
- ✅ Category breadcrumbs navigation
- ✅ Show product counts per category in dropdown
- ⏳ Category hierarchy (not needed for MVP - flat structure sufficient)

**Deliverables:**
- Fully functional catalog with real data
- Advanced search and filtering
- Product image display
- Category navigation

**Success Criteria:**
- ✅ Products load from database
- ✅ Search works accurately (multi-word support)
- ✅ Filters can be combined
- ✅ Images display correctly with fallbacks
- ✅ Performance is acceptable (<2s load time)
- ✅ URL parameters persist filter state
- ✅ Category navigation with breadcrumbs and counts

### 1.3 Product Detail Page ✅

**Status:** ✅ **COMPLETE**

**Priority:** Critical  
**Estimated Time:** Completed

**Current Implementation:**
- ✅ Product detail page (`ProductDetailPage.tsx`) with full functionality
- ✅ Product information display with seller info
- ✅ Add to cart functionality
- ✅ Image lightbox for full-size viewing
- ✅ Seller information display with link to seller profile
- ✅ Related products section (same seller + same category)
- ✅ Category link to filtered catalog
- ✅ Stock availability display

**Step 1.3.1: Enhanced Product Display** ✅
- ✅ Display product images with lightbox (single image - multiple images can be added later)
- ✅ Show seller information and link to seller profile (`/seller/:id`)
- ✅ Display stock availability with visual indicators
- ⏳ Product ratings/reviews (deferred - Phase 6.3)
- ⏳ "Contact Seller" button (deferred - Phase 6.2)

**Step 1.3.2: Related Products** ✅
- ✅ Show products from same seller (up to 4)
- ✅ Show products in same category (up to 4, excluding seller's own)
- ✅ Basic recommendation algorithm (prioritizes seller products, then category)
- ✅ Deduplication of related products
- ✅ Responsive grid layout

**Step 1.3.3: Product Variants** ⏳
- ⏳ Support product variants (size, flavor, etc.) - deferred for MVP
- ⏳ Variant selection UI - deferred for MVP
- ⏳ Price updates based on variant - deferred for MVP
- Note: Variants can be added as separate products for MVP simplicity

**Deliverables:**
- ✅ Complete product detail page
- ✅ Seller information display with profile link
- ✅ Related products section
- ✅ Seller profile page (`SellerProfilePage.tsx`)

**Success Criteria:**
- ✅ All product info displays correctly
- ✅ Images load properly with lightbox
- ✅ Add to cart works
- ✅ Seller info is accessible via link
- ✅ Related products show relevant suggestions

### 1.4 Shopping Cart ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Cart state management (Redux)
- ✅ Add/remove items
- ✅ Quantity updates
- ✅ Cart persistence (localStorage)
- ✅ Cart page UI (`CartPage.tsx`)
- ✅ Cart total calculation

**Implementation Notes:**
- Cart managed via `src/contexts/CartContext.tsx` and Redux store
- Items persist in localStorage
- Cart page shows items with quantities and totals

### 1.5 Checkout Flow ✅

**Status:** ✅ **COMPLETE**

**Priority:** Critical  
**Estimated Time:** Completed

**Current Implementation:**
- ✅ Enhanced checkout form (`CheckoutPage.tsx`)
- ✅ Shipping address collection with saved addresses
- ✅ Order creation via RPC function
- ✅ Stock validation before checkout
- ✅ Order confirmation page
- ✅ Payment method selection (Card, Klarna, PayPal)
- ✅ Payment processing (mock implementation ready for Stripe/PayPal/Klarna)
- ✅ Address management with saved addresses
- ✅ Enhanced order summary with shipping, taxes, delivery date
- ✅ Email confirmation structure (ready for Edge Functions)

**Step 1.5.1: Payment Integration** ✅
- ✅ Payment method selection UI (Card, Klarna, PayPal)
- ✅ Payment processing function (mock - ready for real integration)
- ✅ Process payment before order creation
- ✅ Handle payment failures gracefully
- ✅ Store payment transaction ID in orders table
- ⏳ Real Stripe/PayPal/Klarna integration (requires API keys and Edge Functions)
- Note: Mock payment processor implemented. Replace `processPayment()` in `src/lib/payment.ts` with real Stripe/PayPal/Klarna SDK calls.

**Step 1.5.2: Address Management** ✅
- ✅ Save shipping addresses to `user_addresses` table
- ✅ Multiple saved addresses support
- ✅ Address selector component with saved addresses
- ✅ Default address selection
- ⏳ Address autocomplete (Google Maps API) - deferred for MVP
- ✅ Basic address validation via Zod schema

**Step 1.5.3: Order Summary Enhancement** ✅
- ✅ Detailed order breakdown (subtotal, shipping, tax, total)
- ✅ Shipping cost calculation (free shipping over 500 SEK, country-based rates)
- ✅ Tax calculation (VAT for Sweden: 25%)
- ✅ Estimated delivery date calculation (country-based)
- ✅ Visual display of all costs in order summary

**Step 1.5.4: Email Confirmation** ✅
- ✅ Email sending function structure (`src/lib/email.ts`)
- ✅ HTML email template generator
- ✅ Order confirmation email data structure
- ✅ Email sent after order creation (non-blocking)
- ⏳ Actual email sending (requires Supabase Edge Functions + Resend/SendGrid)
- Note: Email structure ready. Set up Edge Function and connect to email service when Edge Functions are available.

**Deliverables:**
- ✅ Payment integration UI and processing structure
- ✅ Address management system
- ✅ Enhanced order summary
- ✅ Email confirmation structure

**Success Criteria:**
- ✅ Payment methods can be selected
- ✅ Payments process (mock) before order creation
- ✅ Orders include payment and shipping details
- ✅ Email structure ready (sending requires Edge Functions)
- ✅ Addresses can be saved and reused
- ✅ Order summary shows all costs and delivery date

### 1.6 Order History & Tracking 🟡

**Status:** 🟡 **PARTIALLY COMPLETE**

**Priority:** High  
**Estimated Time:** 1 week

**Current Implementation:**
- ✅ Order list page (`BuyerOrdersPage.tsx`)
- ✅ Order detail page (`OrderDetailPage.tsx`)
- ✅ Order status display

**Remaining Tasks:**

**Step 1.6.1: Order Status Updates** ⏳
- Real-time order status updates
- Status change notifications
- Order tracking timeline
- Delivery status integration

**Step 1.6.2: Order Actions** ⏳
- Cancel order functionality (if allowed)
- Return/refund request
- Reorder functionality
- Download invoice/receipt

**Step 1.6.3: Order Filtering** ⏳
- Filter by status
- Filter by date range
- Search orders
- Sort orders

**Deliverables:**
- Complete order management
- Status tracking
- Order actions
- Filtering and search

**Success Criteria:**
- Users can view all orders
- Status updates are visible
- Orders can be filtered
- Actions work correctly

---

## Phase 2: Seller Features

**Status:** 🟡 **PARTIALLY COMPLETE**  
**Priority:** Critical  
**Estimated Time Remaining:** 2-3 weeks

### 2.1 Seller Registration & Verification ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Seller verification page (`SellerVerificationPage.tsx`)
- ✅ Document upload functionality
- ✅ Verification status tracking
- ✅ Admin approval workflow

**Implementation Notes:**
- Sellers upload business documents to `seller_docs` bucket
- Verification status stored in `seller_verifications` table
- Admin can approve/reject via `AdminSellersPage.tsx`

### 2.2 Seller Dashboard ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Dashboard shell (`SellerDashboardShell.tsx`)
- ✅ Dashboard stats (products, orders, verification status)
- ✅ Navigation menu
- ✅ Basic dashboard page (`SellerDashboardPage.tsx`)

**Implementation Notes:**
- Dashboard shows product count, order count, verification status
- Navigation to products, orders, verification pages

### 2.3 Product Management 🟡

**Status:** 🟡 **PARTIALLY COMPLETE**

**Priority:** Critical  
**Estimated Time:** 1 week

**Current Implementation:**
- ✅ Product list page (`SellerProductsPage.tsx`)
- ✅ Product form (`ProductForm.tsx`)
- ✅ Create/edit product pages
- ✅ Delete product functionality
- ✅ Image upload to Supabase Storage

**Remaining Tasks:**

**Step 2.3.1: Product Form Enhancements** ⏳
- Add product variants support
- Multiple image uploads
- Rich text description editor
- SEO fields (meta title, description)
- Product tags/keywords

**Step 2.3.2: Bulk Operations** ⏳
- Bulk edit products
- Bulk delete
- Bulk status change (activate/deactivate)
- Import products from CSV

**Step 2.3.3: Product Analytics** ⏳
- View count per product
- Sales statistics per product
- Stock alerts (low stock notifications)
- Best-selling products

**Step 2.3.4: Product Validation** ⏳
- Ensure seller is verified before allowing product creation
- Validate product data before submission
- Prevent duplicate products

**Deliverables:**
- Enhanced product form
- Bulk operations
- Product analytics
- Validation rules

**Success Criteria:**
- Sellers can manage products easily
- Bulk operations work
- Analytics are accurate
- Validation prevents errors

### 2.4 Seller Profile Management ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 2.4.1: Seller Profile Schema** ⏳
- Create `seller_profiles` table:
  - `user_id` (FK to users)
  - `company_name`
  - `company_description`
  - `logo_url`
  - `website_url`
  - `phone`
  - `address`
  - `country`
  - `tax_id` (optional)
  - `vat_number` (optional)

**Step 2.4.2: Profile Edit Page** ⏳
- Create seller profile edit page
- Form with all profile fields
- Logo upload functionality
- Company information fields
- Save/update functionality

**Step 2.4.3: Public Seller Page** ⏳
- Create public seller profile page (`/seller/:id`)
- Display seller information
- Show seller's products
- Display seller ratings/reviews (future)

**Deliverables:**
- Seller profile table
- Profile edit page
- Public seller page

**Success Criteria:**
- Sellers can update their profile
- Profile displays correctly
- Public page is accessible

### 2.5 Order Management for Sellers 🟡

**Status:** 🟡 **PARTIALLY COMPLETE**

**Priority:** High  
**Estimated Time:** 1 week

**Current Implementation:**
- ✅ Order list page (`SellerOrdersPage.tsx`)
- ✅ View orders assigned to seller

**Remaining Tasks:**

**Step 2.5.1: Order Status Management** ⏳
- Allow sellers to update order status
- Status workflow: pending → processing → shipped → completed
- Status change notifications to buyer
- Status change history/log

**Step 2.5.2: Order Details** ⏳
- Detailed order view
- Customer information
- Shipping address
- Order items with quantities
- Order total breakdown

**Step 2.5.3: Order Actions** ⏳
- Mark as shipped (with tracking number)
- Cancel order (with reason)
- Refund order
- Print shipping label (future)
- Export orders to CSV

**Step 2.5.4: Order Notifications** ⏳
- Email notification when new order received
- In-app notifications
- Order status change alerts

**Deliverables:**
- Order status management
- Detailed order views
- Order actions
- Notifications

**Success Criteria:**
- Sellers can manage orders
- Status updates work
- Notifications are sent
- Order details are complete

### 2.6 Seller Analytics & Reports ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Low  
**Estimated Time:** 1.5 weeks

**Detailed Steps:**

**Step 2.6.1: Sales Dashboard** ⏳
- Total sales (revenue)
- Number of orders
- Average order value
- Sales over time (chart)
- Top-selling products

**Step 2.6.2: Reports** ⏳
- Sales report (date range)
- Product performance report
- Customer report
- Export reports to CSV/PDF

**Deliverables:**
- Analytics dashboard
- Report generation
- Data visualization

**Success Criteria:**
- Analytics are accurate
- Reports can be generated
- Charts display correctly

---

## Phase 3: Admin Features

**Status:** 🟡 **PARTIALLY COMPLETE**  
**Priority:** High  
**Estimated Time Remaining:** 1-2 weeks

### 3.1 Admin Dashboard ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Admin shell (`AdminShell.tsx`)
- ✅ Dashboard page (`AdminDashboardPage.tsx`)
- ✅ Platform statistics (users, sellers, products, orders)
- ✅ Navigation menu

**Implementation Notes:**
- Dashboard shows platform-wide statistics
- Quick access to key admin functions

### 3.2 Seller Approval System ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Seller approvals page (`AdminSellersPage.tsx`)
- ✅ View verification documents
- ✅ Approve/reject sellers
- ✅ Update user role on approval
- ✅ Activity logging

**Implementation Notes:**
- Admin can view pending verifications
- Documents can be viewed/downloaded
- Approval updates user role to 'seller'
- All actions logged in activity_log

### 3.3 Product Management (Admin) ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Admin products page (`AdminProductsPage.tsx`)
- ✅ View all products
- ✅ Search/filter products
- ✅ Edit/delete products
- ✅ View seller information

**Implementation Notes:**
- Admin can manage all products
- Search by product name, seller email, etc.
- Can edit or delete any product

### 3.4 Order Management (Admin) ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Admin orders page (`AdminOrdersPage.tsx`)
- ✅ View all orders
- ✅ Search orders (ID, user ID, name, email, address)
- ✅ Filter by status
- ✅ View order details
- ✅ Update order status

**Implementation Notes:**
- Comprehensive order search functionality
- Status filtering
- Order detail view
- Status update capability

### 3.5 Category Management ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Admin categories page (`AdminCategoriesPage.tsx`)
- ✅ Create/edit/delete categories
- ✅ Category list display

**Implementation Notes:**
- Admin can manage product categories
- Categories used for product organization

### 3.6 Activity Log ✅

**Status:** ✅ **COMPLETE**

**Deliverables:**
- ✅ Activity log page (`AdminActivityPage.tsx`)
- ✅ Track all platform changes
- ✅ Filter by action type, user, table
- ✅ View change details

**Implementation Notes:**
- Activity log tracks product, order, and verification changes
- Logs include user info, action type, and data changes
- Useful for auditing and debugging

### 3.7 User Management ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 3.7.1: User List Page** ⏳
- Create admin user management page
- List all users with roles
- Search users by email, name
- Filter by role

**Step 3.7.2: User Actions** ⏳
- View user details
- Edit user role
- Suspend/ban users
- View user's orders/products
- Delete user (with caution)

**Step 3.7.3: User Statistics** ⏳
- Total users count
- Users by role
- New users over time
- Active users

**Deliverables:**
- User management page
- User actions
- User statistics

**Success Criteria:**
- Admin can manage users
- User data is accurate
- Actions are logged

---

## Phase 4: Email & Notifications

**Status:** ⏳ **NOT STARTED**  
**Priority:** High  
**Estimated Time:** 2 weeks

### 4.1 Email Service Setup ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** High  
**Estimated Time:** 3 days

**Detailed Steps:**

**Step 4.1.1: Email Provider Integration** ⏳
- Choose email service (Resend, SendGrid, or Supabase Email)
- Set up API keys in environment variables
- Create email service utility
- Test email delivery

**Step 4.1.2: Email Templates** ⏳
- Design HTML email templates
- Create templates for:
  - Order confirmation
  - Order status updates
  - Seller approval/rejection
  - Password reset (if needed)
  - Welcome email

**Step 4.1.3: Email Sending Functions** ✅ (Code Ready, Not Deployed)
- ✅ Edge Function code written (`supabase/functions/send-order-email/index.ts`)
- ✅ Edge Function code written (`supabase/functions/send-order-status-email/index.ts`)
- ✅ Frontend integration ready (`src/lib/email.ts`)
- ⏳ **Not yet deployed** - Requires Supabase Edge Functions setup
- ⏳ Resend API not configured
- ⏳ Functions not deployed to Supabase
- Note: See `FUTURE_EDGE_FUNCTIONS_IMPLEMENTATION.md` for implementation guide

**Deliverables:**
- Email service configured
- Email templates
- Sending functions

**Success Criteria:**
- Emails send successfully
- Templates render correctly
- Emails are delivered reliably

### 4.2 Order Notifications ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** High  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 4.2.1: Order Confirmation Email** ⏳
- Send to buyer when order is placed
- Include order details, items, total
- Include order ID and tracking info
- Link to order detail page

**Step 4.2.2: Order Status Update Emails** ⏳
- Send when seller updates order status
- Include status change and reason (if any)
- Include tracking number (if shipped)
- Link to order tracking page

**Step 4.2.3: New Order Notification to Seller** ⏳
- Send to seller when new order is placed
- Include order details and customer info
- Link to seller order management page

**Deliverables:**
- Order confirmation emails
- Status update emails
- Seller notifications

**Success Criteria:**
- Emails sent at correct times
- Content is accurate
- Links work correctly

### 4.3 Seller Verification Notifications ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 2 days

**Detailed Steps:**

**Step 4.3.1: Verification Submitted Email** ⏳
- Send to seller when verification is submitted
- Confirm document received
- Set expectations for review time

**Step 4.3.2: Approval/Rejection Emails** ⏳
- Send approval email with next steps
- Send rejection email with reason
- Include links to relevant pages

**Deliverables:**
- Verification notification emails

**Success Criteria:**
- Sellers receive notifications
- Messages are clear

### 4.4 In-App Notifications ⏳

**Status:** 🟡 **PARTIALLY COMPLETE**

**Priority:** Medium  
**Estimated Time:** 1 week

**Current Implementation:**
- ✅ Toast notification system
- ✅ Notification Redux slice

**Remaining Tasks:**

**Step 4.4.1: Notification Center** ⏳
- Create notification dropdown/bell icon
- Store notifications in database
- Mark as read/unread
- Notification history

**Step 4.4.2: Real-time Notifications** ⏳
- Use Supabase Realtime for live updates
- Show notifications when events occur
- Sound/visual alerts (optional)

**Deliverables:**
- Notification center UI
- Database storage
- Real-time updates

**Success Criteria:**
- Notifications display correctly
- Real-time updates work
- Users can manage notifications

---

## Phase 5: Payment Integration

**Status:** ⏳ **NOT STARTED**  
**Priority:** Critical  
**Estimated Time:** 2-3 weeks

### 5.1 Payment Gateway Selection ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Critical  
**Estimated Time:** 3 days

**Detailed Steps:**

**Step 5.1.1: Research & Decision** ⏳
- Evaluate payment providers:
  - Stripe (recommended for Europe)
  - PayPal
  - Klarna (for buy-now-pay-later)
  - Swish (for Sweden)
- Consider multi-provider support
- Check fees and integration complexity

**Step 5.1.2: Account Setup** ⏳
- Create payment provider account
- Get API keys
- Configure webhooks
- Set up test environment

**Deliverables:**
- Payment provider selected
- Account configured
- Test credentials obtained

**Success Criteria:**
- Provider supports required features
- Test mode works
- Webhooks configured

### 5.2 Payment Processing ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Critical  
**Estimated Time:** 1.5 weeks

**Detailed Steps:**

**Step 5.2.1: Payment UI Components** ⏳
- Create payment method selection component
- Integrate payment provider SDK
- Create payment form
- Handle payment errors

**Step 5.2.2: Payment Flow** ⏳
- Process payment before order creation
- Handle payment success/failure
- Store payment transaction ID
- Link payment to order

**Step 5.2.3: Webhook Handling** ⏳
- **Step 5.2.3: Webhook Handling** ✅ (Code Ready, Not Deployed)
- ✅ Edge Function code written (`supabase/functions/payment-webhook/index.ts`)
- ✅ Supports Stripe, PayPal webhooks
- ⏳ **Not yet deployed** - Requires Supabase Edge Functions setup
- ⏳ Payment provider webhooks not configured
- Note: See `FUTURE_EDGE_FUNCTIONS_IMPLEMENTATION.md` for implementation guide
- Handle payment confirmations
- Handle refunds
- Update order status based on payment
- Alternative: Use external webhook handler service if Edge Functions not available

**Step 5.2.4: Security** ⏳
- Never store card details
- Use payment provider's secure forms
- Validate payments server-side
- Implement idempotency

**Deliverables:**
- Payment UI components
- Payment processing flow
- Webhook handlers
- Security measures

**Success Criteria:**
- Payments process successfully
- Errors handled gracefully
- Webhooks work correctly
- Security best practices followed

### 5.3 Refund & Cancellation ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 5.3.1: Refund Functionality** ⏳
- Create refund request flow
- Process refunds via payment provider
- Update order status
- Notify buyer and seller

**Step 5.3.2: Cancellation Policy** ⏳
- Define cancellation rules
- Implement cancellation flow
- Process refunds if applicable
- Update inventory

**Deliverables:**
- Refund processing
- Cancellation flow

**Success Criteria:**
- Refunds process correctly
- Cancellations work
- Notifications sent

---

## Phase 6: Enhanced Features

**Status:** ⏳ **NOT STARTED**  
**Priority:** Medium  
**Estimated Time:** 3-4 weeks

### 6.1 Product Search Enhancement ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** High  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 6.1.1: Full-Text Search** ⏳
- Implement PostgreSQL full-text search
- Search product names, descriptions
- Search seller names
- Search categories

**Step 6.1.2: Search Filters** ⏳
- Price range
- Category
- Country/region
- Seller
- In stock only
- Sort options

**Step 6.1.3: Search UI** ⏳
- Advanced search page
- Search suggestions/autocomplete
- Recent searches
- Popular searches

**Deliverables:**
- Full-text search
- Advanced filters
- Search UI

**Success Criteria:**
- Search is fast and accurate
- Filters work correctly
- UI is intuitive

### 6.2 Contact Seller Feature ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 6.2.1: Messaging System** ⏳
- Create `messages` table
- Message thread between buyer and seller
- Real-time messaging (Supabase Realtime)
- Message notifications

**Step 6.2.2: Contact UI** ⏳
- "Contact Seller" button on product page
- Messaging interface
- Message history
- Email notifications for new messages

**Deliverables:**
- Messaging system
- Contact UI
- Notifications

**Success Criteria:**
- Buyers can contact sellers
- Messages are delivered
- Notifications work

### 6.3 Reviews & Ratings ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1.5 weeks

**Detailed Steps:**

**Step 6.3.1: Review Schema** ⏳
- Create `reviews` table:
  - `id`, `order_id`, `product_id`, `seller_id`
  - `buyer_id`, `rating` (1-5), `comment`
  - `created_at`, `updated_at`
- RLS policies

**Step 6.3.2: Review UI** ⏳
- Review form (after order completion)
- Display reviews on product page
- Display seller ratings
- Review moderation (admin)

**Step 6.3.3: Review Features** ⏳
- Average rating calculation
- Review helpfulness votes
- Review replies (seller)
- Review filtering/sorting

**Deliverables:**
- Review system
- Review UI
- Rating calculations

**Success Criteria:**
- Reviews can be submitted
- Reviews display correctly
- Ratings are accurate

### 6.4 Chocolate Passport Feature ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Low (Brand Feature)  
**Estimated Time:** 1.5 weeks

**Detailed Steps:**

**Step 6.4.1: Passport Schema** ⏳
- Create `passport_stamps` table:
  - `user_id`, `order_id`, `seller_id`
  - `country`, `stamp_date`, `product_category`
- Track stamps per user

**Step 6.4.2: Passport UI** ⏳
- Create passport page (`/passport`)
- Display collected stamps
- Show countries visited
- Visual passport design
- Share passport (social media)

**Step 6.4.3: Stamp Collection** ⏳
- Award stamp on order completion
- One stamp per country/seller
- Stamp design per country
- Achievement badges

**Deliverables:**
- Passport system
- Passport UI
- Stamp collection

**Success Criteria:**
- Stamps are awarded correctly
- Passport displays beautifully
- Sharing works

### 6.5 "Surprise Me" Feature ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Low (Brand Feature)  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 6.5.1: Surprise Algorithm** ⏳
- Random product selection
- Consider user preferences (if available)
- Exclude previously ordered products
- Select from different countries/categories

**Step 6.5.2: Surprise UI** ⏳
- "Surprise Me" button on homepage/catalog
- Animated reveal
- Product card with surprise product
- Add to cart option

**Deliverables:**
- Surprise feature
- UI implementation

**Success Criteria:**
- Surprise selection works
- UI is engaging
- Products are varied

### 6.6 Seasonal Themes ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Low  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 6.6.1: Theme System** ⏳
- Create theme configuration
- Define seasonal themes (Christmas, Valentine's, Easter)
- Theme colors and assets
- Theme switching logic

**Step 6.6.2: Theme Application** ⏳
- Apply theme based on date
- Update CSS variables
- Seasonal product banners
- Theme-specific imagery

**Deliverables:**
- Theme system
- Seasonal themes

**Success Criteria:**
- Themes apply correctly
- Visual changes are appealing

---

## Phase 7: Testing & Quality Assurance

**Status:** 🟡 **PARTIALLY COMPLETE**  
**Priority:** High  
**Estimated Time Remaining:** 2-3 weeks

### 7.1 E2E Test Coverage 🟡

**Status:** 🟡 **PARTIALLY COMPLETE**

**Priority:** High  
**Estimated Time:** 2 weeks

**Current Implementation:**
- ✅ Test structure (`tests/e2e/`)
- ✅ Buyer checkout test (`checkout.spec.ts`)
- ✅ Seller product test (`product.spec.ts`)
- ✅ Admin approval test (`approval.spec.ts`)
- ✅ Test utilities (`tests/utils/`)

**Remaining Tasks:**

**Step 7.1.1: Buyer Flow Tests** ⏳
- Registration and login
- Product browsing and search
- Add to cart
- Checkout flow
- Order history
- Product detail page

**Step 7.1.2: Seller Flow Tests** ⏳
- Seller registration
- Verification submission
- Product creation/editing
- Order management
- Dashboard stats

**Step 7.1.3: Admin Flow Tests** ⏳
- Seller approval/rejection
- Product management
- Order management
- Category management
- Activity log

**Step 7.1.4: Cross-Browser Testing** ⏳
- Test on Chrome, Firefox, Safari
- Mobile device testing
- Responsive design testing

**Deliverables:**
- Comprehensive test suite
- Cross-browser coverage
- Mobile testing

**Success Criteria:**
- All critical flows tested
- Tests are reliable
- Coverage >80%

### 7.2 Performance Optimization ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 7.2.1: Image Optimization** ⏳
- Implement image compression
- Lazy loading
- Responsive images
- CDN for images

**Step 7.2.2: Code Optimization** ⏳
- Code splitting
- Lazy load routes
- Optimize bundle size
- Remove unused dependencies

**Step 7.2.3: Database Optimization** ⏳
- Query optimization
- Add missing indexes
- Pagination for large datasets
- Cache frequently accessed data

**Deliverables:**
- Optimized images
- Optimized code
- Database optimizations

**Success Criteria:**
- Page load <2s
- Lighthouse score >90
- Database queries <100ms

### 7.3 Accessibility (a11y) ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 1 week

**Detailed Steps:**

**Step 7.3.1: Keyboard Navigation** ⏳
- Ensure all interactive elements keyboard accessible
- Tab order is logical
- Skip links
- Focus indicators

**Step 7.3.2: Screen Reader Support** ⏳
- ARIA labels
- Semantic HTML
- Alt text for images
- Form labels

**Step 7.3.3: WCAG Compliance** ⏳
- Color contrast ratios
- Text sizing
- Focus management
- Error messages

**Deliverables:**
- Keyboard navigation
- Screen reader support
- WCAG compliance

**Success Criteria:**
- WCAG 2.1 AA compliance
- Screen reader tested
- Keyboard navigation works

---

## Phase 8: Deployment & Launch

**Status:** ⏳ **NOT STARTED**  
**Priority:** Critical  
**Estimated Time:** 1-2 weeks

### 8.1 Production Environment Setup ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Critical  
**Estimated Time:** 3 days

**Detailed Steps:**

**Step 8.1.1: Supabase Production** ⏳
- Set up production Supabase project
- Migrate database schema
- Configure production RLS policies
- Set up production storage buckets

**Step 8.1.2: Frontend Deployment** ⏳
- Deploy to Vercel/Netlify
- Configure production environment variables
- Set up custom domain
- Configure SSL

**Step 8.1.3: CI/CD Pipeline** ⏳
- Set up GitHub Actions
- Automated testing on PR
- Automated deployment on merge
- Environment management

**Deliverables:**
- Production environment
- Deployment pipeline
- CI/CD setup

**Success Criteria:**
- Production site is live
- Deployments are automated
- Environment is secure

### 8.2 Monitoring & Analytics ⏳

**Status:** ⏳ **NOT STARTED**

**Priority:** Medium  
**Estimated Time:** 3 days

**Detailed Steps:**

**Step 8.2.1: Error Tracking** ⏳
- Set up error tracking (Sentry or similar)
- Monitor production errors
- Set up alerts

**Step 8.2.2: Analytics** ⏳
- Set up Google Analytics or similar
- Track user behavior
- Track conversions
- Monitor performance

**Step 8.2.3: Uptime Monitoring** ⏳
- Set up uptime monitoring
- Alert on downtime
- Monitor API response times

**Deliverables:**
- Error tracking
- Analytics
- Uptime monitoring

**Success Criteria:**
- Errors are tracked
- Analytics data collected
- Monitoring is active

### 8.3 Documentation ⏳

**Status:** 🟡 **PARTIALLY COMPLETE**

**Priority:** Medium  
**Estimated Time:** 1 week

**Current Implementation:**
- ✅ README.md
- ✅ SETUP_GUIDE.md

**Remaining Tasks:**

**Step 8.3.1: User Documentation** ⏳
- User guide for buyers
- Seller guide
- Admin guide
- FAQ page

**Step 8.3.2: Technical Documentation** ⏳
- API documentation
- Database schema documentation
- Deployment guide
- Contributing guide

**Deliverables:**
- User documentation
- Technical documentation

**Success Criteria:**
- Documentation is complete
- Easy to understand
- Up to date

---

## Future Expansion (Post-MVP)

### Phase 9: Advanced Features

**Status:** 📋 **PLANNED**

**Priority:** Low  
**Timeline:** Post-MVP

#### 9.1 Multi-Language & Multi-Currency
- Additional languages (French, Spanish, etc.)
- Currency conversion
- Regional pricing
- Localized content

#### 9.2 Advanced Analytics
- Seller analytics dashboard
- Customer behavior analytics
- Sales forecasting
- Inventory management

#### 9.3 Marketing Tools
- Email marketing integration
- Promotional campaigns
- Discount codes
- Affiliate program

#### 9.4 Logistics Integration
- Shipping API integration (DHL, UPS, FedEx)
- Real-time shipping rates
- Tracking integration
- Label printing

#### 9.5 Mobile App
- React Native or Flutter app
- Push notifications
- Mobile-optimized experience
- Offline capabilities

#### 9.6 Corporate Portal
- Bulk ordering interface
- Custom pricing for businesses
- Branded packaging options
- Account management

#### 9.7 Social Features
- Social sharing
- Wishlist sharing
- Gift options
- Referral program

#### 9.8 Advanced Search
- AI-powered product recommendations
- Visual search (image search)
- Voice search
- Personalized search results

---

## MVP Completion Checklist

### Critical Path (Must Have for MVP)
- [x] User authentication & authorization
- [x] Database schema & RLS policies
- [x] Seller verification system
- [x] Product CRUD operations
- [x] Shopping cart
- [x] Checkout flow
- [x] Order management
- [x] Admin dashboard
- [ ] Payment integration
- [ ] Email notifications
- [x] Product images display
- [x] Enhanced search & filtering
- [ ] Order status updates
- [ ] Seller profile management
- [ ] Contact seller feature
- [ ] E2E test coverage
- [ ] Production deployment

### Nice to Have (Can Launch Without)
- [ ] Reviews & ratings
- [ ] Chocolate Passport
- [ ] Surprise Me button
- [ ] Seasonal themes
- [ ] Advanced analytics
- [ ] Mobile app

---

## Current Implementation Status Summary

### ✅ Completed (Foundation)
- Project setup & infrastructure
- Database schema & security
- Authentication system
- Storage setup
- UI component library
- Basic buyer flows (registration, cart, checkout)
- Seller verification & product management
- Admin dashboard & management tools
- Activity logging
- Test structure

### 🟡 In Progress / Partially Complete
- Product detail page (needs enhancements - seller info, related products)
- Checkout flow (needs payment integration)
- Order tracking (needs status updates)
- Seller analytics
- Email notifications
- E2E test coverage

### ⏳ Not Started
- Payment integration
- Email service (requires Edge Functions setup)
- Supabase Edge Functions infrastructure
- Seller profile management
- Contact seller / messaging
- Reviews & ratings
- Chocolate Passport feature
- Surprise Me feature
- Seasonal themes
- Production deployment

---

## Next Steps (Immediate Priorities)

1. **Complete Payment Integration** (Critical)
   - Select payment provider
   - Implement payment processing
   - Test payment flow

2. **Email Notifications** (High)
   - Set up Supabase Edge Functions infrastructure (prerequisite)
   - Set up email service (Resend/SendGrid)
   - Create email templates
   - Implement order confirmations

3. **Product Images** (High)
   - Ensure images display correctly
   - Multiple image support
   - Image optimization

4. **Enhanced Search** (Medium)
   - Full-text search
   - Advanced filters
   - Search UI improvements

5. **Order Status Management** (Medium)
   - Seller status updates
   - Buyer notifications
   - Status tracking UI

---

## Notes

- This roadmap is a living document and should be updated as development progresses
- Priorities may shift based on user feedback and business needs
- Estimated times are rough guides and may vary
- Focus on MVP features first, then expand based on user feedback
- Regular testing and QA should be integrated throughout development

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Active Development

