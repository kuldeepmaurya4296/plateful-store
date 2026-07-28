import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Waitlist } from '@/lib/db/models/Waitlist';
import { sseManager } from '@/lib/realtime/sseManager';
import { getAuthSession } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const waitlist = await Waitlist.find(filter).sort({ createdAt: 1 }).lean();
    return NextResponse.json(waitlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthSession();
    await dbConnect();
    const body = await req.json();

    const existingWaiting = await Waitlist.countDocuments({
      restaurantId: body.restaurantId,
      status: 'waiting'
    });

    const entry = await Waitlist.create({
      id: `w_${Date.now()}`,
      restaurantId: body.restaurantId,
      userId: user?.id || `anon_${Date.now()}`,
      userName: body.userName || user?.name || 'Guest Diner',
      userPhone: body.userPhone || '9999999999',
      partySize: body.partySize || 2,
      status: 'waiting',
      position: existingWaiting + 1,
      estimatedWaitMinutes: (existingWaiting + 1) * 10
    });

    sseManager.broadcast(body.restaurantId, {
      type: 'notification:new',
      data: {
        title: 'New Waitlist Entry',
        message: `${entry.userName} (Party of ${entry.partySize}) joined the waitlist.`
      },
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
