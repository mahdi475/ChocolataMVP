# Supabase Edge Functions

This directory contains Edge Functions for the Chocolata MVP.

## Functions

### 1. send-order-email
Sends order confirmation emails using Resend API.

**Deployment:**
```bash
supabase functions deploy send-order-email
```

**Required Secrets:**
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Verified sender email (optional)

### 2. payment-webhook
Handles webhooks from payment providers (Stripe, PayPal, Klarna).

**Deployment:**
```bash
supabase functions deploy payment-webhook
```

**Required Secrets:**
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (optional)
- `PAYPAL_WEBHOOK_SECRET` - PayPal webhook secret (optional)

### 3. send-order-status-email
Sends order status update emails (processing, shipped, completed, etc.).

**Deployment:**
```bash
supabase functions deploy send-order-status-email
```

**Required Secrets:**
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Verified sender email (optional)
- `APP_URL` - Your app URL for email links (optional)

## Setup

See `EDGE_FUNCTIONS_SETUP.md` for detailed setup instructions.

