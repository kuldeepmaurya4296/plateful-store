import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Expense } from '@/lib/db/models/Expense';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const expenses = await Expense.find(filter).sort({ date: -1 }).lean();
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `e_${Date.now()}`;
    }
    const expense = await Expense.create(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
