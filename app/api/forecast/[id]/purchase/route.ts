import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { ForecastItem } from '@/lib/db/models/ForecastItem';
import { Expense } from '@/lib/db/models/Expense';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await ForecastItem.findOne({ id });
    if (!item) {
      return NextResponse.json({ error: 'Forecast item not found' }, { status: 404 });
    }

    item.isPurchased = true;
    await item.save();

    // Auto-create expense entry
    await Expense.create({
      id: `e_${Date.now()}`,
      restaurantId: item.restaurantId,
      itemName: item.itemName,
      quantity: item.quantityNeeded,
      cost: item.estimatedCost,
      category: 'Raw Material',
      date: new Date().toISOString().split('T')[0],
      notes: 'Purchased from forecast'
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
