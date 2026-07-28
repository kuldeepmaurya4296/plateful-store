import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    const { emailOrUsername, newPassword } = await req.json();

    if (!emailOrUsername || !newPassword) {
      return NextResponse.json({ error: 'Account identity and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    await dbConnect();

    const cleanQuery = emailOrUsername.trim().toLowerCase();

    // Search user by email or username
    const user = await User.findOne({
      $or: [{ username: cleanQuery }, { email: cleanQuery }]
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found matching this email or username.' }, { status: 404 });
    }

    // Hash new password using bcrypt
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Password successfully reset for account ${user.username}.`
    });
  } catch (error: any) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reset password.' }, { status: 500 });
  }
}
