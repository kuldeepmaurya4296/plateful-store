import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { ForecastItem } from '@/lib/db/models/ForecastItem';
import { requireAuthRoles, checkSaaSPlanPermission } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuthRoles(['owner', 'manager', 'superadmin']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId') || auth.user.restaurantId;

    const filter: any = {};
    if (restaurantId) filter.restaurantId = restaurantId;

    const forecast = await ForecastItem.find(filter).lean();
    return NextResponse.json(forecast);
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
      const saasCheck = await checkSaaSPlanPermission(restaurantId, 'raw_material_forecast');
      if (!saasCheck.allowed) {
        return NextResponse.json({ error: saasCheck.error }, { status: 403 });
      }
    }

    if (!body.id) {
      body.id = `f_${Date.now()}`;
    }
    const item = await ForecastItem.create({
      ...body,
      restaurantId
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

