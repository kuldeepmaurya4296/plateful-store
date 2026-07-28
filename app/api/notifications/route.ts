import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Notification } from '@/lib/db/models/Notification';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const filter: any = {};
    if (userId) filter.userId = userId;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `n_${Date.now()}`;
    }
    const notification = await Notification.create(body);
    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
