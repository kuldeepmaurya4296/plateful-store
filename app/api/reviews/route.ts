import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Review } from '@/lib/db/models/Review';
import { Visit } from '@/lib/db/models/Visit';
import { getAuthSession } from '@/lib/auth/serverAuth';

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
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required to submit review.' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { visitId, foodRating, presentationRating, ambianceRating, text } = body;

    if (!visitId) {
      return NextResponse.json({ error: 'visitId is required.' }, { status: 400 });
    }

    const visit = await Visit.findOne({ id: visitId });
    if (!visit) {
      return NextResponse.json({ error: 'Visit record not found.' }, { status: 404 });
    }

    if (visit.isReviewed) {
      return NextResponse.json({ error: 'Review already submitted for this visit.' }, { status: 400 });
    }

    // Enforce 10-minute review window server-side
    const now = new Date();
    const windowCloses = new Date(visit.reviewWindowClosesAt);

    if (now > windowCloses) {
      return NextResponse.json({ 
        error: 'Review window has expired. Reviews must be submitted within 10 minutes of payment.' 
      }, { status: 400 });
    }

    const reviewId = body.id || `rv_${Date.now()}`;
    const review = await Review.create({
      id: reviewId,
      visitId,
      restaurantId: visit.restaurantId,
      userId: user.id,
      userName: user.name || user.username,
      foodRating: Number(foodRating) || 5,
      presentationRating: Number(presentationRating) || 5,
      ambianceRating: Number(ambianceRating) || 5,
      text: text || ''
    });

    visit.isReviewed = true;
    await visit.save();

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

