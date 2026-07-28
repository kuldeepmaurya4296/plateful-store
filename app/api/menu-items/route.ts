import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { MenuItem } from '@/lib/db/models/MenuItem';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const items = await MenuItem.find(filter).lean();
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `m_${Date.now()}`;
    }
    const item = await MenuItem.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
