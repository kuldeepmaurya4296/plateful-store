import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';
import { getAuthSession } from '@/lib/auth/serverAuth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const isVeg = searchParams.get('isVeg');
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const filter: any = {};
    if (city && city !== 'All') {
      filter.city = new RegExp(city, 'i');
    }
    if (isVeg !== null && isVeg !== undefined && isVeg !== '') {
      filter.isVeg = isVeg === 'true';
    }
    if (cursor) {
      filter.createdAt = { $lt: cursor };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.createdAt || null;
    }

    return NextResponse.json({
      posts,
      nextCursor
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Session required to publish post.' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `p_${Date.now()}`;
    }
    const post = await Post.create({
      ...body,
      authorName: user.name || user.username || 'Anonymous',
      createdAt: new Date().toISOString()
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

