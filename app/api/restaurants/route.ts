import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Restaurant } from '@/lib/db/models/Restaurant';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    const filter: any = {};
    if (city) filter.city = new RegExp(city, 'i');

    const restaurants = await Restaurant.find(filter).lean();
    return NextResponse.json(restaurants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `r_${Date.now()}`;
    }
    const restaurant = await Restaurant.create(body);
    return NextResponse.json(restaurant, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
