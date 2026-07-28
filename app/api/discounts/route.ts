import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { requireAuthRoles, checkSaaSPlanPermission } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    // Return sample or scheduled discount campaigns
    return NextResponse.json({
      success: true,
      restaurantId,
      campaigns: [
        {
          id: 'disc_1',
          code: 'HAPPYHOUR20',
          discountPercentage: 20,
          description: '20% off on all starters',
          startTime: '17:00',
          endTime: '20:00',
          isActive: true
        }
      ]
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
      const saasCheck = await checkSaaSPlanPermission(restaurantId, 'discount_campaigns');
      if (!saasCheck.allowed) {
        return NextResponse.json({ error: saasCheck.error }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      discount: {
        id: `disc_${Date.now()}`,
        ...body,
        restaurantId,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
