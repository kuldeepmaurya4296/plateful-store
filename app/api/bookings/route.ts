import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Booking } from '@/lib/db/models/Booking';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    const userId = searchParams.get('userId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (userId) filter.userId = userId;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `b_${Date.now()}`;
    }
    const booking = await Booking.create(body);
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
