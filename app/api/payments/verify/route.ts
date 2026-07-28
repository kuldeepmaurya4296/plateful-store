import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuthSession } from '@/lib/auth/serverAuth';

export async function POST(req: Request) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, isMock } = await req.json();

    if (isMock) {
      return NextResponse.json({
        success: true,
        verified: true,
        paymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
        message: 'Mock payment verified successfully.'
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment verification credentials.' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '7e1brirGKxSU6DSUcP6nUi12';
    const bodyStr = `${razorpayOrderId}|${razorpayPaymentId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(bodyStr)
      .digest('hex');

    const isVerified = expectedSignature === razorpaySignature;

    if (!isVerified) {
      return NextResponse.json({ error: 'Invalid payment signature verification failed.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
