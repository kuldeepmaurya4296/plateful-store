import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { AuditLog } from '@/lib/db/models/AuditLog';
import { requireAuthRoles } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuthRoles(['superadmin', 'owner']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const filter: any = {};
    if (userId) filter.userId = userId;

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthRoles(['superadmin', 'owner', 'manager']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const body = await req.json();
    const { action, resource, details } = body;

    if (!action || !resource) {
      return NextResponse.json({ error: 'Action and resource are required.' }, { status: 400 });
    }

    const log = await AuditLog.create({
      id: `audit_${Date.now()}`,
      userId: auth.user.id,
      userName: auth.user.name || auth.user.username,
      action,
      resource,
      details: details || '',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
