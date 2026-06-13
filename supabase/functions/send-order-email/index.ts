// Supabase Edge Function: Send Order Confirmation Email
// Uses Resend API for email delivery
// To deploy: supabase functions deploy send-order-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@chocolata.com';

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  shippingAddress: string;
  estimatedDeliveryDate?: string;
  paymentMethod: string;
  paymentStatus: string;
}

function generateOrderConfirmationEmailHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Chocolata</h1>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px;">
        <h2 style="color: #8B4513; margin-top: 0;">Order Confirmation</h2>
        <p>Thank you for your order, ${data.customerName}!</p>
        
        <div style="background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #8B4513;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> #${data.orderId.slice(0, 8).toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${data.paymentStatus}</p>
        </div>
        
        <h3 style="color: #8B4513;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #8B4513; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">${item.name}</td>
                <td style="padding: 10px; text-align: right;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">${new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="background-color: white; padding: 15px; margin: 15px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0;">Subtotal:</td>
              <td style="text-align: right; padding: 5px 0;">${new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(data.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Shipping:</td>
              <td style="text-align: right; padding: 5px 0;">${data.shippingCost === 0 ? 'FREE' : new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(data.shippingCost)}</td>
            </tr>
            ${data.taxAmount > 0 ? `
            <tr>
              <td style="padding: 5px 0;">Tax (VAT):</td>
              <td style="text-align: right; padding: 5px 0;">${new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(data.taxAmount)}</td>
            </tr>
            ` : ''}
            <tr style="font-size: 1.2em; font-weight: bold; border-top: 2px solid #8B4513; margin-top: 10px;">
              <td style="padding: 10px 0;">Total:</td>
              <td style="text-align: right; padding: 10px 0; color: #8B4513;">${new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(data.total)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: white; padding: 15px; margin: 15px 0;">
          <h3 style="color: #8B4513; margin-top: 0;">Shipping Address</h3>
          <p style="margin: 5px 0;">${data.shippingAddress.replace(/\n/g, '<br>')}</p>
          ${data.estimatedDeliveryDate ? `
            <p style="margin: 10px 0 0 0;"><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDeliveryDate).toLocaleDateString()}</p>
          ` : ''}
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
    const emailData: OrderEmailData = await req.json();

    // Validate required fields
    if (!emailData.customerEmail || !emailData.orderId) {
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
        subject: `Order Confirmation #${emailData.orderId.slice(0, 8).toUpperCase()}`,
        html: generateOrderConfirmationEmailHTML(emailData),
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
        message: 'Email sent successfully' 
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
    console.error('Error sending email:', error);
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

