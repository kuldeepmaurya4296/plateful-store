import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Notification } from '@/lib/db/models/Notification';
import { User } from '@/lib/db/models/User';
import { requireAuthRoles } from '@/lib/auth/serverAuth';

export async function POST(req: Request) {
  try {
    const auth = await requireAuthRoles(['superadmin']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const body = await req.json();
    const { title, message, targetRole } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required.' }, { status: 400 });
    }

    const userFilter: any = {};
    if (targetRole && targetRole !== 'all') {
      userFilter.role = targetRole;
    }

    const targetUsers = await User.find(userFilter, { id: 1 }).lean();

    const notificationsToCreate = targetUsers.map(user => ({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      title,
      message,
      type: 'broadcast',
      isRead: false,
      createdAt: new Date().toISOString()
    }));

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }

    return NextResponse.json({
      success: true,
      broadcastCount: notificationsToCreate.length,
      title,
      targetRole: targetRole || 'all'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
