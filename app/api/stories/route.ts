import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Story } from '@/lib/db/models/Story';
import { requireAuthRoles, checkSaaSPlanPermission } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    // Filter out stories older than 24h unless marked as permanent
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    filter.$or = [
      { isPermanent: true },
      { createdAt: { $gte: twentyFourHoursAgo } }
    ];

    const stories = await Story.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(stories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthRoles(['owner', 'manager', 'superadmin']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const body = await req.json();
    const restaurantId = body.restaurantId || auth.user.restaurantId;

    if (restaurantId) {
      const saasCheck = await checkSaaSPlanPermission(restaurantId, 'customer_stories');
      if (!saasCheck.allowed) {
        return NextResponse.json({ error: saasCheck.error }, { status: 403 });
      }
    }

    if (!body.id) {
      body.id = `s_${Date.now()}`;
    }

    const isPermanent = body.isPermanent === true;
    const now = new Date();
    const expiresAt = isPermanent ? null : new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      ...body,
      restaurantId,
      isPermanent,
      expiresAt,
      createdAt: now.toISOString()
    });
    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

