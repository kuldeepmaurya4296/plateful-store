import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  id: string;
  visitId: string;
  restaurantId: string;
  userId: string;
  userName: string;
  foodRating: number;
  presentationRating: number;
  ambianceRating: number;
  text: string;
  ownerResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    id: { type: String, required: true, unique: true },
    visitId: { type: String, required: true },
    restaurantId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    foodRating: { type: Number, required: true },
    presentationRating: { type: Number, required: true },
    ambianceRating: { type: Number, required: true },
    text: { type: String, required: true },
    ownerResponse: { type: String }
  },
  { timestamps: true }
);

ReviewSchema.index({ restaurantId: 1, createdAt: -1 });

export const Review = mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);
export default Review;
