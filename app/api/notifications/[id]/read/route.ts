import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Notification } from '@/lib/db/models/Notification';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const notification = await Notification.findOneAndUpdate(
      { id }, 
      { isRead: true }, 
      { new: true }
    ).lean();

    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
