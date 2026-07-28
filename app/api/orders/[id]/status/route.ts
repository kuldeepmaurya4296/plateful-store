import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Order } from '@/lib/db/models/Order';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const order = await Order.findOneAndUpdate({ id }, { status }, { new: true }).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
