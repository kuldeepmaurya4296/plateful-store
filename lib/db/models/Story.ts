import mongoose, { Schema, Document } from 'mongoose';

export interface IStoryDocument extends Document {
  id: string;
  restaurantId: string;
  mediaUrl: string;
  caption: string;
  isPermanent: boolean;
  expiresAt: Date | null;
  views?: number;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStoryDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    mediaUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    isPermanent: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
    title: { type: String }
  },
  { timestamps: true }
);

StorySchema.index({ restaurantId: 1, createdAt: -1 });
// TTL index: MongoDB automatically deletes documents when expiresAt passes.
// Non-permanent stories set expiresAt = createdAt + 24h; permanent stories set expiresAt = null.
// Documents with null expiresAt are never deleted by the TTL thread.
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.models.Story || mongoose.model<IStoryDocument>('Story', StorySchema);
export default Story;
