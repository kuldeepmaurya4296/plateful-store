import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurantDocument extends Document {
  id: string;
  name: string;
  city: string;
  address: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  description: string;
  phone: string;
  email: string;
  features: string[];
  coverImage: string;
  subscriptionPlan: 'Basic' | 'Premium' | 'Enterprise';
  subscriptionStatus: 'Active' | 'Suspended';
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    avatar: { type: String, default: 'R' },
    description: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    features: [{ type: String }],
    coverImage: { type: String, default: '' },
    subscriptionPlan: { 
      type: String, 
      enum: ['Basic', 'Premium', 'Enterprise'], 
      default: 'Basic' 
    },
    subscriptionStatus: { 
      type: String, 
      enum: ['Active', 'Suspended'], 
      default: 'Active' 
    }
  },
  { timestamps: true }
);

RestaurantSchema.index({ city: 1, subscriptionStatus: 1 });

export const Restaurant = mongoose.models.Restaurant || mongoose.model<IRestaurantDocument>('Restaurant', RestaurantSchema);
export default Restaurant;
