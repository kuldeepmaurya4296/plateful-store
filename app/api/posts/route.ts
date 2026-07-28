import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    const filter: any = {};
    if (city) filter.city = new RegExp(city, 'i');

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.id) {
      body.id = `p_${Date.now()}`;
    }
    const post = await Post.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
