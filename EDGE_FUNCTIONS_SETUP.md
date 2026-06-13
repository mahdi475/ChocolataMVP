# Supabase Edge Functions Setup Guide

This guide explains how to set up and deploy the Edge Functions needed for Chocolata MVP.

## Required Edge Functions

1. **send-order-email** - Sends order confirmation emails
2. **payment-webhook** - Handles payment provider webhooks (Stripe/PayPal/Klarna)
3. **send-order-status-email** - Sends order status update emails

## Prerequisites

1. **Supabase CLI** installed (choose one method):

   **Option A: Using Scoop (Recommended for Windows)**
   ```powershell
   # Install Scoop if you don't have it
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   
   # Install Supabase CLI
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

   **Option B: Using Chocolatey**
   ```powershell
   choco install supabase
   ```

   **Option C: Using npm (local project only, not global)**
   ```bash
   npm install supabase --save-dev
   # Then use: npx supabase <command>
   ```

   **Option D: Direct Download (Windows)**
   - Download from: https://github.com/supabase/cli/releases
   - Extract and add to PATH

2. **Verify installation:**
   ```bash
   supabase --version
   ```

3. **Supabase project** linked:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```
 
3. **Resend account** (for email sending):
   - Sign up at https://resend.com
   - Get your API key from the dashboard
   - Verify your domain (or use Resend's test domain)

4. **Payment provider accounts** (optional, for webhooks):
   - Stripe account and webhook secret
   - PayPal account and webhook secret
   - Klarna account and webhook secret

## Setup Instructions

### 1. Initialize Edge Functions (if not already done)

```bash
supabase functions new send-order-email
supabase functions new payment-webhook
supabase functions new send-order-status-email
```

### 2. Copy Function Code

Copy the contents of:
- `supabase/functions/send-order-email/index.ts` → Your Edge Function
- `supabase/functions/payment-webhook/index.ts` → Your Edge Function
- `supabase/functions/send-order-status-email/index.ts` → Your Edge Function

### 3. Set Environment Variables

Set these secrets in Supabase Dashboard or via CLI:

```bash
# Resend API Key (required for email functions)
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx

# Resend From Email (optional, defaults to noreply@chocolata.com)
supabase secrets set RESEND_FROM_EMAIL=noreply@yourdomain.com

# Payment Webhook Secrets (optional, for payment-webhook function)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
supabase secrets set PAYPAL_WEBHOOK_SECRET=your_paypal_secret

# App URL (for email links)
supabase secrets set APP_URL=https://yourdomain.com
```

**Via Supabase Dashboard:**
1. Go to Project Settings → Edge Functions → Secrets
2. Add each secret key-value pair

### 4. Deploy Functions

```bash
# Deploy all functions
supabase functions deploy send-order-email
supabase functions deploy payment-webhook
supabase functions deploy send-order-status-email

# Or deploy all at once
supabase functions deploy
```

### 5. Update Frontend Code

Update `src/lib/email.ts` to call the Edge Function:

```typescript
export async function sendOrderConfirmationEmail(emailData: OrderEmailData): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: emailData,
    });
    
    if (error) throw error;
    return data?.success || false;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}
```

### 6. Set Up Payment Webhooks

#### Stripe Webhook Setup:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/payment-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy webhook signing secret
5. Set `STRIPE_WEBHOOK_SECRET` in Supabase secrets

#### PayPal Webhook Setup:
1. Go to PayPal Developer Dashboard → Webhooks
2. Add webhook URL: `https://your-project.supabase.co/functions/v1/payment-webhook`
3. Select events: Payment capture completed, Payment capture denied
4. Copy webhook secret
5. Set `PAYPAL_WEBHOOK_SECRET` in Supabase secrets

## Function Details

### send-order-email

**Purpose:** Sends order confirmation emails to customers after order placement.

**Request Body:**
```typescript
{
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  shippingAddress: string;
  estimatedDeliveryDate?: string;
  paymentMethod: string;
  paymentStatus: string;
}
```

**Usage:**
```typescript
await supabase.functions.invoke('send-order-email', {
  body: orderEmailData,
});
```

### payment-webhook

**Purpose:** Handles webhooks from payment providers to update order payment status.

**Supported Providers:**
- Stripe (payment_intent.succeeded, payment_intent.payment_failed, charge.refunded)
- PayPal (payment capture events)
- Klarna (can be extended)

**Webhook URL:**
```
https://your-project.supabase.co/functions/v1/payment-webhook
```

**Note:** In production, verify webhook signatures for security.

### send-order-status-email

**Purpose:** Sends email notifications when order status changes (processing, shipped, completed, etc.).

**Request Body:**
```typescript
{
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderStatus: string; // 'processing' | 'shipped' | 'completed' | 'cancelled'
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}
```

**Usage:**
```typescript
await supabase.functions.invoke('send-order-status-email', {
  body: statusEmailData,
});
```

## Testing

### Test Email Function Locally

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve send-order-email

# Test with curl
curl -X POST http://localhost:54321/functions/v1/send-order-email \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test-123",
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "orderDate": "2025-01-10T12:00:00Z",
    "items": [{"name": "Test Product", "quantity": 1, "price": 100}],
    "subtotal": 100,
    "shippingCost": 49,
    "taxAmount": 25,
    "total": 174,
    "shippingAddress": "Test Address",
    "paymentMethod": "card",
    "paymentStatus": "completed"
  }'
```

## Troubleshooting

### Email Not Sending

1. Check Resend API key is set correctly
2. Verify domain is verified in Resend dashboard
3. Check Edge Function logs in Supabase Dashboard
4. Ensure `RESEND_FROM_EMAIL` matches verified domain

### Webhook Not Working

1. Verify webhook URL is correct
2. Check webhook secret matches provider
3. Review Edge Function logs for errors
4. Ensure order_id is included in payment metadata

### CORS Issues

Edge Functions include CORS headers. If you encounter CORS errors:
1. Check that Authorization header is included
2. Verify function URL is correct
3. Check browser console for specific error

## Alternative: Using Supabase Email

If you prefer not to use Resend, you can use Supabase's built-in email:

1. Enable email in Supabase Dashboard → Settings → Auth → Email Templates
2. Modify Edge Functions to use Supabase's email API instead of Resend
3. Note: Supabase email has rate limits and may require upgrade

## Security Notes

- Never commit API keys or secrets to git
- Use Supabase secrets management for all sensitive data
- Verify webhook signatures in production
- Use service role key only in Edge Functions (never expose to client)
- Implement rate limiting for email functions

## Cost Considerations

- Resend: Free tier includes 3,000 emails/month
- Supabase Edge Functions: Free tier includes 500,000 invocations/month
- Consider email service costs at scale

