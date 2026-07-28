import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Order } from '@/lib/db/models/Order';
import { sseManager } from '@/lib/realtime/sseManager';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `o_${Date.now()}`;
    }
    const order = await Order.create(body);

    if (order.restaurantId) {
      sseManager.broadcast(order.restaurantId, {
        type: 'order:new',
        data: order.toObject ? order.toObject() : order,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
