import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Counter } from '@/lib/db/models/Counter';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const counters = await Counter.find(filter).lean();
    return NextResponse.json(counters);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `c_${Date.now()}`;
    }
    const counter = await Counter.create(body);
    return NextResponse.json(counter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
