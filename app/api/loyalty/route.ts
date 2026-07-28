import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Loyalty } from '@/lib/db/models/Loyalty';
import { getAuthSession } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    let loyalty = await Loyalty.findOne({ userId: user.id }).lean();
    if (!loyalty) {
      loyalty = await Loyalty.create({
        userId: user.id,
        points: 150,
        tier: 'Silver',
        history: [
          {
            id: `h_${Date.now()}`,
            type: 'earned',
            points: 150,
            description: 'Welcome bonus for joining Plateful',
            createdAt: new Date().toISOString()
          }
        ]
      });
    }

    return NextResponse.json(loyalty);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { action, points } = await req.json();

    let loyalty = await Loyalty.findOne({ userId: user.id });
    if (!loyalty) {
      loyalty = new Loyalty({ userId: user.id, points: 100, tier: 'Silver', history: [] });
    }

    if (action === 'redeem') {
      const redeemAmount = Number(points) || 50;
      if (loyalty.points < redeemAmount) {
        return NextResponse.json({ error: 'Insufficient loyalty points' }, { status: 400 });
      }

      loyalty.points -= redeemAmount;
      loyalty.history.unshift({
        id: `h_${Date.now()}`,
        type: 'redeemed',
        points: redeemAmount,
        description: `Redeemed ₹${redeemAmount} dining voucher`,
        createdAt: new Date().toISOString()
      });
      await loyalty.save();
    }

    return NextResponse.json(loyalty);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
