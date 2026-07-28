import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Bill } from '@/lib/db/models/Bill';
import { requireAuthRoles } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuthRoles(['owner', 'manager', 'superadmin']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const billId = searchParams.get('billId');
    const format = searchParams.get('format') || 'csv'; // pdf | csv

    const filter: any = {};
    if (billId) filter.id = billId;
    if (auth.user.restaurantId) filter.restaurantId = auth.user.restaurantId;

    const bills = await Bill.find(filter).sort({ createdAt: -1 }).lean();

    if (format === 'csv') {
      const header = 'Bill ID,Table,Customer,Total,Tax,Grand Total,Payment Mode,Date\n';
      const rows = bills.map(b => 
        `"${b.id}",${b.tableNumber},"${b.customerName}",${b.total},${b.tax},${b.grandTotal},"${b.paymentMode}","${b.createdAt}"`
      ).join('\n');

      return new NextResponse(header + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="bills_export_${Date.now()}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      format: 'pdf',
      downloadUrl: `/api/bills/download?billId=${billId}&format=csv`,
      billCount: bills.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
