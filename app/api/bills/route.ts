import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Bill } from '@/lib/db/models/Bill';
import { Table } from '@/lib/db/models/Table';
import { Visit } from '@/lib/db/models/Visit';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const bills = await Bill.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(bills);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { tableId, paymentMode, settledBy, slipPhoto } = body;

    const table = await Table.findOne({ id: tableId });
    if (!table || !table.activeSession) {
      return NextResponse.json({ error: 'Table or active session not found' }, { status: 400 });
    }

    const session = table.activeSession;
    const billId = `B-${Math.floor(1000 + Math.random() * 9000)}`;
    const grandTotal = Math.round(session.total * 1.05);

    const newBill = await Bill.create({
      id: billId,
      tableNumber: table.number,
      restaurantId: table.restaurantId,
      customerName: session.customerName || 'Anonymous',
      customerPhone: session.customerPhone || '',
      paymentMode: paymentMode || 'Cash',
      total: session.total,
      tax: Math.round(session.total * 0.05),
      discount: 0,
      grandTotal,
      startedBy: session.startedBy || settledBy,
      settledBy: settledBy || 'Manager',
      items: session.items,
      slipPhoto
    });

    // Create visit record for review window
    await Visit.create({
      id: `v_${Date.now()}`,
      userId: 'u1',
      restaurantId: table.restaurantId,
      tableId: table.id,
      paymentConfirmedAt: new Date().toISOString(),
      reviewWindowOpensAt: new Date().toISOString(),
      reviewWindowClosesAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      isReviewed: false,
      billId
    });

    // Free the table
    table.status = 'available';
    table.activeSession = null;
    await table.save();

    return NextResponse.json(newBill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
