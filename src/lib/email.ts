// Email sending utilities
// Requires Supabase Edge Function 'send-order-email' to be deployed
import { supabase } from './supabaseClient';

export interface OrderEmailData {
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

/**
 * Send order confirmation email
 * This will call a Supabase Edge Function when Edge Functions are set up
 */
export async function sendOrderConfirmationEmail(emailData: OrderEmailData): Promise<boolean> {
  try {
    // Call Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: emailData,
    });
    
    if (error) {
      console.error('Failed to invoke email Edge Function:', error);
      // Fallback: log email data if Edge Function is not available
      console.log('📧 Order confirmation email would be sent:', {
        to: emailData.customerEmail,
        subject: `Order Confirmation #${emailData.orderId.slice(0, 8)}`,
        orderId: emailData.orderId,
      });
      return false;
    }

    if (data?.success) {
      console.log('✅ Order confirmation email sent:', data.messageId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    // Don't fail the order if email fails - just log the error
    return false;
  }
}

/**
 * Generate HTML email template for order confirmation
 */
export function generateOrderConfirmationEmailHTML(data: OrderEmailData): string {
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

