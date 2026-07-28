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

export const Story = mongoose.models.Story || mongoose.model<IStoryDocument>('Story', StorySchema);
export default Story;
