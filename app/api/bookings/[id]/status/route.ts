import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Booking } from '@/lib/db/models/Booking';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { status, tableNumber } = body;

    const booking = await Booking.findOneAndUpdate(
      { id }, 
      { status, ...(tableNumber !== undefined && { tableNumber }) }, 
      { new: true }
    ).lean();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
