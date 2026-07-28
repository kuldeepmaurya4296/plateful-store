import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Table } from '@/lib/db/models/Table';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const tables = await Table.find(filter).sort({ number: 1 }).lean();
    return NextResponse.json(tables);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `t_${Date.now()}`;
    }
    const table = await Table.create(body);
    return NextResponse.json(table, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
