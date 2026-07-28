import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Story } from '@/lib/db/models/Story';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const story = await Story.findOne({ id });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    story.isPermanent = !story.isPermanent;
    story.expiresAt = story.isPermanent 
      ? null 
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    await story.save();
    return NextResponse.json(story);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
