// Supabase Edge Function: Send Order Status Update Email
// Sends email when order status changes (processing, shipped, completed, etc.)
// To deploy: supabase functions deploy send-order-status-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@chocolata.com';

interface StatusEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderStatus: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

function generateStatusEmailHTML(data: StatusEmailData): string {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    processing: {
      title: 'Your Order is Being Processed',
      message: 'We\'ve received your order and are preparing it for shipment.',
      color: '#2196F3',
    },
    shipped: {
      title: 'Your Order Has Shipped!',
      message: 'Great news! Your order is on its way.',
      color: '#4CAF50',
    },
    completed: {
      title: 'Order Delivered',
      message: 'Your order has been delivered. We hope you enjoy your purchase!',
      color: '#4CAF50',
    },
    cancelled: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact support.',
      color: '#F44336',
    },
  };

  const statusInfo = statusMessages[data.orderStatus] || {
    title: 'Order Status Update',
    message: `Your order status has been updated to: ${data.orderStatus}`,
    color: '#8B4513',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Chocolata</h1>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px;">
        <h2 style="color: ${statusInfo.color}; margin-top: 0;">${statusInfo.title}</h2>
        <p>Hello ${data.customerName},</p>
        <p>${statusInfo.message}</p>
        
        <div style="background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid ${statusInfo.color};">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> #${data.orderId.slice(0, 8).toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: capitalize;">${data.orderStatus}</span></p>
          ${data.trackingNumber ? `
            <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
          ` : ''}
          ${data.estimatedDeliveryDate ? `
            <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDeliveryDate).toLocaleDateString()}</p>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <a href="${Deno.env.get('APP_URL') || 'https://chocolata.com'}/orders/${data.orderId}" 
             style="display: inline-block; background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0;">
            View Order Details
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 0.9em;">If you have any questions, please contact our support team.</p>
          <p style="color: #666; font-size: 0.9em;">Thank you for shopping with Chocolata!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Parse request body
    const emailData: StatusEmailData = await req.json();

    // Validate required fields
    if (!emailData.customerEmail || !emailData.orderId || !emailData.orderStatus) {
      throw new Error('Missing required email data');
    }

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: emailData.customerEmail,
        subject: `Order Status Update #${emailData.orderId.slice(0, 8).toUpperCase()}`,
        html: generateStatusEmailHTML(emailData),
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      throw new Error(`Resend API error: ${errorData}`);
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id,
        message: 'Status email sent successfully' 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending status email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
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

