import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { dbConnect } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  username: z.string().min(3, 'Username must be at least 3 characters.').max(25, 'Username too long.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['superadmin', 'owner', 'manager', 'captain', 'customer']).optional()
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limitResult = rateLimit(`register_${ip}`, 10, 60000); // 10 registrations per min
    if (!limitResult.success) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const parseResult = RegisterSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e: any) => e.message).join(' ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, username, password, role } = parseResult.data;
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

