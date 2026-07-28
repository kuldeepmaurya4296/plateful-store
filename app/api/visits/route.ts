import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Visit } from '@/lib/db/models/Visit';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const filter: any = {};
    if (userId) filter.userId = userId;

    const visits = await Visit.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(visits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
