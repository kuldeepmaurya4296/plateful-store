import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, username, password, role } = await req.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    await dbConnect();

    // Check if username or email already registered
    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }]
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Email address is already registered.' }, { status: 400 });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role || 'customer';

    // Create user in MongoDB Atlas
    const newUser = await User.create({
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      username: cleanUsername,
      passwordHash,
      role: assignedRole,
      avatar: name.trim().slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user account' }, { status: 500 });
  }
}
