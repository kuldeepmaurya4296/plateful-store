import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const post = await Post.findOneAndUpdate(
      { id },
      { $inc: { likesCount: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
