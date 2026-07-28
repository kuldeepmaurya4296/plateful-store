import mongoose, { Schema, Document } from 'mongoose';

export interface IPostComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface IPostDocument extends Document {
  id: string;
  authorType: 'restaurant' | 'customer';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  restaurantId?: string;
  restaurantName?: string;
  city: string;
  photoUrl: string;
  caption: string;
  isVeg: boolean;
  rating?: number;
  likesCount: number;
  commentsCount: number;
  commentsList?: IPostComment[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    id: { type: String, required: true, unique: true },
    authorType: { type: String, enum: ['restaurant', 'customer'], required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '' },
    restaurantId: { type: String },
    restaurantName: { type: String },
    city: { type: String, required: true, index: true },
    photoUrl: { type: String, required: true },
    caption: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    rating: { type: Number },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    commentsList: [{
      id: String,
      userName: String,
      userAvatar: String,
      text: String,
      createdAt: String
    }]
  },
  { timestamps: true }
);

PostSchema.index({ city: 1, createdAt: -1 });

export const Post = mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);
export default Post;
