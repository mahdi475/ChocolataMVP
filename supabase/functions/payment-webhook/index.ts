// Supabase Edge Function: Payment Webhook Handler
// Handles webhooks from Stripe, PayPal, or Klarna
// To deploy: supabase functions deploy payment-webhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const PAYPAL_WEBHOOK_SECRET = Deno.env.get('PAYPAL_WEBHOOK_SECRET');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
      },
    });
  }

  try {
    // Create Supabase admin client (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    // Determine which payment provider sent the webhook
    let provider = 'unknown';
    let event: any;

    if (signature && STRIPE_WEBHOOK_SECRET) {
      // Stripe webhook
      provider = 'stripe';
      // Note: In production, verify Stripe signature
      // const stripe = await import('https://esm.sh/stripe@14.21.0');
      // event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      event = JSON.parse(body);
    } else {
      // PayPal or other provider
      provider = 'paypal';
      event = JSON.parse(body);
    }

    console.log(`Received ${provider} webhook:`, event.type || event.event_type);

    // Handle different webhook event types
    switch (event.type || event.event_type) {
      case 'payment_intent.succeeded':
      case 'checkout.session.completed':
      case 'charge.succeeded':
        // Payment succeeded - update order status
        const transactionId = event.data?.object?.id || event.id;
        const orderId = event.data?.object?.metadata?.order_id || event.metadata?.order_id;

        if (orderId && transactionId) {
          const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'completed',
              payment_transaction_id: transactionId,
              status: 'processing', // Move order to processing
            })
            .eq('id', orderId);

          if (updateError) {
            console.error('Failed to update order:', updateError);
            throw updateError;
          }

          console.log(`Order ${orderId} payment confirmed`);
        }
        break;

      case 'payment_intent.payment_failed':
      case 'charge.failed':
        // Payment failed - update order status
        const failedTransactionId = event.data?.object?.id || event.id;
        const failedOrderId = event.data?.object?.metadata?.order_id || event.metadata?.order_id;

        if (failedOrderId) {
          await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'failed',
              payment_transaction_id: failedTransactionId,
            })
            .eq('id', failedOrderId);
        }
        break;

      case 'charge.refunded':
        // Refund processed
        const refundedTransactionId = event.data?.object?.id || event.id;
        const refundedOrderId = event.data?.object?.metadata?.order_id || event.metadata?.order_id;

        if (refundedOrderId) {
          await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'refunded',
            })
            .eq('id', refundedOrderId);
        }
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type || event.event_type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Webhook processing failed' 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 400,
      }
    );
  }
});

