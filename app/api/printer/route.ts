import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { requireAuthRoles } from '@/lib/auth/serverAuth';

export async function POST(req: Request) {
  try {
    const auth = await requireAuthRoles(['owner', 'manager', 'captain', 'superadmin']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const body = await req.json();
    const { orderId, tableNumber, items, printerIp } = body;

    if (!orderId || !items) {
      return NextResponse.json({ error: 'orderId and items are required for printer job.' }, { status: 400 });
    }

    // Mock print job formatting (ESC/POS network stream simulated)
    const printJobId = `print_${Date.now()}`;
    console.log(`[Kitchen Printer] Routing order #${orderId} (Table ${tableNumber}) to printer at ${printerIp || '192.168.1.200'}`);

    return NextResponse.json({
      success: true,
      printJobId,
      status: 'SentToPrinter',
      orderId,
      tableNumber,
      itemCount: items.length,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
