import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { text, userName, userAvatar } = body;

    const newComment = {
      id: `c_${Date.now()}`,
      userName: userName || 'Anonymous',
      userAvatar: userAvatar || 'U',
      text,
      createdAt: new Date().toISOString()
    };

    const post = await Post.findOneAndUpdate(
      { id },
      { 
        $inc: { commentsCount: 1 },
        $push: { commentsList: newComment }
      },
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
