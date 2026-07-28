import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { requireAuthRoles, checkSaaSPlanPermission } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    return NextResponse.json({
      success: true,
      restaurantId,
      todaysSpecial: {
        id: 'spec_1',
        title: "Chef's Special Truffle Pasta",
        description: 'Fresh homemade fettuccine with black truffle sauce',
        price: 499,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800'
      }
    });
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
      const saasCheck = await checkSaaSPlanPermission(restaurantId, 'todays_special');
      if (!saasCheck.allowed) {
        return NextResponse.json({ error: saasCheck.error }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      todaysSpecial: {
        id: `spec_${Date.now()}`,
        ...body,
        restaurantId,
        publishedAt: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
