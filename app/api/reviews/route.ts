import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Review } from '@/lib/db/models/Review';
import { Visit } from '@/lib/db/models/Visit';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `rv_${Date.now()}`;
    }
    const review = await Review.create(body);

    if (body.visitId) {
      await Visit.findOneAndUpdate({ id: body.visitId }, { isReviewed: true });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
