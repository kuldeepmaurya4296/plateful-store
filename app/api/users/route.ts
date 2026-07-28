import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const restaurantId = searchParams.get('restaurantId');

    const filter: any = {};
    if (role) filter.role = role;
    if (restaurantId) filter.restaurantId = restaurantId;

    const users = await User.find(filter).select('-passwordHash').lean();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `u_${Date.now()}`;
    }
    const user = await User.create(body);
    const userObj = user.toObject();
    delete userObj.passwordHash;
    return NextResponse.json(userObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
