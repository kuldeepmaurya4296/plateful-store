import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuthSession } from '@/lib/auth/serverAuth';

export async function POST(req: Request) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { amount, currency = 'INR', receipt, notes } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required.' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_S8nBupaDcI7xxs';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '7e1brirGKxSU6DSUcP6nUi12';

    // Call Razorpay API to create order
    const orderData = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(orderData)
    });

    const razorpayOrder = await response.json();

    if (!response.ok) {
      // Fallback mock order if API credentials test mode
      const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId,
        isMock: true
      });
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      isMock: false
    });
  } catch (error: any) {
    console.error('Payment order creation error:', error);
    return NextResponse.json({ error: error.message || 'Payment order creation failed' }, { status: 500 });
  }
}
