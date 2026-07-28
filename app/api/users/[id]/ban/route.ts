import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findOne({ id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;
    return NextResponse.json(userObj);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
