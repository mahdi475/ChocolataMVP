# Future Edge Functions Implementation Guide

**Status:** ⏳ **NOT YET IMPLEMENTED**  
**Priority:** High (Required for email notifications and payment webhooks)  
**Estimated Time:** 2-3 days

## Overview

This document outlines the Edge Functions that need to be implemented in Supabase for the Chocolata MVP. These functions are currently structured but not deployed. The frontend code is ready and will automatically use these functions once deployed.

## Required Edge Functions

### 1. send-order-email ✅ (Code Ready)

**Purpose:** Sends order confirmation emails to customers after successful checkout.

**Status:** 
- ✅ Code written (`supabase/functions/send-order-email/index.ts`)
- ✅ Frontend integration ready (`src/lib/email.ts`)
- ⏳ Not yet deployed
- ⏳ Resend API not configured

**What It Does:**
- Receives order data from frontend
- Generates HTML email template
- Sends email via Resend API
- Returns success/failure status

**Required Setup:**
1. Create Resend account (https://resend.com)
2. Get Resend API key
3. Verify sender domain (or use Resend test domain)
4. Deploy function to Supabase
5. Set environment secrets:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (optional)

**Files:**
- `supabase/functions/send-order-email/index.ts` - Function code
- `src/lib/email.ts` - Frontend caller (already integrated)

**Deployment Command:**
```bash
supabase functions deploy send-order-email
```

**Testing:**
- Function will be called automatically after order creation
- Check Supabase Edge Functions logs for errors
- Verify emails arrive in customer inbox

---

### 2. payment-webhook ✅ (Code Ready)

**Purpose:** Handles webhooks from payment providers (Stripe, PayPal, Klarna) to update order payment status.

**Status:**
- ✅ Code written (`supabase/functions/payment-webhook/index.ts`)
- ⏳ Not yet deployed
- ⏳ Payment provider webhooks not configured

**What It Does:**
- Receives webhook events from Stripe/PayPal/Klarna
- Verifies webhook signatures (security)
- Updates order payment status in database
- Handles payment success, failure, and refund events

**Required Setup:**
1. Set up Stripe account (or PayPal/Klarna)
2. Configure webhook endpoint in payment provider dashboard
3. Get webhook signing secrets
4. Deploy function to Supabase
5. Set environment secrets:
   - `STRIPE_WEBHOOK_SECRET` (if using Stripe)
   - `PAYPAL_WEBHOOK_SECRET` (if using PayPal)

**Webhook URL Format:**
```
https://[your-project-ref].supabase.co/functions/v1/payment-webhook
```

**Files:**
- `supabase/functions/payment-webhook/index.ts` - Function code

**Deployment Command:**
```bash
supabase functions deploy payment-webhook
```

**Testing:**
- Use Stripe webhook testing tool
- Send test events from payment provider dashboard
- Verify orders update correctly in database

---

### 3. send-order-status-email ✅ (Code Ready)

**Purpose:** Sends email notifications when order status changes (processing → shipped → completed).

**Status:**
- ✅ Code written (`supabase/functions/send-order-status-email/index.ts`)
- ⏳ Not yet deployed
- ⏳ Not yet integrated with order status updates

**What It Does:**
- Receives order status update data
- Generates status-specific email template
- Sends email notification to customer
- Includes tracking number and delivery date if available

**Required Setup:**
1. Same Resend setup as `send-order-email`
2. Deploy function to Supabase
3. Integrate with seller order status update flow
4. Set environment secrets:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `APP_URL` (for email links)

**Files:**
- `supabase/functions/send-order-status-email/index.ts` - Function code

**Deployment Command:**
```bash
supabase functions deploy send-order-status-email
```

**Integration Points:**
- Call from seller dashboard when updating order status
- Call from admin panel when processing orders
- Trigger automatically via database triggers (future enhancement)

---

## Implementation Checklist

### Phase 1: Email Functions Setup

- [ ] **Install Supabase CLI**
  - [ ] Choose installation method (Scoop/Chocolatey/npm local)
  - [ ] Verify installation: `supabase --version`
  - [ ] Login: `supabase login`
  - [ ] Link project: `supabase link --project-ref [your-ref]`

- [ ] **Set Up Resend Account**
  - [ ] Sign up at https://resend.com
  - [ ] Get API key from dashboard
  - [ ] Verify sender domain (or use test domain)
  - [ ] Test email sending manually

- [ ] **Deploy Email Functions**
  - [ ] Deploy `send-order-email`: `supabase functions deploy send-order-email`
  - [ ] Deploy `send-order-status-email`: `supabase functions deploy send-order-status-email`
  - [ ] Set secrets in Supabase Dashboard:
    - `RESEND_API_KEY`
    - `RESEND_FROM_EMAIL`
    - `APP_URL`

- [ ] **Test Email Functions**
  - [ ] Place a test order
  - [ ] Verify confirmation email is sent
  - [ ] Check Edge Functions logs for errors
  - [ ] Test status update email manually

### Phase 2: Payment Webhook Setup

- [ ] **Set Up Payment Provider**
  - [ ] Choose provider (Stripe recommended)
  - [ ] Create account and get API keys
  - [ ] Set up test mode

- [ ] **Deploy Webhook Function**
  - [ ] Deploy `payment-webhook`: `supabase functions deploy payment-webhook`
  - [ ] Get webhook URL from Supabase Dashboard
  - [ ] Configure webhook in payment provider dashboard
  - [ ] Set webhook secret: `supabase secrets set STRIPE_WEBHOOK_SECRET=[secret]`

- [ ] **Test Webhook**
  - [ ] Send test webhook from payment provider
  - [ ] Verify order status updates correctly
  - [ ] Check Edge Functions logs

### Phase 3: Integration & Testing

- [ ] **Frontend Integration**
  - [ ] Verify `src/lib/email.ts` calls Edge Functions correctly
  - [ ] Test order confirmation flow end-to-end
  - [ ] Test order status update flow

- [ ] **Error Handling**
  - [ ] Test email failures (invalid API key)
  - [ ] Test webhook failures (invalid signature)
  - [ ] Verify graceful error handling

- [ ] **Production Readiness**
  - [ ] Switch Resend to production domain
  - [ ] Switch payment provider to live mode
  - [ ] Set up monitoring/alerts
  - [ ] Document webhook URLs for team

---

## File Structure

```
supabase/
└── functions/
    ├── send-order-email/
    │   └── index.ts          ✅ Ready
    ├── payment-webhook/
    │   └── index.ts          ✅ Ready
    └── send-order-status-email/
        └── index.ts          ✅ Ready
```

## Environment Variables Needed

Set these in Supabase Dashboard → Edge Functions → Secrets:

```bash
# Email Service (Required)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Configuration (Optional)
APP_URL=https://yourdomain.com

# Payment Webhooks (Optional - only if using webhooks)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
PAYPAL_WEBHOOK_SECRET=your_paypal_secret
```

## Cost Estimates

### Resend (Email Service)
- **Free Tier:** 3,000 emails/month
- **Pro Tier:** $20/month for 50,000 emails
- **Cost per email:** ~$0.0004 after free tier

### Supabase Edge Functions
- **Free Tier:** 500,000 invocations/month
- **Pro Tier:** $25/month for 2M invocations
- **Cost per invocation:** ~$0.0000125 after free tier

### Estimated Monthly Costs (MVP)
- **Low volume (100 orders/month):** $0 (within free tiers)
- **Medium volume (1,000 orders/month):** $0-20 (depending on email volume)
- **High volume (10,000 orders/month):** $20-50

## Alternative Approaches

If Edge Functions are not available, consider:

1. **Email Service Alternatives:**
   - Use Supabase's built-in email (limited templates)
   - Use external service like SendGrid directly from frontend (not recommended for security)
   - Use a backend service (Node.js/Express) instead of Edge Functions

2. **Webhook Alternatives:**
   - Use Stripe's hosted webhook page
   - Use a service like Zapier/Make.com
   - Handle webhooks in a separate backend service

## Current Status

### What Works Now:
- ✅ Order creation works without emails
- ✅ Payment processing works (mock)
- ✅ Order status updates work (without email notifications)
- ✅ Frontend is ready to call Edge Functions

### What Doesn't Work Yet:
- ⏳ Order confirmation emails (function ready, not deployed)
- ⏳ Order status update emails (function ready, not deployed)
- ⏳ Payment webhook processing (function ready, not deployed)
- ⏳ Real payment processing (mock only)

## Next Steps When Ready

1. **Read Setup Guide:**
   - `EDGE_FUNCTIONS_SETUP.md` - Complete setup instructions
   - `INSTALL_SUPABASE_CLI_WINDOWS.md` - CLI installation guide

2. **Follow Implementation Checklist:**
   - Start with Phase 1 (Email Functions)
   - Then Phase 2 (Payment Webhooks)
   - Finally Phase 3 (Integration & Testing)

3. **Test Thoroughly:**
   - Test in development/staging first
   - Verify emails arrive correctly
   - Test webhook processing
   - Monitor Edge Function logs

4. **Deploy to Production:**
   - Switch to production Resend domain
   - Use live payment provider keys
   - Set up monitoring

## Support Resources

- **Supabase Edge Functions Docs:** https://supabase.com/docs/guides/functions
- **Resend API Docs:** https://resend.com/docs
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Function Code Location:** `supabase/functions/` directory

## Notes

- All Edge Function code is ready and tested (syntax-wise)
- Frontend integration is complete - emails will send automatically once functions are deployed
- Functions use Resend for email delivery (modern, reliable, good free tier)
- Webhook function supports Stripe, PayPal, and can be extended for Klarna
- All functions include proper error handling and CORS support

---

**Last Updated:** January 2025  
**Status:** Ready for implementation when Supabase Edge Functions infrastructure is set up

