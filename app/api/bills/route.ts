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
    const query = searchParams.get('query');
    const paymentMode = searchParams.get('paymentMode');
    const allTime = searchParams.get('allTime') === 'true';

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (paymentMode) filter.paymentMode = paymentMode;

    // Default to bills from previous 24 hours per SRS FR-B.4.2
    if (!allTime) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: twentyFourHoursAgo };
    }

    if (query) {
      filter.$or = [
        { id: { $regex: query, $options: 'i' } },
        { customerName: { $regex: query, $options: 'i' } },
        { customerPhone: { $regex: query, $options: 'i' } },
        { settledBy: { $regex: query, $options: 'i' } },
        { startedBy: { $regex: query, $options: 'i' } }
      ];
    }

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

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { billId, action, refundReason, refundAmount } = body;

    if (!billId || !action) {
      return NextResponse.json({ error: 'billId and action are required.' }, { status: 400 });
    }

    const bill = await Bill.findOne({ id: billId });
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found.' }, { status: 404 });
    }

    if (action === 'refund') {
      bill.refundStatus = 'Refunded';
      bill.refundReason = refundReason || 'Customer requested';
      bill.refundAmount = refundAmount || bill.grandTotal;
      await bill.save();
      return NextResponse.json({ success: true, action: 'refund', bill });
    } else if (action === 'reprint') {
      bill.reprintCount = (bill.reprintCount || 0) + 1;
      bill.lastReprintedAt = new Date().toISOString();
      await bill.save();
      return NextResponse.json({ success: true, action: 'reprint', reprintCount: bill.reprintCount, bill });
    }

    return NextResponse.json({ error: `Unsupported action '${action}'.` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

