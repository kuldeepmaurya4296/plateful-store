import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Review } from '@/lib/db/models/Review';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { responseText } = body;

    const review = await Review.findOneAndUpdate(
      { id }, 
      { ownerResponse: responseText }, 
      { new: true }
    ).lean();

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
