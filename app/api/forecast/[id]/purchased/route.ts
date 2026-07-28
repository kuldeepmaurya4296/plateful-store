import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { ForecastItem } from '@/lib/db/models/ForecastItem';
import { Expense } from '@/lib/db/models/Expense';
import { requireAuthRoles } from '@/lib/auth/serverAuth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuthRoles(['owner', 'manager', 'superadmin']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { id } = await params;

    const forecastItem = await ForecastItem.findOne({ id });
    if (!forecastItem) {
      return NextResponse.json({ error: 'Forecast item not found.' }, { status: 404 });
    }

    if (forecastItem.isPurchased) {
      return NextResponse.json({ error: 'Forecast item is already marked as purchased.' }, { status: 400 });
    }

    forecastItem.isPurchased = true;
    await forecastItem.save();

    // Automatically create corresponding Expense entry
    const expenseId = `exp_${Date.now()}`;
    const newExpense = await Expense.create({
      id: expenseId,
      restaurantId: forecastItem.restaurantId,
      category: 'Raw Materials',
      description: `${forecastItem.itemName} (${forecastItem.quantityNeeded})`,
      amount: forecastItem.estimatedCost,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      forecastItem,
      expense: newExpense
    });
  } catch (error: any) {
    console.error('Mark purchased error:', error);
    return NextResponse.json({ error: error.message || 'Failed to mark forecast item purchased' }, { status: 500 });
  }
}
